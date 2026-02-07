import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pin, Send, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { calculateGalacticPulseCount } from '@/lib/pulsar-timing';

interface MemoryBeaconProps {
    selectedStar: { ra: number; dec: number; name?: string } | null;
    onClose: () => void;
    onSave: (data: any) => void;
}

export const MemoryBeacon = ({ selectedStar, onClose, onSave }: MemoryBeaconProps) => {
    const [message, setMessage] = useState('');

    if (!selectedStar) return null;

    const handleSave = () => {
        const tau = calculateGalacticPulseCount(0.005); // Using a reference 5ms period
        const beaconData = {
            message,
            coords: { ra: selectedStar.ra, dec: selectedStar.dec },
            timestamp: new Date().toISOString(),
            pulsar_tick: tau,
            id: Math.random().toString(36).substr(2, 9)
        };
        onSave(beaconData);
        setMessage('');
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[60] w-[400px] glass p-6 border border-cyan-500/30 rounded-xl"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-cyan-400">
                    <Pin className="w-4 h-4" />
                    <h3 className="text-xs font-bold uppercase tracking-widest">Pin Memory Beacon</h3>
                </div>
                <button onClick={onClose} className="text-cyan-500/50 hover:text-cyan-400">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-4">
                <div className="p-3 bg-cyan-950/20 border border-cyan-500/10 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-[10px] uppercase font-mono">
                        <span className="text-cyan-500/60">Target RA:</span>
                        <span className="text-cyan-400">{selectedStar.ra.toFixed(4)}°</span>
                        <span className="text-cyan-500/60">Target Dec:</span>
                        <span className="text-cyan-400">{selectedStar.dec.toFixed(4)}°</span>
                        <span className="text-cyan-500/60">Galactic Frame:</span>
                        <span className="text-amber-500">ICRS J2000</span>
                    </div>
                </div>

                <div className="relative">
                    <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your cosmic message..."
                        className="bg-black/40 border-cyan-500/20 text-cyan-100 placeholder:text-cyan-500/30 h-10 pr-10"
                    />
                    <Globe className="absolute right-3 top-3 w-4 h-4 text-cyan-500/30" />
                </div>

                <Button
                    onClick={handleSave}
                    disabled={!message}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold uppercase tracking-widest text-[10px]"
                >
                    <Send className="w-3 h-3 mr-2" />
                    Broadcast to Pulsar Network
                </Button>
            </div>
        </motion.div>
    );
};
