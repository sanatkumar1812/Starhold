import React, { useEffect, useRef, useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import * as d3 from 'd3';
import { getBrightStars, getConstellationLines, getMilkyWayFeature, getSolarSystemObjects, StarFeature, ConstellationLineFeature } from '@/lib/celestial-data';
import { Memory } from '@/hooks/useMemories';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { CosmicInfoCard } from './CosmicInfoCard';
import { getConstellationArt } from '@/lib/constellation-art';
import { getLST, celestialToHorizon, getSunPosition, horizonToCelestial, getGMST } from '@/lib/astro-math';

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

    const [hoveredObject, setHoveredObject] = useState<any | null>(null);
    const [selectedObject, setSelectedObject] = useState<{ type: 'star' | 'constellation', data: any } | null>(null);
    const [artImage, setArtImage] = useState<HTMLImageElement | null>(null);
    const artRef = useRef<string | null>(null);

    // DEBUG LOGS
    useEffect(() => {
        console.log('InteractiveMap: Memories received:', memories.length);
        console.log('InteractiveMap: Memories data:', memories);
    }, [memories]);

    useEffect(() => {
        console.log('InteractiveMap: Selected Object:', selectedObject);
    }, [selectedObject]);

    // Sky Dome usually defaults to looking South or up.
    // In Sky maps, Dec +90 is North Pole.
    const projectionRef = useRef(d3.geoStereographic().scale(600).rotate([0, 0, 0])); // Removed clipAngle to allow seeing "Ground"
    const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);
    const rotationRef = useRef<[number, number, number]>([0, 0, 0]);
    const targetRotationRef = useRef<[number, number, number] | null>([0, 0, 0]); // Default to centered horizon

    // ... (keep useEffect for observerLocation)

    // Memoized Data to prevent expensive re-parsing
    const celestialData = useMemo(() => {
        const date = observerLocation?.date || new Date();
        const lst = observerLocation ? getLST(observerLocation.date, observerLocation.lng) : 0;
        const lat = observerLocation ? observerLocation.lat : 90;

        // Nadir is opposite to Zenith (LST, Lat) -> (LST+180, -Lat)
        const nadir = [(lst + 180) % 360, -lat];

        return {
            stars: getBrightStars(),
            constellations: getConstellationLines(),
            milkyWay: getMilkyWayFeature(),
            graticule: d3.geoGraticule10(),
            solarSystem: getSolarSystemObjects(date),
            horizon: d3.geoCircle().center(observerLocation ? [lst, lat] : [0, 90]).radius(90)(),
            earth: d3.geoCircle().center(nadir as [number, number]).radius(90)()
        };
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
        if (!ctx) return;
        ctx.scale(dpr, dpr);

        const projection = projectionRef.current;
        projection.translate([width / 2, height / 2]);
        projection.rotate(rotationRef.current as [number, number, number]);

        const path = d3.geoPath().projection(projection).context(ctx);

        const memoryFeatures = memories.map(m => {
            if (!m.star_coordinates) return null;
            const coords = m.star_coordinates as any;
            if (typeof coords.ra !== 'number' || typeof coords.dec !== 'number') return null;
            const lng = coords.ra > 180 ? coords.ra - 360 : coords.ra;
            return {
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [lng, coords.dec] },
                properties: { type: 'memory', original: m }
            };
        }).filter(Boolean);

        let animationFrameId: number;

        const render = (time: number) => {
            animationFrameId = requestAnimationFrame(render);

            if (targetRotationRef.current) {
                const current = rotationRef.current;
                const target = targetRotationRef.current;
                const alpha = 0.08;
                const next = [
                    current[0] + (target[0] - current[0]) * alpha,
                    current[1] + (target[1] - current[1]) * alpha,
                    current[2]
                ];
                if (Math.abs(next[0] - target[0]) < 0.1 && Math.abs(next[1] - target[1]) < 0.1) {
                    rotationRef.current = target;
                    targetRotationRef.current = null;
                } else {
                    rotationRef.current = next as [number, number, number];
                }
                projection.rotate(rotationRef.current as any);
            }

            ctx.clearRect(0, 0, width, height);

            // Deep Space Background (Permanent Night Mode)
            const gradient = ctx.createRadialGradient(width / 2, height, height * 0.2, width / 2, height / 2, width);
            gradient.addColorStop(0, '#0f172a');
            gradient.addColorStop(0.5, '#020617');
            gradient.addColorStop(1, '#000000');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.beginPath();
            // @ts-ignore
            path(celestialData.milkyWay);
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
            path(d3.geoGraticule().step([gridStep, gridStep])());
            ctx.stroke();

            // Constellations
            celestialData.constellations.forEach((con: any) => {
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

            // Stars
            celestialData.stars.forEach((star: any) => {
                const mag = star.properties.magnitude;
                const isSelected = selectedObject?.type === 'star' && selectedObject.data.name === star.properties.name;
                const baseRadius = Math.max(0.3, 2.5 - mag * 0.3);
                const radius = isSelected ? baseRadius * 1.5 : baseRadius;
                ctx.fillStyle = isSelected ? '#60a5fa' : `rgba(255, 255, 255, ${Math.min(1, 1.2 - mag * 0.15)})`;
                ctx.beginPath();
                // @ts-ignore
                const projected = projection(star.geometry.coordinates);
                if (projected) {
                    ctx.arc(projected[0], projected[1], radius, 0, 2 * Math.PI);
                    ctx.fill();
                    if (mag < 1.0) {
                        ctx.fillStyle = `rgba(255, 255, 255, 0.1)`;
                        ctx.beginPath();
                        ctx.arc(projected[0], projected[1], radius * 4, 0, 2 * Math.PI);
                        ctx.fill();
                    }
                    if ((mag < 1.0 || isSelected) && star.properties.name) {
                        ctx.fillStyle = isSelected ? '#fff' : 'rgba(255, 255, 255, 0.4)';
                        ctx.font = isSelected ? '12px Inter' : '10px Inter';
                        ctx.textAlign = 'left';
                        ctx.fillText(star.properties.name, projected[0] + 6, projected[1] + 3);
                    }
                }
            });

            // Solar System Objects
            celestialData.solarSystem.forEach((obj: any) => {
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

            const nowTime = Date.now() / 1000;
            memoryFeatures.forEach((mem: any) => {
                // @ts-ignore
                const proj = projection(mem.geometry.coordinates);
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
                const conFeature = celestialData.constellations.find(
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

            // --- OPAQUE HORIZON / EARTH MASK (COVERS SKY) ---
            if (observerLocation) {
                ctx.fillStyle = '#0f172a'; // Match background or slightly lighter ground
                ctx.beginPath();
                // @ts-ignore
                path(celestialData.earth);
                ctx.fill();

                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                // @ts-ignore
                path(celestialData.horizon);
                ctx.stroke();

                const cardinals = [
                    { label: 'N', az: 0 },
                    { label: 'E', az: 90 },
                    { label: 'S', az: 180 },
                    { label: 'W', az: 270 }
                ];

                ctx.fillStyle = '#38bdf8';
                ctx.font = 'bold 12px Inter';
                ctx.textAlign = 'center';

                cardinals.forEach(c => {
                    const pos = horizonToCelestial(observerLocation.date, observerLocation.lat, observerLocation.lng, c.az, 0);
                    const lng = pos.ra > 180 ? pos.ra - 360 : pos.ra;
                    const p = projection([lng, pos.dec]);
                    if (p) {
                        // Simple visibility check handled by Earth Mask covering if behind?
                        // Actually if we look DOWN, the Cardinal is "inside" the Earth circle on screen.
                        // But we want to see it ON the line.
                        ctx.fillText(c.label, p[0], p[1] + 15);
                    }
                });
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
        };
    }, [memories, celestialData, selectedObject, controlMode]); // Re-run on memory/selection/control change

    const findObjectUnderCursor = (mx: number, my: number) => {
        // Projection instance
        const projection = projectionRef.current;

        // 1. Memories
        const memoryFeatures = memories.map(m => {
            if (!m.star_coordinates) return null;
            const coords = m.star_coordinates as any;
            if (typeof coords.ra !== 'number' || typeof coords.dec !== 'number') return null;
            // Re-calc basic coords for hit test
            const lng = coords.ra > 180 ? coords.ra - 360 : coords.ra;
            return { properties: { original: m }, geometry: { coordinates: [lng, coords.dec] } };
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
        for (const obj of celestialData.solarSystem) {
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
        // console.log("Checking stars:", celestialData.stars.length);
        for (const star of celestialData.stars) {
            // Optimization: Skip checking faint stars if zooming out? 
            if (star.properties.magnitude > 5.5 && !star.properties.name) continue;

            // @ts-ignore
            const p = projection(star.geometry.coordinates);
            // Increased hit radius for easier selection
            const radius = star.properties.name ? 20 : 10;

            if (p && Math.hypot(p[0] - mx, p[1] - my) < radius) {
                // console.log("Hit star:", star.properties.name);
                return { type: 'star', data: star.properties, x: mx, y: my };
            }
        }

        // 3. Constellations (Lines)
        for (const con of celestialData.constellations) {
            // Check each line segment
            const coords = con.geometry.coordinates;
            for (const line of coords) {
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
            if (obj.type === 'star') {
                const s = celestialData.stars.find(s => s.properties.name === (obj.data as any).name);
                if (s) coords = s.geometry.coordinates;
            } else if (obj.type === 'memory') {
                // reconstruct coords
                const m = obj.data as Memory;
                const c = m.star_coordinates as any;
                if (c) coords = [c.ra > 180 ? c.ra - 360 : c.ra, c.dec];
            }

            if (coords) {
                targetRotationRef.current = [-coords[0], -coords[1], 0];
            }

            if (obj.type === 'memory') {
                if (onMemoryClick) onMemoryClick(obj.data as Memory);
            } else {
                setSelectedObject({ type: obj.type as any, data: obj.data });
            }
        } else {
            setSelectedObject(null);
        }
    };

    const handleZoom = (delta: number) => {
        const current = projectionRef.current.scale();
        projectionRef.current.scale(Math.max(200, Math.min(4000, current + delta)));
    };

    const resetView = () => {
        targetRotationRef.current = [0, 0, 0];
        projectionRef.current.scale(600);
        setSelectedObject(null);
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
                className="block w-full h-full"
                onMouseMove={handleMouseMove}
                onClick={handleClick}
            />  {/* UI Overlay: Tooltips */}
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
                            {celestialData.stars.length} Stars
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

