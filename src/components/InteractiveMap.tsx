import React, { useEffect, useRef, useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import * as d3 from 'd3';
import { getBrightStars, getConstellationLines, getMilkyWayFeature, getSolarSystemObjects, StarFeature, ConstellationLineFeature } from '@/lib/celestial-data';
import { Memory } from '@/hooks/useMemories';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { CosmicInfoCard } from './CosmicInfoCard';
import { getConstellationArt } from '@/lib/constellation-art';
import { getLST, celestialToHorizon, getSunPosition, horizonToCelestial } from '@/lib/astro-math';

interface InteractiveMapProps {
    memories: Memory[];
    onMemoryClick?: (memory: Memory) => void;
    observerLocation?: { lat: number; lng: number; date: Date };
    className?: string;
}

export interface InteractiveMapHandle {
    zoomIn: () => void;
    zoomOut: () => void;
    resetView: () => void;
}

export const InteractiveMap = forwardRef<InteractiveMapHandle, InteractiveMapProps>(({ memories, onMemoryClick, observerLocation, className = '' }, ref) => {
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
    const projectionRef = useRef(d3.geoStereographic().scale(600).clipAngle(120).rotate([0, 0, 0]));

    // View orientation (Horizon relative: 0 = Zenith, 90 = South?)
    // Actually let's use: Azimuth (0-360), Altitude (0-90)
    const [viewAz, setViewAz] = useState(180); // Looking South
    const [viewAlt, setViewAlt] = useState(30); // 30 degrees up

    const rotationRef = useRef<[number, number, number]>([0, 0, 0]);
    const targetRotationRef = useRef<[number, number, number] | null>(null);

    // Update rotation if observerLocation provided
    useEffect(() => {
        if (observerLocation) {
            const { lat, lng, date } = observerLocation;
            const lst = getLST(date, lng);

            // Convert current look-at (Az, Alt) to (RA, Dec)
            const celestial = horizonToCelestial(date, lat, lng, viewAz, viewAlt);
            const ra_lng = celestial.ra > 180 ? celestial.ra - 360 : celestial.ra;

            // To keep horizon level, we need a specific roll (gamma).
            // A simple way is to use d3.geoRotation which handles the math.
            // But for stereographic sky, we can just rotate to zenith and then apply offsets.

            // Projection rotation: [-lst + az, -lat - (90-alt), 0]? 
            // Let's try simpler: directly center on target RA/Dec but keeping Zenith up.
            // This is equivalent to: rotate([-RA, -Dec, roll])

            // For now, let's use the RA/Dec center but we need the roll to keep the horizon flat.
            // A robust way is to rotate to Zenith first, then apply Az/Alt.

            rotationRef.current = [-lst + (viewAz - 180), -lat - (90 - viewAlt), 0];
            projectionRef.current.rotate(rotationRef.current);
        }
    }, [observerLocation, viewAz, viewAlt]);

    // Memoized Data to prevent expensive re-parsing
    const celestialData = useMemo(() => {
        const date = observerLocation?.date || new Date();
        return {
            stars: getBrightStars(),
            constellations: getConstellationLines(),
            milkyWay: getMilkyWayFeature(),
            graticule: d3.geoGraticule10(),
            solarSystem: getSolarSystemObjects(date),
            horizon: d3.geoCircle().center(observerLocation ? [getLST(observerLocation.date, observerLocation.lng), observerLocation.lat] : [0, 90]).radius(90)()
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
                    rotationRef.current = next;
                }
                projection.rotate(rotationRef.current as any);
            }

            ctx.clearRect(0, 0, width, height);

            // --- Day / Night Logic ---
            const sunPos = getSunPosition(observerLocation?.date || new Date());
            const sunHorizon = observerLocation
                ? celestialToHorizon(observerLocation.date, observerLocation.lat, observerLocation.lng, sunPos.ra, sunPos.dec)
                : { altitude: -10 };

            // Determine sky opacity for stars (0 when sun is high)
            const starOpacity = Math.max(0, Math.min(1, (-sunHorizon.altitude + 5) / 10));

            ctx.save();
            if (sunHorizon.altitude > -18) {
                // Daytime/Twilight Gradient
                const gradient = ctx.createLinearGradient(0, 0, 0, height);

                if (sunHorizon.altitude > 0) {
                    // Day Color Scheme
                    const altFactor = Math.min(1, sunHorizon.altitude / 45);
                    const skyTop = `rgb(${Math.floor(10 + 30 * altFactor)}, ${Math.floor(20 + 80 * altFactor)}, ${Math.floor(40 + 180 * altFactor)})`;
                    const skyBottom = `rgb(${Math.floor(40 + 100 * altFactor)}, ${Math.floor(80 + 140 * altFactor)}, ${Math.floor(140 + 115 * altFactor)})`;

                    gradient.addColorStop(0, skyTop);
                    gradient.addColorStop(1, skyBottom);
                } else {
                    // Twilight Color Scheme
                    const twiFactor = (sunHorizon.altitude + 18) / 18; // 0 to 1
                    gradient.addColorStop(0, '#020617');
                    gradient.addColorStop(0.5, `rgb(${Math.floor(20 * twiFactor)}, ${Math.floor(10 * twiFactor)}, ${Math.floor(40 * twiFactor)})`);
                    gradient.addColorStop(1, `rgb(${Math.floor(80 * twiFactor)}, ${Math.floor(40 * twiFactor)}, ${Math.floor(20 * twiFactor)})`);
                }

                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);

                // Sun Glow
                const sPos = projection([sunPos.ra > 180 ? sunPos.ra - 360 : sunPos.ra, sunPos.dec]);
                if (sPos && sunHorizon.altitude > -5) {
                    const glow = ctx.createRadialGradient(sPos[0], sPos[1], 0, sPos[0], sPos[1], 300);
                    const intensity = Math.max(0, (sunHorizon.altitude + 5) / 15);
                    glow.addColorStop(0, `rgba(255, 255, 230, ${0.4 * intensity})`);
                    glow.addColorStop(0.2, `rgba(255, 200, 100, ${0.1 * intensity})`);
                    glow.addColorStop(1, 'rgba(0,0,0,0)');
                    ctx.fillStyle = glow;
                    ctx.fillRect(0, 0, width, height);
                }
            } else {
                // Deep Night
                const gradient = ctx.createRadialGradient(width / 2, height, height * 0.2, width / 2, height / 2, width);
                gradient.addColorStop(0, '#0f172a');
                gradient.addColorStop(0.5, '#020617');
                gradient.addColorStop(1, '#000000');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
            }
            ctx.restore();

            // Draw Horizon Haze
            if (observerLocation) {
                const haze = ctx.createLinearGradient(0, height * 0.7, 0, height);
                haze.addColorStop(0, 'rgba(0,0,0,0)');
                haze.addColorStop(1, 'rgba(0,0,0,0.3)');
                ctx.fillStyle = haze;
                ctx.fillRect(0, 0, width, height);
            }

            // Draw Horizon Line
            if (observerLocation) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.lineWidth = 1;
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                // @ts-ignore
                path(celestialData.horizon);
                ctx.stroke();
                ctx.setLineDash([]);

                // Label Horizon Cardinal Points
                const cardinals = [
                    { label: 'N', az: 0 },
                    { label: 'E', az: 90 },
                    { label: 'S', az: 180 },
                    { label: 'W', az: 270 }
                ];

                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.font = 'bold 12px Inter';
                ctx.textAlign = 'center';

                cardinals.forEach(c => {
                    const pos = horizonToCelestial(observerLocation.date, observerLocation.lat, observerLocation.lng, c.az, 0);
                    const lng = pos.ra > 180 ? pos.ra - 360 : pos.ra;
                    const p = projection([lng, pos.dec]);
                    if (p) {
                        ctx.fillText(c.label, p[0], p[1] + 4);
                    }
                });
            }

            ctx.globalAlpha = starOpacity;

            ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.beginPath();
            // @ts-ignore
            path(celestialData.milkyWay);
            ctx.fill();

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            // @ts-ignore
            path(celestialData.graticule);
            ctx.stroke();


            // --- Solar System Objects ---
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

            // 4. Draw Mythology Art (for selected constellation)
            if (selectedObject?.type === 'constellation' && artImage) {
                const conFeature = celestialData.constellations.find(
                    (c: any) => c.properties.name === selectedObject.data.name
                );
                if (conFeature) {
                    const centroid = d3.geoCentroid(conFeature);
                    const projected = projection(centroid);
                    if (projected) {
                        ctx.save();
                        ctx.globalAlpha = 0.25; // Ghostly opacity
                        ctx.translate(projected[0], projected[1]);
                        const imgSize = projection.scale() * 0.9;
                        ctx.drawImage(artImage, -imgSize / 2, -imgSize / 2, imgSize, imgSize);
                        ctx.restore();
                    } else {
                        // console.log("InteractiveMap: Centroid outside view");
                    }
                }
            }
        };

        render(0);

        // Interactions: Alt-Azimuth Drag
        // @ts-ignore
        const drag = d3.drag()
            .on('drag', (event: any) => {
                targetRotationRef.current = null; // Cancel animations

                const currentScale = projection.scale();
                const k = 0.25 * (600 / currentScale);

                // Update Azimuth and Altitude
                setViewAz(prev => (prev - event.dx * k + 360) % 360);
                setViewAlt(prev => Math.max(5, Math.min(90, prev + event.dy * k)));
            });

        // @ts-ignore
        d3.select(canvas).call(drag);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [memories, celestialData, selectedObject]); // Re-run on memory/selection change

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
        setViewAz(180); // Back to South
        setViewAlt(30);  // Back to 30 deg up
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

