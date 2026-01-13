
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    X,
    ChevronRight,
    ChevronLeft,
    Navigation,
    Compass,
    Globe,
    Target,
    Clock,
    MapPin,
    Info,
    Crosshair
} from 'lucide-react';

interface WalkthroughStep {
    title: string;
    description: React.ReactNode;
    icon: React.ReactNode;
}

const steps: WalkthroughStep[] = [
    {
        title: "Welcome, Stargazer",
        icon: <Globe className="w-8 h-8 text-primary" />,
        description: (
            <div className="space-y-3">
                <p>Welcome to the **Stellar Observatory**, your window into the cosmos. Here you can track stars, planets, and constellations in real-time from anywhere on Earth.</p>
                <p className="text-white/60 text-sm">Let's take a quick tour of your tools.</p>
            </div>
        )
    },
    {
        title: "Celestial Navigation (Polar)",
        icon: <Target className="w-8 h-8 text-blue-400" />,
        description: (
            <div className="space-y-3">
                <p>By default, the map uses **Polar Mode** (Telescope). It rotates around the Celestial Pole, mimicking how a professional telescope tracks the sky.</p>
                <div className="bg-white/5 p-3 rounded-lg border border-white/10 space-y-2">
                    <p className="text-xs font-mono uppercase text-primary/60">Celestial Grid (J2000)</p>
                    <p className="text-xs">**Right Ascension (RA)**: Constant longitude-like coordinate.</p>
                    <p className="text-xs">**Declination (Dec)**: Constant latitude-like coordinate.</p>
                </div>
            </div>
        )
    },
    {
        title: "Free Exploration (Planar)",
        icon: <Navigation className="w-8 h-8 text-green-400" />,
        description: (
            <div className="space-y-3">
                <p>Switch to **Planar Mode** to pan freely. This view uses **Horizon Coordinates**, showing you exactly what's visible from your local viewpoint.</p>
                <div className="bg-white/5 p-3 rounded-lg border border-white/10 space-y-2">
                    <p className="text-xs font-mono uppercase text-primary/60">Horizon Perspective</p>
                    <p className="text-xs">**Altitude**: Height above the horizon (0° to 90°).</p>
                    <p className="text-xs">**Azimuth**: Compass direction from North (0° to 360°).</p>
                </div>
            </div>
        )
    },
    {
        title: "Time & Location",
        icon: <Clock className="w-8 h-8 text-amber-400" />,
        description: (
            <div className="space-y-3">
                <p>Explore the sky at any time or place. Use the **City Search** to travel instantly, and the **Time Slider** to watch sunrise, sunset, and star movements.</p>
                <p className="text-white/60 text-sm italic">Logged-in users will have their home city saved automatically!</p>
            </div>
        )
    },
    {
        title: "Identity Objects",
        icon: <Crosshair className="w-8 h-8 text-red-400" />,
        description: (
            <div className="space-y-3">
                <p>Click on any star, planet, or constellation to reveal its **Spectral Type**, **Magnitude**, and **Real-time Coordinates**. We synchronize with NASA and Hipparcos data for scientific accuracy.</p>
                <p className="text-white/60 text-sm">Clear skies, Commander.</p>
            </div>
        )
    }
];

interface ObservatoryWalkthroughProps {
    onClose: () => void;
    show?: boolean;
}

export const ObservatoryWalkthrough = ({ onClose, show = true }: ObservatoryWalkthroughProps) => {
    const [currentStep, setCurrentStep] = useState(0);

    if (!show) return null;

    const step = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;

    const handleNext = () => {
        if (isLastStep) {
            onClose();
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(0, prev - 1));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-500">
            <div className="w-full max-w-md bg-[#0f172a] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header/Icon */}
                <div className="h-40 bg-gradient-to-b from-primary/20 to-transparent flex items-center justify-center relative">
                    <div className="p-6 bg-[#0f172a] rounded-3xl border border-white/10 shadow-xl scale-110">
                        {step.icon}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/50 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="px-8 pb-8 pt-2 text-center">
                    <div className="inline-block px-3 py-1 bg-primary/10 rounded-full text-[10px] font-mono tracking-widest text-primary uppercase mb-4">
                        Step {currentStep + 1} of {steps.length}
                    </div>
                    <h2 className="text-2xl font-serif text-white mb-4 tracking-tight">{step.title}</h2>
                    <div className="text-white/80 leading-relaxed text-sm">
                        {step.description}
                    </div>

                    {/* Footer / Nav */}
                    <div className="flex items-center gap-3 mt-8">
                        {currentStep > 0 && (
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={handleBack}
                                className="flex-none rounded-2xl border-white/10 text-white/60 hover:text-white"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                        )}
                        <Button
                            className="flex-1 h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-medium text-lg gap-2"
                            onClick={handleNext}
                        >
                            {isLastStep ? "Enter Observatory" : "Continue"}
                            {!isLastStep && <ChevronRight className="w-5 h-5" />}
                        </Button>
                    </div>

                    {/* Progress dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 rounded-full transition-all duration-300 ${i === currentStep ? 'w-6 bg-primary' : 'w-2 bg-white/10'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
