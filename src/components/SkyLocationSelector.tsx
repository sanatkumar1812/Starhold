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

    // City Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.length < 3) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Geocoding error:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const selectCity = (city: any) => {
        setLat(parseFloat(city.lat).toFixed(4));
        setLng(parseFloat(city.lon).toFixed(4));
        setSearchResults([]);
        setSearchQuery(city.display_name.split(',')[0]);
    };

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
        // Interpret the selected date/time as "Local Clock Time" for the target coordinates.
        // We create a naive date object, then adjust it based on longitude to get the real UTC point in time.
        // This ensures that "12:00" on the slider is always roughly local noon at any city globally.
        const naiveDate = new Date(`${date}T${time}Z`); // Treat as UTC initially to get a stable base
        const lngNum = parseFloat(lng) || 0;

        // Offset in hours from UTC (15 degrees per hour)
        const timezoneOffsetHours = lngNum / 15;

        // Real UTC = Local Time - Offset
        const utcDate = new Date(naiveDate.getTime() - timezoneOffsetHours * 3600000);

        onLocationChange(parseFloat(lat) || 0, lngNum, utcDate);
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

            {/* City Search */}
            <div className="relative space-y-1.5">
                <Label className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Search City
                </Label>
                <Input
                    id="obs-city-search"
                    placeholder="Enter city name..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="bg-white/5 border-white/10 h-8 text-xs rounded-xl"
                />
                {isSearching && (
                    <div className="absolute right-3 top-7">
                        <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    </div>
                )}
                {searchResults.length > 0 && (
                    <div className="absolute top-14 left-0 right-0 bg-slate-900/95 border border-white/10 rounded-xl overflow-hidden z-[60] shadow-2xl backdrop-blur-xl">
                        {searchResults.map((result, idx) => (
                            <button
                                key={idx}
                                onClick={() => selectCity(result)}
                                className="w-full px-3 py-2 text-left text-[11px] text-white/80 hover:bg-primary/20 hover:text-white border-b border-white/5 last:border-0 transition-colors"
                            >
                                <div className="font-semibold truncate">{result.display_name.split(',')[0]}</div>
                                <div className="text-[9px] text-white/40 truncate">
                                    {result.display_name.split(',').slice(1).join(',').trim()}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
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
                <div id="obs-time-slider" className="px-1">
                    <Slider
                        defaultValue={[currentTotalMinutes]}
                        max={1439}
                        step={1}
                        onValueChange={handleTimeSliderChange}
                        className="cursor-pointer"
                    />
                </div>
                <Input
                    id="obs-date-input"
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
                <div id="obs-nav-modes" className="flex bg-black/40 rounded-xl p-1 border border-white/10 relative">
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
