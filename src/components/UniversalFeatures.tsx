import { Globe, Clock, Eye } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const UniversalFeatures = () => {
    const features = [
        {
            icon: Globe,
            title: "Orbit-Agnostic Access",
            description: "From Low Earth Orbit to deep space trajectories, our network remains accessible. B2B mission data and personal memories share the same resilient infrastructure.",
            gradient: "from-blue-500/20 to-purple-500/20",
            iconColor: "text-blue-400"
        },
        {
            icon: Clock,
            title: "Temporal Precision",
            description: "Atomic-clock synchronization ensures your data is locked to the exact moment of transmission. Perfect for verifying mission timestamps or preserving a fleeting memory.",
            gradient: "from-amber-500/20 to-orange-500/20",
            iconColor: "text-amber-400"
        },
        {
            icon: Eye,
            title: "Visual Confirmation",
            description: "The stars themselves are your verification keys. Look up to confirm the coordinates of your data, whether it's a critical telemetry packet or a message to a loved one.",
            gradient: "from-emerald-500/20 to-cyan-500/20",
            iconColor: "text-emerald-400"
        }
    ];

    return (
        <section className="py-24 px-4 relative">
            <div className="max-w-7xl mx-auto">
                <ScrollReveal>
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                            Universal Capabilities
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            The same physics that guide spacecraft guide your memories.
                            Our core technologies serve every user, on every horizon.
                        </p>
                    </div>
                </ScrollReveal>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <ScrollReveal key={index} delay={index * 100}>
                            <div className="group relative p-1 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02]">
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                <div className="absolute inset-0 border border-white/5 rounded-3xl" />

                                <div className="relative h-full bg-slate-950/50 backdrop-blur-sm rounded-[22px] p-8 hover:bg-slate-950/30 transition-colors border border-white/5">
                                    <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors`}>
                                        <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                                    </div>

                                    <h3 className="font-serif text-xl text-foreground mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
};
