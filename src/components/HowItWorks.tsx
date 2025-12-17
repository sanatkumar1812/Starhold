import { Pen, Star, Lock, Telescope } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      icon: Pen,
      title: 'Create Your Memory',
      description: 'Write a heartfelt message, upload cherished photos, or compose a letter to your future self or loved one.',
    },
    {
      icon: Star,
      title: 'Receive Cosmic Coordinates',
      description: 'Your memory is assigned unique Right Ascension (α) and Declination (δ) coordinates—a permanent address in the observable universe.',
    },
    {
      icon: Lock,
      title: 'Set the Unlock Date',
      description: 'Choose when the memory should be revealed: a milestone birthday, anniversary, or any meaningful future moment.',
    },
    {
      icon: Telescope,
      title: 'Experience the Reveal',
      description: 'When the time comes, unlock your memory alongside a stunning visualization of the actual space around your coordinates from JWST/Hubble data.',
    },
  ];

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">
            How it <span className="text-gradient-gold">works</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your memory becomes part of the cosmos—encoded, protected, and waiting for the perfect moment.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="glass rounded-2xl p-6 space-y-4 relative overflow-hidden group hover:border-primary/30 transition-all duration-500"
            >
              {/* Step number */}
              <span className="absolute top-4 right-4 text-6xl font-serif text-primary/10 group-hover:text-primary/20 transition-colors">
                {index + 1}
              </span>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <step.icon className="w-6 h-6 text-primary" />
              </div>

              {/* Content */}
              <h3 className="font-serif text-xl text-foreground">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Connection line for desktop */}
        <div className="hidden lg:block relative h-0.5 -mt-[9.5rem] mx-16 mb-[9.5rem]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>
      </div>
    </section>
  );
};
