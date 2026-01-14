
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
    Crosshair,
    ZoomIn
} from 'lucide-react';

interface WalkthroughStep {
    title: string;
    description: React.ReactNode;
    icon: React.ReactNode;
    targetId?: string;
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
        title: "Navigation Controls",
        icon: <Compass className="w-8 h-8 text-primary" />,
        targetId: "obs-compass-btn",
        description: (
            <div className="space-y-3">
                <p>Everything starts here. Click the **Compass** to open your observation controls, where you can change location, time, and navigation modes.</p>
            </div>
        )
    },
    {
        title: "Celestial Navigation (Polar)",
        icon: <Target className="w-8 h-8 text-blue-400" />,
        targetId: "obs-nav-modes",
        description: (
            <div className="space-y-3">
                <p>By default, we use **Polar Mode**. It tracks the sky by rotating around the Celestial Pole, just like a professional observatory telescope.</p>
                <div className="bg-white/5 p-3 rounded-lg border border-white/10 space-y-2 text-left mt-2">
                    <p className="text-[10px] font-mono uppercase text-primary/60">Celestial Grid (J2000)</p>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-white/40">RA</span>
                        <span className="text-white font-mono">Right Ascension</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-white/40">Dec</span>
                        <span className="text-white font-mono">Declination</span>
                    </div>
                </div>
            </div>
        )
    },
    {
        title: "Free Exploration (Planar)",
        icon: <Navigation className="w-8 h-8 text-green-400" />,
        targetId: "obs-nav-modes",
        description: (
            <div className="space-y-3">
                <p>Switch to **Planar Mode** to pan freely. This view uses your **Local Horizon**, showing you exactly what's visible from your current location.</p>
                <div className="bg-white/5 p-3 rounded-lg border border-white/10 space-y-2 text-left mt-2">
                    <p className="text-[10px] font-mono uppercase text-primary/60">Horizon Perspective</p>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-white/40">Alt</span>
                        <span className="text-white font-mono">Altitude (Height)</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-white/40">Az</span>
                        <span className="text-white font-mono">Azimuth (Heading)</span>
                    </div>
                </div>
            </div>
        )
    },
    {
        title: "Travel the Globe",
        icon: <MapPin className="w-8 h-8 text-amber-400" />,
        targetId: "obs-city-search",
        description: (
            <div className="space-y-3">
                <p>Search for any city to see its local sky. Logged-in users have their home location saved automatically for every visit.</p>
            </div>
        )
    },
    {
        title: "Time Travel",
        icon: <Clock className="w-8 h-8 text-amber-400" />,
        targetId: "obs-time-slider",
        description: (
            <div className="space-y-3">
                <p>Watch the stars move! Drag the **Time Slider** to simulate the day/night cycle and find the best time for observation.</p>
            </div>
        )
    },
    {
        title: "Zoom & Calibration",
        icon: <ZoomIn className="w-8 h-8 text-white/80" />,
        targetId: "obs-zoom-controls",
        description: (
            <div className="space-y-3">
                <p>Use these controls to zoom deep into nebulae or reset your view to the zenith. The coordinate grid will automatically adjust its detail as you zoom.</p>
            </div>
        )
    },
    {
        title: "Identify Objects",
        icon: <Crosshair className="w-8 h-8 text-red-400" />,
        description: (
            <div className="space-y-3">
                <p>Click on any star, planet, or constellation to reveal its **Real-time Coordinates** and scientific data.</p>
                <p className="text-white/60 text-sm">Clear skies, Commander.</p>
            </div>
        )
    }
];

interface ObservatoryWalkthroughProps {
    onClose: () => void;
    show?: boolean;
    isControlsOpen: boolean;
    setIsControlsOpen: (open: boolean) => void;
}

