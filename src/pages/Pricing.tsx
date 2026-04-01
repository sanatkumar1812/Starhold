import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CosmicBackground } from '@/components/CosmicBackground';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ScrollToTop } from '@/components/ScrollToTop';
import {
  CheckCircle2, ChevronDown, ChevronRight, Star, Zap, Shield, Satellite, Users
} from 'lucide-react';

const tiers = [
  {
    id: 'observer',
    name: 'Observer',
    label: 'Personal · Free',
    price: 'Free',
    priceNote: 'Forever',
    description: 'Start anchoring personal memories to the cosmos. One star, one story — yours.',
    accentClass: 'text-muted-foreground',
    borderClass: 'border-border/40 hover:border-border/80',
    iconBg: 'bg-muted/40',
    btn: 'outline' as const,
    btnClass: '',
    icon: Star,
    features: [
      '1 Celestial Memory Anchor',
      'Single star binding',
      'Spectral key generation',
      'Public observatory access',
      'Community support',
    ],
    cta: 'Start Free',
    ctaPath: '/not-found',
    highlight: false,
  },
  {
    id: 'navigator',
    name: 'Navigator',
    label: 'Enthusiast',
    price: '$29',
    priceNote: '/ month',
    description: 'Expand your cosmic footprint with multi-star bindings and time-locked capsules.',
    accentClass: 'text-cosmic-purple',
    borderClass: 'border-cosmic-purple/30 hover:border-cosmic-purple/60 hover:shadow-[0_0_40px_hsl(270_60%_45%_/_0.12)]',
    iconBg: 'bg-cosmic-purple/10',
    btn: 'outline' as const,
    btnClass: 'border-cosmic-purple/40 text-cosmic-purple hover:bg-cosmic-purple/10',
    icon: Zap,
    features: [
      'Up to 25 Celestial Memory Anchors',
      'Multi-star binding per memory',
      'Private memory vaults',
      'Time-locked capsule delivery',
      'HD constellation snapshots',
      'Priority email support',
    ],
    cta: 'Get Navigator',
    ctaPath: '/not-found',
    highlight: false,
  },
  {
    id: 'sentinel',
    name: 'Sentinel',
    label: 'Most Popular',
    price: '$99',
    priceNote: '/ month',
    description: 'Unlimited personal archiving plus API access. For creators, researchers, and power users.',
    accentClass: 'text-primary',
    borderClass: 'border-primary/40 hover:border-primary/70 hover:shadow-[0_0_50px_hsl(38_70%_55%_/_0.15)]',
    iconBg: 'bg-primary/10',
    btn: 'gold' as const,
    btnClass: '',
    icon: Shield,
    features: [
      'Unlimited Celestial Memory Anchors',
      'Constellation binding clusters',
      'Immutable audit trail',
      'API access (read)',
      'EKD key preview',
      'Custom star dedication certificate',
      'Dedicated account manager',
      'SLA: 99.9% uptime',
    ],
    cta: 'Activate Sentinel',
    ctaPath: '/not-found',
    highlight: true,
  },
  {
    id: 'orbital',
    name: 'Orbital',
    label: 'Enterprise & Defense',
    price: 'Custom',
    priceNote: 'Bespoke pricing',
    description: 'Full aerospace-grade Environmental Key Derivation for orbital command authorization.',
    accentClass: 'text-cosmic-blue',
    borderClass: 'border-cosmic-blue/30 hover:border-cosmic-blue/60 hover:shadow-[0_0_40px_hsl(220_70%_35%_/_0.15)]',
    iconBg: 'bg-cosmic-blue/10',
    btn: 'outline' as const,
    btnClass: 'border-cosmic-blue/40 text-cosmic-blue hover:bg-cosmic-blue/10',
    icon: Satellite,
    features: [
      'Full EKD Command Authorization API',
      'Star-tracker hardware integration',
      'Physics-layer auth (non-spoofable)',
      'Additive Zero Trust layer',
      'On-prem deployment option',
      'DoD / ESA compliance support',
      '24/7 mission-critical support',
      'Custom SLA terms',
    ],
    cta: 'Contact Mission Team',
    ctaPath: '/contact',
    highlight: false,
  },
];

