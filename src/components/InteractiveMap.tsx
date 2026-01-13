import React, { useEffect, useRef, useState, useMemo, forwardRef, useImperativeHandle, useCallback } from 'react';
import * as d3 from 'd3';
import { getBrightStars, getConstellationLines, getMilkyWayFeature, getSolarSystemObjects, StarFeature, ConstellationLineFeature } from '@/lib/celestial-data';
import { Memory } from '@/hooks/useMemories';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { CosmicInfoCard } from './CosmicInfoCard';
import { getConstellationArt } from '@/lib/constellation-art';
import { getLST, celestialToHorizon, getSunPosition, horizonToCelestial, getGMST, getParallacticAngle } from '@/lib/astro-math';

interface InteractiveMapProps {
    memories: Memory[];
    onMemoryClick?: (memory: Memory) => void;
    observerLocation?: { lat: number; lng: number; date: Date };
    controlMode?: 'polar' | 'pan';
    className?: string;
}

export interface InteractiveMapHandle {
    zoomIn: () => void;
    zoomOut: () => void;
    resetView: () => void;
}

export const InteractiveMap = forwardRef<InteractiveMapHandle, InteractiveMapProps>(({ memories, onMemoryClick, observerLocation, controlMode = 'polar', className = '' }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const projectionRef = useRef(d3.geoStereographic().scale(600).rotate([0, 0, 0]).clipAngle(179.9));
    const rotationRef = useRef<[number, number, number]>([0, 0, 0]);
    const targetRotationRef = useRef<[number, number, number] | null>([0, 0, 0]);
    const artRef = useRef<string | null>(null);

    const handleZoom = useCallback((delta: number) => {
        const current = projectionRef.current.scale();
        projectionRef.current.scale(Math.max(200, Math.min(4000, current + delta)));
    }, []);

    const resetView = useCallback(() => {
        targetRotationRef.current = [0, 0, 0];
        projectionRef.current.scale(600);
        setSelectedObject(null);
    }, []);

    const [hoveredObject, setHoveredObject] = useState<any | null>(null);
    const [selectedObject, setSelectedObject] = useState<{ type: 'star' | 'constellation' | 'planet', data: any, coords?: [number, number] } | null>(null);
    const [artImage, setArtImage] = useState<HTMLImageElement | null>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });
    const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);

    useEffect(() => {
        if (!containerRef.current) return;
        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                setSize({ width, height });
                if (projectionRef.current) {
                    projectionRef.current.translate([width / 2, height / 2]);
                }
            }
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // Memoized Data to prevent expensive re-parsing
    const celestialData = useMemo(() => {
        try {
            const date = observerLocation?.date || new Date();
            const lat = observerLocation ? observerLocation.lat : 90;
            const obsLoc = observerLocation;
            const lst = observerLocation ? getLST(date, observerLocation.lng) : 0;

            // Base Data (Equatorial J2000)
            const stars = getBrightStars() || [];
            const constellations = getConstellationLines() || [];
            const milkyWay = getMilkyWayFeature() || { type: 'Feature', geometry: { type: 'MultiPolygon', coordinates: [] } };
            const solarSystem = getSolarSystemObjects(date) || [];

            // Helper to transform Point [ra, dec] -> [az, alt]
            const toHoriz = (coords: [number, number]): [number, number] => {
                if (!obsLoc) return [0, 90];
                const h = celestialToHorizon(date, lat, obsLoc.lng, coords[0], coords[1]);
                if (Number.isFinite(h.azimuth) && Number.isFinite(h.altitude)) {
                    // Wrap Azimuth to -180...180 for D3 stability
                    let az = h.azimuth % 360;
                    if (az > 180) az -= 360;
                    if (az < -180) az += 360;
                    return [az, h.altitude];
                }
                return [0, 90];
            };

            // Transform Stars
            const starsHoriz = stars.map(s => {
                const h = toHoriz(s.geometry.coordinates as [number, number]);
                return { ...s, geometry: { type: 'Point' as const, coordinates: h } };
            });

            const transformGeometry = (geom: any) => {
                if (!geom || !geom.coordinates) return geom;
                if (geom.type === 'Point') {
                    return { ...geom, coordinates: toHoriz(geom.coordinates) };
                }
                if (geom.type === 'LineString' || geom.type === 'MultiPoint') {
                    return { ...geom, coordinates: geom.coordinates.map(toHoriz) };
                }
                if (geom.type === 'Polygon' || geom.type === 'MultiLineString') {
                    return { ...geom, coordinates: geom.coordinates.map((arr: any) => arr.map(toHoriz)) };
                }
                if (geom.type === 'MultiPolygon') {
                    return { ...geom, coordinates: geom.coordinates.map((poly: any) => poly.map((ring: any) => ring.map(toHoriz))) };
                }
                return geom;
            };

            // Transform Constellations
            const constellationsHoriz = constellations.map(c => ({
                ...c,
                geometry: transformGeometry(c.geometry)
            }));

            // Solar System
            const solarSystemHoriz = solarSystem.map(obj => {
                const h = toHoriz(obj.geometry.coordinates as [number, number]);
                return { ...obj, geometry: { type: 'Point', coordinates: h } };
            });

            // Milky Way
            let mwHoriz = { type: 'FeatureCollection', features: [] };
            try {
                if (milkyWay?.features) {
                    mwHoriz = {
                        ...milkyWay,
                        features: milkyWay.features.map((f: any) => ({
                            ...f,
                            geometry: transformGeometry(f.geometry)
                        }))
                    };
                } else if (milkyWay?.geometry) {
                    mwHoriz = {
                        ...milkyWay,
                        geometry: transformGeometry(milkyWay.geometry)
                    };
                }
            } catch (mwError) {
                console.warn("Milky Way Horizontal Transform Failed:", mwError);
            }

            // Graticule
            const graticuleEq = d3.geoGraticule10();
            const graticuleHoriz = d3.geoGraticule().step([10, 10])();

            // Earth/Horizon
            // Equatorial Mode: Horizon is a circle moving with time (LST).
            const horizCircleEq = d3.geoCircle().center(observerLocation ? [lst, lat] : [0, 90]).radius(90)();
            const nadirEq = [(lst + 180) % 360, -lat];
            const earthEq = d3.geoCircle().center(nadirEq as [number, number]).radius(90)();

            // Horizontal Mode: Horizon is FIXED at Altitude 0.
            const earthHoriz = d3.geoCircle().center([0, -90]).radius(90)();
            const horizonLineHoriz = d3.geoCircle().center([0, 90]).radius(90)();

            return {
                equatorial: { stars, constellations, solarSystem, milkyWay, graticule: graticuleEq, earth: earthEq, horizon: horizCircleEq },
                horizontal: { stars: starsHoriz, constellations: constellationsHoriz, solarSystem: solarSystemHoriz, milkyWay: mwHoriz, graticule: graticuleHoriz, earth: earthHoriz, horizon: horizonLineHoriz }
            };
        } catch (e) {
            console.error("Fatal Error in useMemo celestialData", e);
            const emptyObj = {
                stars: [], constellations: [], solarSystem: [],
                milkyWay: { type: 'Feature', geometry: { type: 'Polygon', coordinates: [] } },
                graticule: null, earth: null, horizon: null
            };
            return {
                equatorial: emptyObj as any,
                horizontal: emptyObj as any
            };
        }
    }, [observerLocation]);

    // Load Art Image when selected constellation changes
    useEffect(() => {
        if (selectedObject?.type === 'constellation') {
            const url = getConstellationArt(selectedObject.data.name);
            if (url && url !== artRef.current) {
                artRef.current = url;
                const img = new Image();
                img.src = url;
                img.onload = () => setArtImage(img);
            } else if (!url) {
                artRef.current = null;
                setArtImage(null);
            }
        } else {
            artRef.current = null;
            setArtImage(null);
        }
    }, [selectedObject]);

    useEffect(() => {
        if (!containerRef.current || !canvasRef.current) return;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        const canvas = canvasRef.current;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const ctx = canvas.getContext('2d');
        if (!ctx || width <= 0 || height <= 0) return;
        ctx.scale(dpr, dpr);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '=' || e.key === '+') handleZoom(200);
            if (e.key === '-' || e.key === '_') handleZoom(-200);
        };
        window.addEventListener('keydown', handleKeyDown);

        const projection = projectionRef.current;
        projection.translate([width / 2, height / 2]);
        projection.rotate(rotationRef.current as [number, number, number]);

        const path = d3.geoPath().projection(projection).context(ctx);

        const memoryFeatures = memories.map(m => {
            if (!m.star_coordinates) return null;
            const sc = m.star_coordinates as any;
            if (typeof sc.ra !== 'number' || typeof sc.dec !== 'number') return null;
            const lng = sc.ra > 180 ? sc.ra - 360 : sc.ra;
            return {
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [lng, sc.dec] },
                properties: { type: 'memory', original: m }
            };
        }).filter(Boolean);

        let animationFrameId: number;

        const render = (time: number) => {
            animationFrameId = requestAnimationFrame(render);
            try {
                if (!ctx) return;

                const isPlanar = controlMode === 'pan';
                const data = isPlanar ? celestialData.horizontal : celestialData.equatorial;

                // --- ACCURATE DAY/NIGHT LOGIC ---
                let sunAlt = -90;
                if (observerLocation) {
                    const sunPos = getSunPosition(observerLocation.date);
                    const sunHoriz = celestialToHorizon(
                        observerLocation.date,
                        observerLocation.lat,
                        observerLocation.lng,
                        sunPos.ra,
                        sunPos.dec
                    );
                    sunAlt = sunHoriz.altitude;
                }

                // Star Opacity logic based on Sun Altitude
                // -18 is astronomical dark, -2 is near sunset
                // We let stars start appearing slightly after the sun is below -2 degrees
                const starOpacityBase = sunAlt > -2 ? 0 : sunAlt < -15 ? 1 : (sunAlt + 15) / 13;

                // Safety: Recovery from NaN rotation to prevent blank screen
                if (rotationRef.current.some(v => !Number.isFinite(v))) {
                    rotationRef.current = [0, 0, 0];
                    targetRotationRef.current = null;
                    projection.rotate([0, 0, 0]);
                }

                if (!data || !data.stars) {
                    console.warn("Render skipped: No celestial data.");
                    return;
                }

                if (targetRotationRef.current) {
                    const current = rotationRef.current;
                    const target = targetRotationRef.current;
                    const alpha = 0.08;
                    const next: [number, number, number] = [
                        current[0] + (target[0] - current[0]) * alpha,
                        current[1] + (target[1] - current[1]) * alpha,
                        current[2]
                    ];
                    if (Math.abs(next[0] - target[0]) < 0.1 && Math.abs(next[1] - target[1]) < 0.1) {
                        rotationRef.current = target;
                        targetRotationRef.current = null;
                    } else {
                        rotationRef.current = next;
                    }
                    projection.rotate(rotationRef.current);
                } else {
                    // Determine rotation:
                    if (isPlanar && observerLocation) {
                        // Planar Mode: Data is [Az, Alt].
                        // State (rotationRef) is [-RA, -Dec, Roll].
                        // We must convert Center(RA, Dec) -> Center(Az, Alt) for projection.
                        const [r0, r1] = rotationRef.current;
                        const centerRA = -r0;
                        const centerDec = -r1;

                        const h = celestialToHorizon(
                            observerLocation.date,
                            observerLocation.lat,
                            observerLocation.lng,
                            centerRA,
                            centerDec
                        );

                        // Rotate projection to center on [Az, Alt]
                        // Ensure valid coordinates before rotating
                        if (h && Number.isFinite(h.azimuth) && Number.isFinite(h.altitude)) {
                            projection.rotate([-h.azimuth, -h.altitude, 0]);
                        } else {
                            // Fallback if math fails (prevents crash)
                            projection.rotate(rotationRef.current);
                        }

                    } else {
                        // Polar Mode: Data is [RA, Dec].
                        // State is [-RA, -Dec]. Matches perfectly.
                        projection.rotate(rotationRef.current);
                    }
                }

                ctx.clearRect(0, 0, width, height);

                // --- DYNAMIC SKY GRADIENT ---
                const skyGradient = ctx.createLinearGradient(0, height, 0, 0);
                if (sunAlt > 0) {
                    // Day
                    skyGradient.addColorStop(0, '#bae6fd'); // light-blue-200
                    skyGradient.addColorStop(1, '#0ea5e9'); // sky-500
                } else if (sunAlt > -6) {
                    // Civil Twilight
                    skyGradient.addColorStop(0, '#fdba74'); // orange-300
                    skyGradient.addColorStop(0.3, '#3b82f6'); // blue-500
                    skyGradient.addColorStop(1, '#1e3a8a'); // blue-900
                } else if (sunAlt > -12) {
                    // Nautical Twilight
                    skyGradient.addColorStop(0, '#4338ca'); // indigo-700
                    skyGradient.addColorStop(1, '#020617'); // slate-950
                } else {
                    // Night / Astronomical Twilight
                    const nightGradient = ctx.createRadialGradient(width / 2, height, height * 0.2, width / 2, height / 2, width);
                    nightGradient.addColorStop(0, '#0f172a');
                    nightGradient.addColorStop(0.5, '#020617');
                    nightGradient.addColorStop(1, '#000000');
                    ctx.fillStyle = nightGradient;
                }

                if (sunAlt > -12) {
                    ctx.fillStyle = skyGradient;
                }
                ctx.fillRect(0, 0, width, height);

                ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
                ctx.beginPath();
                // @ts-ignore
                path(data.milkyWay);
                ctx.fill();

                // Dynamic Grid Step based on Zoom
                const currentScale = projection.scale();
                let gridStep = 30;
                if (currentScale > 2000) gridStep = 5;
                else if (currentScale > 1000) gridStep = 10;
                else if (currentScale > 600) gridStep = 15;

                ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                // @ts-ignore
                if (isPlanar) {
                    path(data.graticule);
                } else {
                    path(d3.geoGraticule().step([gridStep, gridStep])());
                }
                ctx.stroke();

                // Constellations
                data.constellations.forEach((con: any) => {
                    const isSelected = selectedObject?.type === 'constellation' &&
                        selectedObject.data.name === con.properties.name;
                    ctx.strokeStyle = isSelected ? 'rgba(100, 200, 255, 0.6)' : 'rgba(255, 255, 255, 0.08)';
                    ctx.lineWidth = isSelected ? 2 : 1;
                    ctx.beginPath();
                    // @ts-ignore
                    path(con);
                    ctx.stroke();
                });

                // Graticule Labels
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.font = '9px monospace';
                ctx.textAlign = 'center';

                if (isPlanar) {
                    // Azimuth (Horizon) Labels
                    // We want labels at standard compass points: 0(N), 45(NE), 90(E)...
                    // Coordinate system is standard math? 0 is East? 
                    // celestialToHorizon: 0 is North, 90 is East.
                    // So Azimuth 0, 0 is North on Horizon.
                    // In D3 projection (if centered on 0,0), [0,0] is center.
                    // Let's iterate Azimuths.
                    for (let az = 0; az < 360; az += 45) {
                        const p = projection([az, 0]);
                        if (p) {
                            const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
                            const label = dirs[az / 45];
                            ctx.fillText(label, p[0], p[1] + 15);
                        }
                    }
                    // Altitude Labels
                    ctx.textAlign = 'right';
                    for (let alt = 10; alt <= 90; alt += 10) {
                        // Draw labels along the Prime Vertical (Az=0 or 180?) or just center screen?
                        // Drawing at Az=0 (North Line)
                        const p = projection([0, alt]);
                        if (p) {
                            ctx.fillText(`${alt}°`, p[0] - 5, p[1] + 3);
                        }
                    }

                } else {
                    // RA
                    for (let ra = 0; ra < 360; ra += (gridStep * 1.5)) {
                        const lng = ra > 180 ? ra - 360 : ra;
                        const p = projection([lng, 0]);
                        if (p) ctx.fillText(`${Math.floor(ra / 15)}h`, p[0], p[1] + 10);
                    }
                    // Dec
                    ctx.textAlign = 'right';
                    for (let dec = -80; dec <= 80; dec += gridStep) {
                        if (dec === 0) continue;
                        const p = projection([0, dec]);
                        if (p) ctx.fillText(`${dec > 0 ? '+' : ''}${dec}°`, p[0] - 5, p[1] + 3);
                    }
                }

                // Stars
                const starVisibility = starOpacityBase;
                if (starVisibility > 0) {
                    data.stars.forEach((star: any) => {
                        const mag = star.properties.magnitude;
                        const isSelected = selectedObject?.type === 'star' && selectedObject.data.name === star.properties.name;
                        const baseRadius = Math.max(0.3, 2.5 - mag * 0.3);
                        const radius = isSelected ? baseRadius * 1.5 : baseRadius;

                        // Fade stars based on magnitude vs sky brightness
                        // Bright stars (mag < 1) stay visible longer
                        const magFactor = Math.max(0, 1 - (mag / 6));
                        const opacity = isSelected ? 1 : Math.min(1, (1.2 - mag * 0.15)) * starVisibility * (mag < 1 ? 1 : magFactor);

                        if (opacity > 0.05) {
                            ctx.fillStyle = isSelected ? '#60a5fa' : `rgba(255, 255, 255, ${opacity})`;
                            ctx.beginPath();
                            // @ts-ignore
                            const projected = projection(star.geometry.coordinates);
                            if (projected) {
                                ctx.arc(projected[0], projected[1], radius, 0, 2 * Math.PI);
                                ctx.fill();
                                if (mag < 1.0) {
                                    ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.1})`;
                                    ctx.beginPath();
                                    ctx.arc(projected[0], projected[1], radius * 4, 0, 2 * Math.PI);
                                    ctx.fill();
                                }
                                if ((mag < 1.0 || isSelected) && star.properties.name) {
                                    ctx.fillStyle = isSelected ? '#fff' : `rgba(255, 255, 255, ${opacity * 0.6})`;
                                    ctx.font = isSelected ? '12px Inter' : '10px Inter';
                                    ctx.textAlign = 'left';
                                    ctx.fillText(star.properties.name, projected[0] + 6, projected[1] + 3);
                                }
                            }
                        }
                    });
                }

                // Solar System Objects
                data.solarSystem.forEach((obj: any) => {
                    const projected = projection(obj.geometry.coordinates);
                    if (projected) {
                        const isSun = obj.properties.name === 'Sun';
                        const isMoon = obj.properties.name === 'Moon';

                        ctx.fillStyle = obj.properties.color;
                        ctx.beginPath();
                        const radius = isSun ? 12 : isMoon ? 10 : 4;
                        ctx.arc(projected[0], projected[1], radius, 0, 2 * Math.PI);
                        ctx.fill();

                        if (isSun || isMoon) {
                            ctx.shadowBlur = 20;
                            ctx.shadowColor = obj.properties.color;
                            ctx.beginPath();
                            ctx.arc(projected[0], projected[1], radius, 0, 2 * Math.PI);
                            ctx.fill();
                            ctx.shadowBlur = 0;
                        }

                        ctx.fillStyle = '#fff';
                        ctx.font = 'bold 10px Inter';
                        ctx.textAlign = 'center';
                        ctx.fillText(obj.properties.name, projected[0], projected[1] + radius + 14);
                    }
                });

                // Memories (Need dynamic transform if Planar)
                const nowTime = Date.now() / 1000;
                memories.forEach((mem: any) => {
                    if (!mem.star_coordinates) return;
                    let coords = [mem.star_coordinates.ra > 180 ? mem.star_coordinates.ra - 360 : mem.star_coordinates.ra, mem.star_coordinates.dec];

                    if (isPlanar && observerLocation) {
                        const h = celestialToHorizon(observerLocation.date, observerLocation.lat, observerLocation.lng, mem.star_coordinates.ra, mem.star_coordinates.dec);
                        coords = [h.azimuth, h.altitude];
                    }

                    // @ts-ignore
                    const proj = projection(coords);
                    if (proj) {
                        const pulse = (Math.sin(nowTime * 4) + 1) / 2;
                        ctx.beginPath();
                        ctx.fillStyle = `rgba(234, 179, 8, ${0.2 + pulse * 0.2})`;
                        ctx.arc(proj[0], proj[1], 8 + pulse * 4, 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.beginPath();
                        ctx.fillStyle = '#facc15';
                        ctx.arc(proj[0], proj[1], 3, 0, 2 * Math.PI);
                        ctx.fill();
                    }
                });

                // Mythology Art
                if (selectedObject?.type === 'constellation' && artImage) {
                    const conFeature = data.constellations.find(
                        (c: any) => c.properties.name === selectedObject.data.name
                    );
                    if (conFeature) {
                        const centroid = d3.geoCentroid(conFeature);
                        const projected = projection(centroid);
                        if (projected) {
                            ctx.save();
                            ctx.globalAlpha = 0.25;
                            ctx.translate(projected[0], projected[1]);
                            const imgSize = projection.scale() * 0.9;
                            ctx.drawImage(artImage, -imgSize / 2, -imgSize / 2, imgSize, imgSize);
                            ctx.restore();
                        }
                    }
                }

                // --- OPAQUE HORIZON / EARTH MASK ---
                if (observerLocation) {
                    // During day, the earth mask should be dark but slightly influenced by sky
                    ctx.fillStyle = sunAlt > 0 ? '#0a101f' : '#040712';
                    ctx.beginPath();
                    // @ts-ignore
                    path(data.earth);
                    ctx.fill();

                    ctx.strokeStyle = '#38bdf8';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    // @ts-ignore
                    path(data.horizon);
                    ctx.stroke();

                    // Cardinals
                    if (!isPlanar) {
                        // Legacy Equatorial Cardinals
                        const cardinals = [
                            { label: 'N', az: 0 }, { label: 'E', az: 90 },
                            { label: 'S', az: 180 }, { label: 'W', az: 270 }
                        ];
                        ctx.fillStyle = '#38bdf8';
                        ctx.font = 'bold 12px Inter';
                        ctx.textAlign = 'center';
                        cardinals.forEach(c => {
                            const pos = horizonToCelestial(observerLocation.date, observerLocation.lat, observerLocation.lng, c.az, 0);
                            const lng = pos.ra > 180 ? pos.ra - 360 : pos.ra;
                            const p = projection([lng, pos.dec]);
                            if (p) ctx.fillText(c.label, p[0], p[1] + 15);
                        });
                    }
                }
            } catch (e) {
                console.error("Render Crash", e);
            }
        };

        render(0);

        // Interactions
        // @ts-ignore
        const drag = d3.drag()
            .on('drag', (event: any) => {
                targetRotationRef.current = null;
                const currentScale = projection.scale();
                const k = 0.25 * (600 / currentScale);

                if (controlMode === 'pan' && observerLocation) {
                    // --- PLANAR (ALT-AZ) CONTROL ---
                    const [r0, r1, r2] = rotationRef.current;
                    const centerRA = -r0;
                    const centerDec = -r1;

                    const currentHoriz = celestialToHorizon(
                        observerLocation.date,
                        observerLocation.lat,
                        observerLocation.lng,
                        centerRA,
                        centerDec
                    );

                    // Drag Right (dx > 0) -> Move View Left -> Decrease Azimuth
                    let newAz = currentHoriz.azimuth - event.dx * k;
                    let newAlt = currentHoriz.altitude + event.dy * k;

                    newAlt = Math.max(-89, Math.min(89, newAlt));

                    const newCel = horizonToCelestial(
                        observerLocation.date,
                        observerLocation.lat,
                        observerLocation.lng,
                        newAz,
                        newAlt
                    );

                    const newRotation: [number, number, number] = [-newCel.ra, -newCel.dec, r2];
                    rotationRef.current = newRotation;
                    projection.rotate(newRotation);

                } else {
                    // --- POLAR TELESCOPE CONTROL (Default) ---
                    const [r0, r1, r2] = rotationRef.current as [number, number, number];
                    const newRotation: [number, number, number] = [
                        r0 + event.dx * k,
                        Math.max(-90, Math.min(90, r1 - event.dy * k)),
                        r2
                    ];
                    rotationRef.current = newRotation;
                    projection.rotate(newRotation);
                }
            });

        // @ts-ignore
        d3.select(canvas).call(drag);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [celestialData, controlMode, memories, observerLocation, size.width, size.height, handleZoom]);

    const findObjectUnderCursor = (mx: number, my: number) => {
        // Projection instance
        const projection = projectionRef.current;

        // Select Data Source
        const isPlanar = controlMode === 'pan';
        // Note: celestialData now has { equatorial, horizontal }
        const data = isPlanar ? celestialData.horizontal : celestialData.equatorial;

        // 1. Memories
        const memoryFeatures = memories.map(m => {
            if (!m.star_coordinates) return null;
            const sc = m.star_coordinates as any;
            let coords: [number, number] = [sc.ra > 180 ? sc.ra - 360 : sc.ra, sc.dec];

            // Transform memory coords if Planar
            if (isPlanar && observerLocation) {
                const h = celestialToHorizon(observerLocation.date, observerLocation.lat, observerLocation.lng, sc.ra, sc.dec);
                coords = [h.azimuth, h.altitude];
            }

            return { properties: { original: m }, geometry: { coordinates: coords } };
        }).filter(Boolean);

        for (const mem of memoryFeatures) {
            // @ts-ignore
            const p = projection(mem!.geometry.coordinates);
            if (p && Math.hypot(p[0] - mx, p[1] - my) < 20) {
                // @ts-ignore
                return { type: 'memory', data: mem!.properties.original, x: mx, y: my };
            }
        }

        // 1.5 Solar System Objects
        for (const obj of data.solarSystem) {
            const coords = projection(obj.geometry.coordinates);
            if (coords) {
                const dx = mx - coords[0];
                const dy = my - coords[1];
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 15) {
                    return { type: 'planet', data: obj.properties, x: coords[0], y: coords[1] };
                }
            }
        }

        // 2. Stars
        for (const star of data.stars) {
            // Optimization: Skip checking faint stars if zooming out? 
            if (star.properties.magnitude > 5.5 && !star.properties.name) continue;

            // @ts-ignore
            const p = projection(star.geometry.coordinates);
            // Increased hit radius for easier selection
            const radius = star.properties.name ? 20 : 10;

            if (p && Math.hypot(p[0] - mx, p[1] - my) < radius) {
                return { type: 'star', data: star.properties, x: mx, y: my };
            }
        }

        // 3. Constellations (Lines)
        for (const con of data.constellations) {
            // Check each line segment
            const coordsLines = con.geometry.coordinates;
            // coordsLines is Array<Array<[number, number]>>
            for (const line of coordsLines) {
                for (let i = 0; i < line.length - 1; i++) {
                    const p1 = projection(line[i] as [number, number]);
                    const p2 = projection(line[i + 1] as [number, number]);
                    if (!p1 || !p2) continue;

                    // Distance from point (mx, my) to segment (p1, p2)
                    const d = distToSegment([mx, my], p1 as [number, number], p2 as [number, number]);
                    if (d < 5) {
                        return { type: 'constellation', data: con.properties, x: mx, y: my };
                    }
                }
            }
        }

        return null;
    };

    // Helper for line hit testing
    const distToSegment = (p: [number, number], v: [number, number], w: [number, number]) => {
        const l2 = Math.pow(v[0] - w[0], 2) + Math.pow(v[1] - w[1], 2);
        if (l2 === 0) return Math.hypot(p[0] - v[0], p[1] - v[1]);
        let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
        t = Math.max(0, Math.min(1, t));
        return Math.hypot(p[0] - (v[0] + t * (w[0] - v[0])), p[1] - (v[1] + t * (w[1] - v[1])));
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const mx = e.nativeEvent.offsetX;
        const my = e.nativeEvent.offsetY;

        const obj = findObjectUnderCursor(mx, my);

        if (obj) {
            setHoveredObject({ x: mx, y: my, ...obj });
            if (canvasRef.current) canvasRef.current.style.cursor = 'pointer';
        } else {
            setHoveredObject(null);
            if (canvasRef.current) canvasRef.current.style.cursor = 'move';
        }
    };

    const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const mx = e.nativeEvent.offsetX;
        const my = e.nativeEvent.offsetY;
        const obj = findObjectUnderCursor(mx, my);

        if (obj) {
            // Center Logic
            let coords: [number, number] | undefined;
            const isPlanar = controlMode === 'pan';

            // Always get equatorial (RA/Dec) coords for the InfoCard to process consistently
            const eqData = celestialData.equatorial;

            if (obj.type === 'star') {
                const s = eqData.stars.find(s => s.properties.name === (obj.data as any).name);
                if (s) coords = s.geometry.coordinates as [number, number];
            } else if (obj.type === 'planet') {
                const p = eqData.solarSystem.find(p => p.properties.name === (obj.data as any).name);
                if (p) coords = p.geometry.coordinates as [number, number];
            } else if (obj.type === 'memory') {
                const m = obj.data as Memory;
                const sc = m.star_coordinates as any;
                coords = [sc.ra > 180 ? sc.ra - 360 : sc.ra, sc.dec] as [number, number];
            } else if (obj.type === 'constellation') {
                // Use centroid or first vertex for constellations
                const c = eqData.constellations.find(c => c.properties.name === (obj.data as any).name);
                if (c && c.geometry.coordinates.length > 0 && c.geometry.coordinates[0].length > 0) {
                    coords = c.geometry.coordinates[0][0] as [number, number];
                }
            }

            if (coords) {
                // Rotation expects negative values for RA/Dec offsets
                // But for planar mode, we handle rotation differently or re-center?
                // Actually, the current centering logic uses -coords.

                // If we are in planar mode, we need to center on Alt/Az, not RA/Dec
                if (isPlanar && observerLocation) {
                    const h = celestialToHorizon(observerLocation.date, observerLocation.lat, observerLocation.lng, coords[0] < 0 ? coords[0] + 360 : coords[0], coords[1]);
                    targetRotationRef.current = [-h.azimuth, -h.altitude, 0];
                } else {
                    targetRotationRef.current = [-coords[0], -coords[1], 0];
                }
            }

            if (obj.type === 'memory') {
                if (onMemoryClick) onMemoryClick(obj.data as Memory);
            } else {
                // For stars and planets, coords are [RA, Dec]
                // For constellations, coords are [RA, Dec] of the centroid (if available)
                setSelectedObject({
                    type: obj.type as any,
                    data: obj.data,
                    coords: coords as [number, number]
                });
            }
        } else {
            setSelectedObject(null);
        }
    };

    useImperativeHandle(ref, () => ({
        zoomIn: () => handleZoom(200),
        zoomOut: () => handleZoom(-200),
        resetView
    }));

    return (
        <div ref={containerRef} className={`relative bg-black w-full h-full overflow-hidden ${className}`}>
            <canvas
                ref={canvasRef}
                width={size.width || 1000}
                height={size.height || 800}
                className="block w-full h-full"
                onMouseMove={handleMouseMove}
                onClick={handleClick}
            />

            {hoveredObject && (
                <div
                    className="absolute z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full pb-2"
                    style={{ left: hoveredObject.x, top: hoveredObject.y }}
                >
                    <div className="bg-slate-900/90 border border-slate-700 text-slate-100 px-3 py-2 rounded shadow-xl backdrop-blur-md">
                        <div className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                            {hoveredObject.type === 'memory' ? 'Memory Signal' : 'Star'}
                        </div>
                        <div className="font-semibold whitespace-nowrap">
                            {hoveredObject.type === 'memory' ? hoveredObject.data.recipient_name : hoveredObject.data.name}
                        </div>
                    </div>
                </div>
            )}

            {/* Selected Info Card */}
            {selectedObject && (
                <CosmicInfoCard
                    data={selectedObject.data}
                    type={selectedObject.type}
                    coords={selectedObject.coords}
                    controlMode={controlMode}
                    observerLocation={observerLocation}
                    onClose={() => setSelectedObject(null)}
                />
            )}

            {/* Removed internal controls stack to allow parent placement */}

            {/* Top-Right Legend */}
            <div className="absolute top-8 right-8 pointer-events-none text-right">
                <div className="flex flex-col items-end">
                    <h2 className="text-3xl font-serif text-white tracking-[0.2em] leading-none mb-1 uppercase opacity-90">Observatory</h2>
                    <div className="flex items-center gap-4 text-xs font-mono text-blue-200/60 uppercase tracking-widest bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 shadow-xl">
                        <span className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
                            {celestialData.equatorial.stars.length} Stars
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-primary/60 animate-pulse" />
                            88 Constellations
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default InteractiveMap;

