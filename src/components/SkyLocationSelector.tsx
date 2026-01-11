import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Navigation, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface SkyLocationSelectorProps {
    onLocationChange: (lat: number, lng: number, date: Date) => void;
    onControlModeChange?: (mode: 'polar' | 'pan') => void;
    controlMode?: 'polar' | 'pan';
    className?: string;
}

export const SkyLocationSelector = ({ onLocationChange, onControlModeChange, controlMode = 'polar', className = '' }: SkyLocationSelectorProps) => {
    const [lat, setLat] = useState<string>('0');
    const [lng, setLng] = useState<string>('0');
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState<string>(new Date().toTimeString().split(' ')[0].slice(0, 5));
    const [isLocating, setIsLocating] = useState(false);

    const useMyLocation = () => {
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLat(pos.coords.latitude.toFixed(4));
                setLng(pos.coords.longitude.toFixed(4));
                setIsLocating(false);
            },
            () => setIsLocating(false)
        );
    };

    useEffect(() => {
        const fullDate = new Date(`${date}T${time}`);
        onLocationChange(parseFloat(lat) || 0, parseFloat(lng) || 0, fullDate);
    }, [lat, lng, date, time]);

    const handleTimeSliderChange = (val: number[]) => {
        const totalMinutes = val[0];
        const hours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
        const minutes = (totalMinutes % 60).toString().padStart(2, '0');
        setTime(`${hours}:${minutes}`);
    };

    const currentTotalMinutes = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);

    return (
        <div className={`glass-strong p-6 rounded-[2.5rem] space-y-6 border-white/10 shadow-2xl w-80 animate-in fade-in zoom-in-95 duration-300 ${className}`}>
            <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <h3 className="font-serif text-lg">Observer Horizon</h3>
                </div>
                <div className="font-mono text-[10px] text-primary/60 bg-primary/10 px-2 py-0.5 rounded-full">
                    EPOCH J2000
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Latitude</Label>
                    <Input
                        type="number"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        className="bg-white/5 border-white/10 h-8 font-mono text-xs rounded-xl"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Longitude</Label>
                    <Input
                        type="number"
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                        className="bg-white/5 border-white/10 h-8 font-mono text-xs rounded-xl"
                    />
                </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-white/5">
                <div className="flex justify-between items-center">
                    <Label className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Celestial Time
                    </Label>
                    <span className="font-mono text-xs font-bold text-primary">{time}</span>
                </div>
                <div className="px-1">
                    <Slider
                        defaultValue={[currentTotalMinutes]}
                        max={1439}
                        step={1}
                        onValueChange={handleTimeSliderChange}
                        className="cursor-pointer"
                    />
                </div>
                <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-white/5 border-white/10 h-8 text-xs rounded-xl"
                />
            </div>

            <div className="pt-2 border-t border-white/5 space-y-2">
                <Label className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1">
                    Navigation Mode
                </Label>
                <div className="flex bg-black/40 rounded-xl p-1 border border-white/10 relative">
                    <button
                        onClick={() => onControlModeChange?.('polar')}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-all ${controlMode === 'polar' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        TELESCOPE (POLAR)
                    </button>
                    <button
                        onClick={() => onControlModeChange?.('pan')}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-all ${controlMode === 'pan' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        FREE (PLANAR)
                    </button>
                </div>
            </div>

            <Button
                variant="outline"
                className="w-full gap-2 border-primary/20 hover:border-primary/50 bg-primary/5 rounded-2xl h-10 transition-all active:scale-95"
                onClick={useMyLocation}
                disabled={isLocating}
            >
                <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-pulse' : ''}`} />
                <span className="text-xs">{isLocating ? 'Locating...' : 'Sync with My Location'}</span>
            </Button>
        </div>
    );
};