const tableRows = [
  { label: 'Celestial Memory Anchors', values: ['1', '25', 'Unlimited', 'Custom'] },
  { label: 'Star binding per memory', values: ['Single', 'Multi', 'Cluster', 'Constellation'] },
  { label: 'Time-locked capsules', values: [false, true, true, true] },
  { label: 'Private memory vaults', values: [false, true, true, true] },
  { label: 'API access', values: [false, false, 'Read', 'Full EKD'] },
  { label: 'EKD Command Auth', values: [false, false, 'Preview', true] },
  { label: 'Hardware integration', values: [false, false, false, true] },
  { label: 'On-prem deployment', values: [false, false, false, true] },
  { label: 'Support', values: ['Community', 'Priority', 'Dedicated', '24/7 Mission'] },
];

const faqs = [
  {
    q: 'What is Environmental Key Derivation (EKD)?',
    a: "EKD is Starhold's core technology — binding authentication events to the real-time physical state of a designated star. The key only exists at the moment of execution, making it impossible to pre-compute, steal, or replay.",
  },
  {
    q: 'Can I upgrade or downgrade my plan at any time?',
    a: 'Yes. Personal plans can be changed at any billing cycle boundary. Enterprise contracts are negotiated separately with our mission team.',
  },
  {
    q: "What does 'star binding' mean for my memories?",
    a: "Each memory is linked to a specific star's positional and spectral state at the moment of creation — a physics-based fingerprint that can never be replicated. Your personal timestamp from the universe itself.",
  },
  {
    q: 'How does the Orbital plan integrate with satellite systems?',
    a: 'Orbital provides full API access to our EKD command authorization stack. Integration with existing star-tracker hardware allows satellite operators to require physics-layer proof alongside digital credentials before executing any command.',
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <CosmicBackground />
      <div className="relative z-10">
        <Navigation />

        <main className="pt-32 pb-20">

          {/* ── HERO ── */}
          <section className="px-4 pb-24 text-center relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cosmic-purple/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="relative max-w-3xl mx-auto space-y-6">
              <ScrollReveal>
                <p className="text-xs font-mono uppercase tracking-[0.4em] text-muted-foreground">Access Tiers</p>
                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-tight mt-2">
                  Choose Your <span className="text-gradient-gold italic text-glow">Orbit</span>
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={150}>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
                  From personal cosmic memory archives to aerospace-grade command authorization — every tier is built on physics-based trust.
                </p>
              </ScrollReveal>
            </div>
          </section>

          {/* ── TIER CARDS ── */}
          <section className="px-4 pb-28">
            <div className="max-w-7xl mx-auto grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {tiers.map((tier, idx) => {
                const Icon = tier.icon;
                return (
                  <ScrollReveal key={tier.id} delay={idx * 80}>
                    <div className={`relative h-full flex flex-col glass-strong rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 ${tier.borderClass} ${tier.highlight ? 'ring-1 ring-primary/30' : ''}`}>

                      {tier.highlight && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-gold text-xs font-semibold text-foreground font-mono uppercase tracking-widest whitespace-nowrap shadow-md">
                          Most Popular
                        </div>
                      )}

                      {/* Header */}
                      <div className="space-y-4 mb-8">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${tier.iconBg}`}>
                          <Icon className={`w-5 h-5 ${tier.accentClass}`} />
                        </div>
                        <div>
                          <p className={`text-xs font-mono uppercase tracking-widest mb-1 ${tier.accentClass}`}>{tier.label}</p>
                          <h3 className="font-serif text-2xl text-foreground">{tier.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{tier.description}</p>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mb-8 pb-8 border-b border-border/30">
                        <span className={`font-serif text-4xl ${tier.accentClass}`}>{tier.price}</span>
                        <span className="text-sm text-muted-foreground">{tier.priceNote}</span>
                      </div>

                      {/* Features */}
                      <ul className="space-y-3 flex-1 mb-8">
                        {tier.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tier.accentClass}`} strokeWidth={2} />
                            <span className="text-sm text-muted-foreground leading-snug">{f}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <Button
                        variant={tier.btn}
                        className={`w-full ${tier.btnClass}`}
                        onClick={() => navigate(tier.ctaPath)}
                      >
                        {tier.cta} <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>

            <ScrollReveal delay={400}>
              <div className="mt-10 flex items-center justify-center gap-4">
                <div className="flex-1 max-w-xs h-px bg-border/30" />
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground/40" />
                  <p className="text-xs font-mono text-muted-foreground/50 uppercase tracking-widest">
                    All plans include physics-layer celestial binding
                  </p>
                </div>
                <div className="flex-1 max-w-xs h-px bg-border/30" />
              </div>
            </ScrollReveal>
          </section>

          {/* ── FEATURE TABLE ── */}
          <section className="px-4 pb-28 relative">
            <div className="absolute inset-0 bg-slate-950/40 pointer-events-none" />
            <div className="relative max-w-5xl mx-auto">
              <ScrollReveal>
                <div className="text-center mb-16 space-y-3">
                  <p className="text-xs font-mono uppercase tracking-[0.4em] text-muted-foreground">Full Comparison</p>
                  <h2 className="font-serif text-4xl text-foreground">Feature Matrix</h2>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={150}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/30">
                        <th className="text-left py-4 pr-8 text-xs font-mono uppercase tracking-widest text-muted-foreground/60 w-1/3">Capability</th>
                        {tiers.map(t => (
                          <th key={t.id} className={`text-center py-4 px-4 font-serif text-base ${t.accentClass}`}>{t.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map((row, i) => (
                        <tr key={i} className={`border-b border-border/20 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                          <td className="py-4 pr-8 text-muted-foreground text-sm">{row.label}</td>
                          {row.values.map((val, vi) => {
                            const colors = [
                              'text-muted-foreground',
                              'text-cosmic-purple',
                              'text-primary',
                              'text-cosmic-blue',
                            ];
                            return (
                              <td key={vi} className="py-4 px-4 text-center">
                                {typeof val === 'boolean' ? (
                                  val
                                    ? <CheckCircle2 className={`w-4 h-4 mx-auto ${colors[vi]}`} strokeWidth={2} />
                                    : <span className="text-border font-serif text-lg">—</span>
                                ) : (
                                  <span className={`text-xs font-mono uppercase tracking-wide ${colors[vi]}`}>{val}</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="px-4 pb-28">
            <div className="max-w-2xl mx-auto">
              <ScrollReveal>
                <div className="text-center mb-16 space-y-3">
                  <p className="text-xs font-mono uppercase tracking-[0.4em] text-muted-foreground">Questions</p>
                  <h2 className="font-serif text-4xl text-foreground">Briefing Room</h2>
                </div>
              </ScrollReveal>

              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <ScrollReveal key={i} delay={i * 60}>
                    <div className="glass rounded-2xl border border-border/30 overflow-hidden">
                      <button
                        className="w-full flex items-center justify-between p-6 text-left gap-4 hover:bg-white/[0.03] transition-colors"
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      >
                        <span className="font-medium text-foreground">{faq.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {openFaq === i && (
                        <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-200">
                          <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── BOTTOM CTA ── */}
          <section className="px-4 pb-8">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center space-y-8 py-20 relative">
                <div className="absolute inset-0 bg-cosmic-purple/5 rounded-3xl blur-2xl" />
                <div className="relative space-y-6">
                  <h2 className="font-serif text-4xl md:text-5xl text-foreground">
                    Ready to anchor your<br />
                    <span className="text-gradient-gold italic">mission to the stars?</span>
                  </h2>
                  <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
                    Whether preserving a personal legacy or securing an orbital asset — the cosmos is waiting.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                    <Button
                      variant="gold"
                      size="lg"
                      className="px-8 py-6 text-base rounded-xl shadow-[0_0_30px_rgba(234,179,8,0.2)] hover:shadow-[0_0_50px_rgba(234,179,8,0.4)] transition-all"
                      onClick={() => navigate('/not-found')}
                    >
                      Start Free — Observer
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-8 py-6 text-base rounded-xl border-border/40"
                      onClick={() => navigate('/contact')}
                    >
                      Talk to Mission Team
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </section>

        </main>

        <Footer />
        <ScrollToTop />
      </div>
    </div>
  );
};

export default Pricing;
