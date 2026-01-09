import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Navigation, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SkyLocationSelectorProps {
    onLocationChange: (lat: number, lng: number, date: Date) => void;
    className?: string;
}

export const SkyLocationSelector = ({ onLocationChange, className = '' }: SkyLocationSelectorProps) => {
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

    return (
        <div className={`glass-strong p-6 rounded-3xl space-y-6 border-white/10 ${className}`}>
            <div className="flex items-center gap-3 mb-2">
                <Globe className="w-5 h-5 text-primary" />
                <h3 className="font-serif text-xl">Observer Horizon</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground mr-2">Latitude</Label>
                    <Input
                        type="number"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        className="bg-white/5 border-white/10 h-9 font-mono text-xs"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground mr-2">Longitude</Label>
                    <Input
                        type="number"
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                        className="bg-white/5 border-white/10 h-9 font-mono text-xs"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Date
                    </Label>
                    <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-white/5 border-white/10 h-9 text-xs"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Time
                    </Label>
                    <Input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="bg-white/5 border-white/10 h-9 text-xs"
                    />
                </div>
            </div>

            <Button
                variant="outline"
                className="w-full gap-2 border-primary/20 hover:border-primary/50 bg-primary/5 rounded-xl h-10"
                onClick={useMyLocation}
                disabled={isLocating}
            >
                <Navigation className={`w-4 h-4 ${isLocating ? 'animate-pulse' : ''}`} />
                {isLocating ? 'Locating...' : 'Sync with My Location'}
            </Button>

            <p className="text-[10px] text-muted-foreground text-center italic">
                Adjust coordinates to see the sky configuration above any point on Earth.
            </p>
        </div>
    );
};
