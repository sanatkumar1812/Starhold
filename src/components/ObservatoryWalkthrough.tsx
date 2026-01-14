
import React, { useState, useEffect, useCallback } from 'react';
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
    ZoomIn,
    ArrowRight
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
            <div className="space-y-4">
                <p className="text-base text-white/90">Welcome to the **Stellar Observatory**, your window into the cosmos. Here you can track stars, planets, and constellations in real-time from anywhere on Earth.</p>
                <p className="text-white/60 text-sm">Let's take a 1-minute tour of your navigational equipment.</p>
            </div>
        )
    },
    {
        title: "Navigation Controls",
        icon: <Compass className="w-8 h-8 text-primary" />,
        targetId: "obs-compass-btn",
        description: (
            <div className="space-y-3 font-light leading-relaxed">
                <p>Everything starts here. Click the **Compass** to open your observation controls—your headquarters for location, time, and navigation modes.</p>
            </div>
        )
    },
    {
        title: "Celestial Navigation (Polar)",
        icon: <Target className="w-8 h-8 text-blue-400" />,
        targetId: "obs-nav-modes",
        description: (
            <div className="space-y-3">
                <p>By default, we use **Polar Mode**. It tracks the sky by rotating around the Celestial Pole, mimicking a professional observatory telescope.</p>
                <div className="bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10 space-y-2 text-left mt-2">
                    <p className="text-[10px] font-mono uppercase text-primary/60 tracking-widest">Celestial Grid (J2000)</p>
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
                <div className="bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10 space-y-2 text-left mt-2">
                    <p className="text-[10px] font-mono uppercase text-primary/60 tracking-widest">Horizon Perspective</p>
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
            <div className="space-y-3 text-white/80">
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
        icon: <ZoomIn className="w-8 h-8 text-indigo-400" />,
        targetId: "obs-zoom-controls",
        description: (
            <div className="space-y-3">
                <p>Use these controls to zoom deep into nebulae or reset your view to the zenith. The coordinate grid will automatically adjust detail as you zoom.</p>
            </div>
        )
    },
    {
        title: "Identify Objects",
        icon: <Crosshair className="w-8 h-8 text-red-400" />,
        description: (
            <div className="space-y-4">
                <p>Click on any star, planet, or constellation to reveal its **Real-time Coordinates** and scientific data.</p>
                <div className="pt-4 border-t border-white/5">
                    <p className="text-primary font-serif italic text-lg tracking-tight font-medium">Clear skies, Commander.</p>
                </div>
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

    const updateRect = useCallback(() => {
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
    }, [step.targetId]);

    useEffect(() => {
        if (!show) return;

        // Auto-open controls if the step targets something inside it
        const selectorTargets = ["obs-nav-modes", "obs-city-search", "obs-time-slider", "obs-date-input"];
        if (step.targetId && selectorTargets.includes(step.targetId) && !isControlsOpen) {
            setIsControlsOpen(true);
        }

        // Give some time for the controls to open/animate before calculating the rect
        const timer = setTimeout(updateRect, isControlsOpen ? 50 : 400);

        // Listen for window resize
        window.addEventListener('resize', updateRect);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateRect);
        };
    }, [currentStep, show, isControlsOpen, step.targetId, setIsControlsOpen, updateRect]);

    if (!show) return null;

    const handleNext = () => {
        if (isLastStep) {
            onClose();
            setCurrentStep(0);
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(0, prev - 1));
    };

    const handleSkip = () => {
        onClose();
        setCurrentStep(0);
    };

    // Calculate walkthrough modal position
    const getModalStyle = (): React.CSSProperties => {
        if (!targetRect) return {};

        const isMobile = window.innerWidth < 768;
        const padding = isMobile ? 12 : 32;
        const modalWidth = isMobile ? window.innerWidth - (padding * 2) : 384;
        const modalHeight = 450; // Approximated max height

        if (isMobile) {
            // On mobile, clamp to top or bottom to avoid covering the middle area
            const isTargetInTopHalf = targetRect.top < window.innerHeight / 2;
            return {
                position: 'absolute',
                left: padding,
                right: padding,
                bottom: isTargetInTopHalf ? padding : 'auto',
                top: !isTargetInTopHalf ? padding : 'auto',
                transform: 'none',
                maxWidth: 'none',
                zIndex: 100
            };
        }

        // Desktop positioning logic
        let left: string | number = '50%';
        let top: string | number = '50%';
        let transform = 'translate(-50%, -50%)';

        // Horizontal positioning: Place opposite to the target
        if (targetRect.left < window.innerWidth / 2) {
            left = targetRect.right + padding;
            transform = 'translate(0, -50%)';
        } else {
            left = targetRect.left - modalWidth - padding;
            transform = 'translate(0, -50%)';
        }

        // Vertical positioning: Align center with target but clamp to viewport
        top = targetRect.top + targetRect.height / 2;

        // Clamp vertically
        const minTop = (modalHeight / 2) + padding;
        const maxTop = window.innerHeight - (modalHeight / 2) - padding;
        top = Math.max(minTop, Math.min(maxTop, top));

        return {
            position: 'absolute',
            left,
            top,
            transform,
            width: modalWidth
        };
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden select-none">
            {/* Global Backdrop - subtle blur for the whole page */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] pointer-events-auto" onClick={onClose} />

            {/* Spotlight Mask */}
            {targetRect && (
                <div
                    className="absolute inset-0 z-0 bg-black/60 pointer-events-none transition-all duration-700 ease-in-out"
                    style={{
                        maskImage: `radial-gradient(circle at ${targetRect.left + targetRect.width / 2}px ${targetRect.top + targetRect.height / 2}px, transparent ${Math.max(targetRect.width, targetRect.height) / 0.8}px, black ${Math.max(targetRect.width, targetRect.height) / 0.6}px)`,
                        WebkitMaskImage: `radial-gradient(circle at ${targetRect.left + targetRect.width / 2}px ${targetRect.top + targetRect.height / 2}px, transparent ${Math.max(targetRect.width, targetRect.height) / 1.5}px, black ${Math.max(targetRect.width, targetRect.height) / 1.2}px)`
                    }}
                />
            )}
            {!targetRect && <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-0 transition-opacity duration-700" />}

            {/* Target Highlight Ring */}
            {targetRect && (
                <div
                    className="absolute z-10 border-2 border-primary/50 rounded-2xl shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)] transition-all duration-700 ease-in-out"
                    style={{
                        left: targetRect.left - 12,
                        top: targetRect.top - 12,
                        width: targetRect.width + 24,
                        height: targetRect.height + 24,
                    }}
                >
                    <div className="absolute inset-0 rounded-2xl border border-primary/20 animate-ping opacity-20" />

                    {/* Directional Indicator */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
                            <ArrowRight className="w-4 h-4 text-white rotate-90" />
                        </div>
                    </div>
                </div>
            )}

            {/* Walkthrough Modal */}
            <div
                className={`w-full pointer-events-auto bg-[#0f172a]/60 backdrop-blur-3xl border border-white/20 rounded-[3rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-700 ease-in-out z-20 ${!targetRect ? 'animate-in zoom-in-95 fade-in duration-500 max-w-sm' : ''}`}
                style={getModalStyle()}
            >
                {/* Visual Header */}
                <div className="h-32 bg-gradient-to-b from-primary/10 to-transparent flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_120%,var(--primary)_0%,transparent_70%)]" />
                    <div className="p-5 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl scale-110 relative z-10 transition-transform duration-500 hover:scale-125">
                        {step.icon}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="absolute top-6 right-6 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Body Content */}
                <div className="px-10 pb-10 pt-4 text-center relative">
                    <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full text-[10px] font-mono tracking-[0.3em] text-primary uppercase mb-5 border border-primary/20">
                        Step {currentStep + 1} of {steps.length}
                    </div>

                    <h2 className="text-2xl font-serif text-white mb-4 tracking-tight leading-tight">{step.title}</h2>

                    <div className="text-white/70 leading-relaxed text-sm antialiased font-light max-w-[280px] mx-auto min-h-[80px]">
                        {step.description}
                    </div>

                    {/* Interaction Bar */}
                    <div className="flex flex-col gap-4 mt-10">
                        <div className="flex items-center gap-3">
                            {currentStep > 0 && (
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={handleBack}
                                    className="flex-none h-14 w-14 rounded-2xl border-white/10 bg-white/5 text-white/50 hover:text-white hover:border-white/20 hover:scale-105 transition-all p-0"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </Button>
                            )}
                            <Button
                                className="flex-1 h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-semibold text-lg gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                onClick={handleNext}
                            >
                                {isLastStep ? "Enter Observatory" : "Next Step"}
                                {!isLastStep && <ChevronRight className="w-5 h-5" />}
                            </Button>
                        </div>

                        {!isLastStep && (
                            <button
                                onClick={handleSkip}
                                className="text-[10px] text-white/30 uppercase tracking-[0.2em] hover:text-white transition-colors py-2 font-mono"
                            >
                                Skip Tour
                            </button>
                        )}
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex justify-center gap-2 mt-8">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-500 ${i === currentStep ? 'w-8 bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]' : 'w-2 bg-white/10 hover:bg-white/20'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