export const ObservatoryWalkthrough = ({ onClose, show = true, isControlsOpen, setIsControlsOpen }: ObservatoryWalkthroughProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    const step = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;

    useEffect(() => {
        if (!show) return;

        // Auto-open controls if the step targets something inside it
        const selectorTargets = ["obs-nav-modes", "obs-city-search", "obs-time-slider", "obs-date-input"];
        if (step.targetId && selectorTargets.includes(step.targetId) && !isControlsOpen) {
            setIsControlsOpen(true);
        }

        const updateRect = () => {
            if (step.targetId) {
                const el = document.getElementById(step.targetId);
                if (el) {
                    setTargetRect(el.getBoundingClientRect());
                } else {
                    setTargetRect(null);
                }
            } else {
                setTargetRect(null);
            }
        };

        // Give some time for the controls to open/animate before calculating the rect
        const timer = setTimeout(updateRect, isControlsOpen ? 50 : 400);

        // Listen for window resize
        window.addEventListener('resize', updateRect);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateRect);
        };
    }, [currentStep, show, isControlsOpen, step.targetId, setIsControlsOpen]);

    if (!show) return null;

    const handleNext = () => {
        if (isLastStep) {
            onClose();
            // Don't reset step here, let parent handle it or reset on show
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(0, prev - 1));
    };

    // Calculate walkthrough modal position
    const getModalStyle = (): React.CSSProperties => {
        if (!targetRect) return {};

        const padding = 20;
        const modalWidth = 384; // max-w-sm is 24rem = 384px

        let left: string | number = '50%';
        let top: string | number = '50%';
        let transform = 'translate(-50%, -50%)';

        // Horizontal positioning
        if (targetRect.left < window.innerWidth / 2) {
            // Target is on the left, place modal to the right of it
            left = targetRect.right + padding;
            transform = 'translate(0, -50%)';
        } else {
            // Target is on the right, place modal to the left of it
            left = targetRect.left - modalWidth - padding;
            transform = 'translate(0, -50%)';
        }

        // Vertical positioning
        top = targetRect.top + targetRect.height / 2;

        // Clamp to screen bounds
        if (typeof left === 'number' && left < padding) left = padding;
        if (typeof left === 'number' && left + modalWidth > window.innerWidth - padding) left = window.innerWidth - modalWidth - padding;

        return {
            position: 'absolute',
            left,
            top,
            transform
        };
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 pointer-events-none overflow-hidden select-none">
            {/* Spotlight Overlay */}
            <div className="absolute inset-0 z-0 bg-black/60 pointer-events-none transition-opacity duration-500" />

            {targetRect && (
                <div
                    className="absolute z-0 bg-black/40 pointer-events-none transition-all duration-500"
                    style={{
                        inset: 0,
                        maskImage: `radial-gradient(circle at ${targetRect.left + targetRect.width / 2}px ${targetRect.top + targetRect.height / 2}px, transparent ${Math.max(targetRect.width, targetRect.height) / 0.8}px, black ${Math.max(targetRect.width, targetRect.height) / 0.6}px)`,
                        WebkitMaskImage: `radial-gradient(circle at ${targetRect.left + targetRect.width / 2}px ${targetRect.top + targetRect.height / 2}px, transparent ${Math.max(targetRect.width, targetRect.height) / 1.5}px, black ${Math.max(targetRect.width, targetRect.height) / 1.2}px)`
                    }}
                />
            )}

            {/* Target Highlight Ring */}
            {targetRect && (
                <div
                    className="absolute z-10 border-2 border-primary rounded-2xl animate-pulse shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)] transition-all duration-500"
                    style={{
                        left: targetRect.left - 8,
                        top: targetRect.top - 8,
                        width: targetRect.width + 16,
                        height: targetRect.height + 16,
                    }}
                >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce">
                        <ChevronRight className="w-5 h-5 text-primary rotate-90" />
                    </div>
                </div>
            )}

            {/* Walkthrough Modal */}
            <div
                className={`w-full max-w-sm pointer-events-auto bg-[#0f172a]/95 backdrop-blur-md border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-500 z-20 ${targetRect ? '' : 'animate-in zoom-in-95 duration-300'}`}
                style={getModalStyle()}
            >
                {/* Header/Icon */}
                <div className="h-32 bg-gradient-to-b from-primary/20 to-transparent flex items-center justify-center relative">
                    <div className="p-4 bg-[#0f172a] rounded-2xl border border-white/10 shadow-xl scale-110">
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
                    <div className="inline-block px-3 py-1 bg-primary/10 rounded-full text-[10px] font-mono tracking-widest text-primary uppercase mb-3">
                        Guide Step {currentStep + 1} of {steps.length}
                    </div>
                    <h2 className="text-xl font-serif text-white mb-3 tracking-tight">{step.title}</h2>
                    <div className="text-white/80 leading-relaxed text-sm">
                        {step.description}
                    </div>

                    {/* Footer / Nav */}
                    <div className="flex items-center gap-3 mt-6">
                        {currentStep > 0 && (
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={handleBack}
                                className="flex-none h-11 px-4 rounded-xl border-white/10 text-white/60 hover:text-white"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                        )}
                        <Button
                            className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium text-base gap-2"
                            onClick={handleNext}
                        >
                            {isLastStep ? "Start Observing" : "Next Step"}
                            {!isLastStep && <ChevronRight className="w-4 h-4" />}
                        </Button>
                    </div>

                    {/* Progress dots */}
                    <div className="flex justify-center gap-1.5 mt-5">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 rounded-full transition-all duration-300 ${i === currentStep ? 'w-4 bg-primary' : 'w-1.5 bg-white/10'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
