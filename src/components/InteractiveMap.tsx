import React, { useEffect, useRef, useState, useMemo } from 'react';
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

export const InteractiveMap = ({ memories, onMemoryClick, observerLocation, className = '' }: InteractiveMapProps) => {
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
    const projectionRef = useRef(d3.geoStereographic().scale(600).clipAngle(120).rotate([0, -45, 0]));
    const rotationRef = useRef<[number, number, number]>([0, -45, 0]);
    const targetRotationRef = useRef<[number, number, number] | null>(null);

    // Update rotation if observerLocation provided
    useEffect(() => {
        if (observerLocation) {
            const { lat, lng, date } = observerLocation;
            const lst = getLST(date, lng);
            // Rotate the sky so that the Zenith (Point above observer) is at the center.
            // Zenith RA = Local Sidereal Time, Zenith Dec = Observer Latitude
            // D3 rotation is [lng, -lat, roll] (for Geo) 
            // For Sky: [-RA, -Dec, 0]? Actually D3 Geo expects Longitude/Latitude.
            // RA is basically Longitude (0-360). 
            // We want LST at the center. So rotate by -LST.
            targetRotationRef.current = [-lst, -lat, 0];
        }
    }, [observerLocation]);

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
                : { altitude: -10 }; // Default to night

            let skyColor;
            if (sunHorizon.altitude > 0) {
                // Day / Twilight
                const alt = Math.min(15, sunHorizon.altitude);
                const dayFactor = alt / 15;
                const r = Math.floor(15 + 85 * dayFactor);
                const g = Math.floor(23 + 140 * dayFactor);
                const b = Math.floor(42 + 213 * dayFactor);
                skyColor = `rgb(${r}, ${g}, ${b})`;
            } else {
                skyColor = '#000000';
            }

            const gradient = ctx.createRadialGradient(width / 2, height, height * 0.2, width / 2, height / 2, width);
            if (sunHorizon.altitude > 0) {
                gradient.addColorStop(0, skyColor);
                gradient.addColorStop(1, '#050a14');
            } else {
                gradient.addColorStop(0, '#0f172a');
                gradient.addColorStop(0.5, '#020617');
                gradient.addColorStop(1, '#000000');
            }
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

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

            // 1.5 Draw Graticule Labels
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.font = '9px monospace';
            ctx.textAlign = 'center';

            // RA Labels (along equator)
            for (let ra = 0; ra < 360; ra += 30) {
                const lng = ra > 180 ? ra - 360 : ra;
                const p = projection([lng, 0]);
                if (p) {
                    ctx.fillText(`${ra / 15}h`, p[0], p[1] + 10);
                }
            }

            // Dec Labels (along prime meridian)
            ctx.textAlign = 'right';
            for (let dec = -60; dec <= 60; dec += 30) {
                const p = projection([0, dec]);
                if (p) {
                    ctx.fillText(`${dec > 0 ? '+' : ''}${dec}°`, p[0] - 5, p[1] + 3);
                }
            }

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

        // Interactions
        // @ts-ignore
        const drag = d3.drag()
            .on('drag', (event: any) => {
                targetRotationRef.current = null; // Cancel animations
                const k = 0.5;
                const [r0, r1, r2] = rotationRef.current;
                const newRotation = [r0 + event.dx * k, r1 - event.dy * k, r2];
                rotationRef.current = newRotation;
                projection.rotate(newRotation as any);
                // No need to call render manually if animation loop is running
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
        targetRotationRef.current = [0, -45, 0];
        projectionRef.current.scale(600);
        setSelectedObject(null);
    };

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

            {/* Controls */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                <Button variant="secondary" size="icon" onClick={() => handleZoom(200)} className="bg-white/10 hover:bg-white/20 border-white/10 text-white"><ZoomIn className="w-5 h-5" /></Button>
                <Button variant="secondary" size="icon" onClick={() => handleZoom(-200)} className="bg-white/10 hover:bg-white/20 border-white/10 text-white"><ZoomOut className="w-5 h-5" /></Button>
                <Button variant="secondary" size="icon" onClick={resetView} className="bg-white/10 hover:bg-white/20 border-white/10 text-white"><RotateCcw className="w-5 h-5" /></Button>
            </div>

            {/* Legend */}
            <div className="absolute top-6 right-6 pointer-events-none text-right opacity-60 hover:opacity-100 transition-opacity">
                <h1 className="text-3xl font-thin tracking-[0.2em] text-white">OBSERVATORY</h1>
                <div className="text-xs text-blue-200 mt-1 font-mono">
                    <span className="mr-3">★ {celestialData.stars.length} Stars</span>
                    <span>☡ 88 Constellations</span>
                </div>
            </div>
        </div>
    );
};

