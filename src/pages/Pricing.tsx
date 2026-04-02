import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CosmicBackground } from '@/components/CosmicBackground';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ScrollToTop } from '@/components/ScrollToTop';
import {
  ChevronRight, Type, Mic, Video, Image as ImageIcon, Satellite, Shield, Eye, Lock, Sparkles, Rocket, Plus, Calculator
} from 'lucide-react';

const payloadRates = [
  {
    id: 'text',
    name: 'Foundation: Text',
    icon: Type,
    description: 'Every memory starts with a message. Write your letters, journals, or poems here.',
    accentClass: 'text-primary',
    bgClass: 'bg-primary/10',
    pricing: {
      INR: { base: '₹200', baseDesc: 'first 100 words', extra: '+ ₹50', extraDesc: 'per next 100 words' },
      USD: { base: '$5', baseDesc: 'first 100 words', extra: '+ $1', extraDesc: 'per next 100 words' }
    }
  },
  {
    id: 'voice',
    name: 'Add-on: Voice Notes',
    icon: Mic,
    description: 'Attach audio recordings (MP3/WAV) to let them hear your voice across time.',
    accentClass: 'text-cosmic-purple',
    bgClass: 'bg-cosmic-purple/10',
    pricing: {
      INR: { base: '₹200', baseDesc: 'first minute', extra: '+ ₹100', extraDesc: 'per additional min' },
      USD: { base: '$5', baseDesc: 'first minute', extra: '+ $1.50', extraDesc: 'per additional min' }
    }
  },
  {
    id: 'video',
    name: 'Add-on: Video',
    icon: Video,
    description: 'Attach video messages (MP4) to bring your cosmic payload to life.',
    accentClass: 'text-cyan-400',
    bgClass: 'bg-cyan-400/10',
    pricing: {
      INR: { base: '₹300', baseDesc: 'first minute', extra: '+ ₹150', extraDesc: 'per additional min' },
      USD: { base: '$7', baseDesc: 'first minute', extra: '+ $2', extraDesc: 'per additional min' }
    }
  },
  {
    id: 'images',
    name: 'Add-on: Images',
    icon: ImageIcon,
    description: 'Include a gallery of photos or artworks to be engraved as celestial data.',
    accentClass: 'text-cosmic-blue',
    bgClass: 'bg-cosmic-blue/10',
    pricing: {
      INR: { base: '₹500', baseDesc: 'up to 5 images', extra: '+ ₹50', extraDesc: 'per additional image' },
      USD: { base: '$5', baseDesc: 'up to 5 images', extra: '+ $2', extraDesc: 'per additional image' }
    }
  }
];

const b2cFeatures = [
    { title: 'Permanent Celestial Binding', desc: 'Your entire payload is cryptographically tethered to a specific star\'s physical state.', icon: Sparkles },
    { title: 'Time-Locked Delivery', desc: 'Set your memory payload to organically unlock hours, days, or decades in the future.', icon: Lock },
    { title: 'Public or Private Vaults', desc: 'Secure your payload in a private vault, or share it on the public observatory.', icon: Eye },
];

const b2bFeatures = [
    'Zero-Trust Aerospace Verification',
    'Hardware Star-Tracker Integration',
    'No GPS/Ground-Contact Dependency',
    'Mission-Critical API Interfaces'
];

const Pricing = () => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState<'INR' | 'USD'>('USD');
  const [words, setWords] = useState<number>(100);
  const [voice, setVoice] = useState<number>(0);
  const [video, setVideo] = useState<number>(0);
  const [images, setImages] = useState<number>(0);

  const calculateTotal = () => {
    let total = 0;
    if (currency === 'INR') {
      if (words > 0) total += 200 + Math.max(0, Math.ceil((words - 100) / 100)) * 50;
      if (voice > 0) total += 200 + Math.max(0, voice - 1) * 100;
      if (video > 0) total += 300 + Math.max(0, video - 1) * 150;
      if (images > 0) total += 500 + Math.max(0, images - 5) * 50;
    } else {
      if (words > 0) total += 5 + Math.max(0, Math.ceil((words - 100) / 100)) * 1;
      if (voice > 0) total += 5 + Math.max(0, voice - 1) * 1.5;
      if (video > 0) total += 7 + Math.max(0, video - 1) * 2;
      if (images > 0) total += 5 + Math.max(0, images - 5) * 2;
    }
    return total;
  };

  const totalCost = calculateTotal();

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <CosmicBackground />
      <div className="relative z-10">
        <Navigation />

        <main className="pt-32 pb-20">

          {/* ── HERO ── */}
          <section className="px-4 pb-16 text-center relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cosmic-purple/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="relative max-w-3xl mx-auto space-y-6">
              <ScrollReveal>
                <p className="text-xs font-mono uppercase tracking-[0.4em] text-muted-foreground">Transparent Processing</p>
                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-tight mt-2">
                  Pricing for the <span className="text-gradient-gold italic text-glow">Cosmos</span>
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={150}>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
                  Build your memory payload. You only pay for the exact data and media you choose to preserve. Select a currency to view our data rates.
                </p>
              </ScrollReveal>
              
              {/* Toggle Switch */}
              <ScrollReveal delay={200}>
                <div className="mt-8 inline-flex items-center p-1.5 bg-slate-900/50 border border-border/30 rounded-full backdrop-blur-sm shadow-xl">
                    <button 
                        onClick={() => setCurrency('USD')}
                        className={`px-8 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${currency === 'USD' ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        USD ($)
                    </button>
                    <button 
                        onClick={() => setCurrency('INR')}
                        className={`px-8 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${currency === 'INR' ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        INR (₹)
                    </button>
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* ── B2C Pricing "For You" ── */}
          <section className="px-4 pb-24 relative z-20">
            <div className="max-w-4xl mx-auto space-y-12">
              
              <ScrollReveal>
                  <div className="text-center space-y-2 mb-8">
                      <h2 className="font-serif text-3xl md:text-4xl text-foreground">For You — Cosmic Memory Archive</h2>
                      <p className="text-muted-foreground max-w-lg mx-auto">
                        Your memory is a single cosmic artifact. Start with your text message, then enrich it by attaching any media. Your final price depends on the components inside your payload.
                      </p>
                  </div>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <div className="glass-strong rounded-3xl border border-border/40 overflow-hidden shadow-2xl">
                  {/* Table Header */}
                  <div className="hidden md:flex items-center px-8 py-4 bg-slate-950/50 border-b border-border/30 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    <div className="flex-[2]">Payload Component</div>
                    <div className="flex-1 text-right">Base Rate</div>
                    <div className="flex-1 text-right">Additional Rate</div>
                  </div>

                  {/* Pricing Rows */}
                  <div className="divide-y divide-border/20">
                    {payloadRates.map((item, idx) => {
                      const Icon = item.icon;
                      const priceData = item.pricing[currency];
                      const isFoundation = item.id === 'text';

                      return (
                        <div key={item.id} className={`flex flex-col md:flex-row md:items-center p-6 md:p-8 hover:bg-white/[0.02] transition-colors relative ${isFoundation ? 'bg-primary/[0.02]' : ''}`}>
                          
                          {/* Visual Connector for Add-ons */}
                          {!isFoundation && (
                            <div className="hidden md:flex absolute left-8 top-0 -mt-2 w-px h-6 bg-border/40" />
                          )}
                          {!isFoundation && (
                            <div className="hidden md:flex absolute left-6 top-4 w-4 h-4 text-border/40">
                                <Plus className="w-full h-full" />
                            </div>
                          )}

                          {/* Info Column */}
                          <div className={`flex-[2] flex items-start gap-4 ${!isFoundation ? 'md:pl-6' : ''}`}>
                            <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center ${item.bgClass}`}>
                              <Icon className={`w-6 h-6 ${item.accentClass}`} />
                            </div>
                            <div>
                              <h3 className={`font-serif text-xl ${isFoundation ? 'text-primary' : 'text-foreground'}`}>
                                {item.name}
                              </h3>
                              <p className="text-sm text-muted-foreground leading-relaxed pr-4 mt-1">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          {/* Base Rate Column */}
                          <div className="flex-1 md:text-right mt-6 md:mt-0 pt-6 md:pt-0 border-t border-border/10 md:border-0 flex md:flex-col items-baseline md:items-end justify-between md:justify-center">
                            <span className="md:hidden text-xs font-mono text-muted-foreground uppercase tracking-widest">Base Rate</span>
                            <div className="text-right">
                              <span className={`font-serif text-2xl font-medium ${item.accentClass}`}>{priceData.base}</span>
                              <p className="text-xs text-foreground/60 mt-0.5">{priceData.baseDesc}</p>
                            </div>
                          </div>

                          {/* Extra Rate Column */}
                          <div className="flex-1 md:text-right mt-4 md:mt-0 flex md:flex-col items-baseline md:items-end justify-between md:justify-center">
                            <span className="md:hidden text-xs font-mono text-muted-foreground uppercase tracking-widest">Additional</span>
                            <div className="text-right">
                              <span className="font-serif text-lg font-medium text-foreground">{priceData.extra}</span>
                              <p className="text-xs text-foreground/60 mt-0.5">{priceData.extraDesc}</p>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Checkout CTA */}
                  <div className="p-8 bg-slate-950/50 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-sm text-muted-foreground text-center sm:text-left">
                      Ready to build your cosmic memory payload?
                    </p>
                    <Button
                      variant="gold"
                      size="lg"
                      className="w-full sm:w-auto px-8 rounded-xl"
                      onClick={() => navigate('/for-you')}
                    >
                      Start Designing <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </ScrollReveal>

              {/* Interactive Estimator */}
              <ScrollReveal delay={200}>
                <div className="glass-strong rounded-3xl border border-primary/20 overflow-hidden shadow-2xl mt-8">
                  <div className="p-6 md:p-8 border-b border-border/20 bg-primary/[0.02]">
                    <h3 className="font-serif text-2xl text-foreground flex items-center gap-2">
                       <Calculator className="w-5 h-5 text-primary" /> Payload Cost Estimator
                    </h3>
                    <p className="text-muted-foreground mt-1 text-sm">Experiment with your expected payload size to estimate the final cost.</p>
                  </div>
                  
                  <div className="p-6 md:p-8 grid md:grid-cols-5 gap-8 items-stretch relative bg-black/20">
                    
                    {/* Inputs */}
                    <div className="md:col-span-3 space-y-6">
                       <div className="space-y-3">
                          <label className="text-sm font-medium text-foreground flex justify-between">
                            <span>Text (Words)</span>
                            <span className="text-primary">{words} words</span>
                          </label>
                          <input type="range" min="0" max="2000" step="50" value={words} onChange={(e) => setWords(parseInt(e.target.value))} className="w-full accent-primary" />
                       </div>
                       
                       <div className="space-y-3">
                          <label className="text-sm font-medium text-foreground flex justify-between">
                            <span className="text-cosmic-purple">Voice Notes (Minutes)</span>
                            <span className="text-cosmic-purple">{voice} mins</span>
                          </label>
                          <input type="range" min="0" max="30" step="1" value={voice} onChange={(e) => setVoice(parseInt(e.target.value))} className="w-full accent-cosmic-purple" />
                       </div>
                       
                       <div className="space-y-3">
                          <label className="text-sm font-medium text-foreground flex justify-between">
                            <span className="text-cyan-400">Video Messages (Minutes)</span>
                            <span className="text-cyan-400">{video} mins</span>
                          </label>
                          <input type="range" min="0" max="30" step="1" value={video} onChange={(e) => setVideo(parseInt(e.target.value))} className="w-full accent-cyan-400" />
                       </div>

                       <div className="space-y-3">
                          <label className="text-sm font-medium text-foreground flex justify-between">
                            <span className="text-cosmic-blue">Images (Quantity)</span>
                            <span className="text-cosmic-blue">{images} photos</span>
                          </label>
                          <input type="range" min="0" max="50" step="1" value={images} onChange={(e) => setImages(parseInt(e.target.value))} className="w-full accent-cosmic-blue" />
                       </div>
                    </div>
                    
                    {/* Result */}
                    <div className="md:col-span-2 flex flex-col items-center justify-center space-y-2 p-8 glass rounded-2xl border border-primary/20 relative overflow-hidden min-h-[200px]">
                       <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                       <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground z-10 mb-2">Estimated Total</p>
                       <span className="font-serif text-5xl md:text-6xl text-primary font-medium text-glow z-10 break-all text-center">
                          {currency === 'INR' ? '₹' : '$'}{totalCost.toLocaleString(undefined, { minimumFractionDigits: currency==='USD'?2:0, maximumFractionDigits: currency==='USD'?2:0 })}
                       </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
              
              {/* Global Features Banner */}
              <ScrollReveal delay={300}>
                  <div className="glass rounded-2xl border border-border/30 p-8 md:p-12 mt-12 overflow-hidden relative">
                      <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
                      
                      <div className="grid md:grid-cols-3 gap-8 relative z-10">
                          {b2cFeatures.map((feat, i) => (
                              <div key={i} className="space-y-3 text-center md:text-left">
                                  <div className="w-10 h-10 mx-auto md:mx-0 rounded-full bg-primary/10 flex items-center justify-center">
                                      <feat.icon className="w-5 h-5 text-primary" />
                                  </div>
                                  <h4 className="font-medium text-foreground">{feat.title}</h4>
                                  <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
                              </div>
                          ))}
                      </div>
                  </div>
              </ScrollReveal>
            </div>
          </section>

          {/* ── B2B Pricing "For Missions" ── */}
          <section className="px-4 py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-slate-950/80 border-t border-border/30" />
            <div className="relative z-10 max-w-5xl mx-auto">
                <ScrollReveal>
                  <div className="text-center space-y-4 mb-16">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cosmic-purple/20 border border-cosmic-purple/30 mb-2">
                        <Satellite className="w-8 h-8 text-cosmic-purple" />
                      </div>
                      <p className="text-xs font-mono uppercase tracking-[0.4em] text-cosmic-purple">Enterprise & Aerospace</p>
                      <h2 className="font-serif text-4xl md:text-5xl text-foreground">For Orbital Missions</h2>
                      <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                          A physics-based verification layer for satellite commands. Designed to provide additive security for <strong className="text-foreground font-medium">CubeSats</strong> and <strong className="text-foreground font-medium">Commercial Satellites</strong>.
                      </p>
                  </div>
                </ScrollReveal>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    
                    <ScrollReveal delay={150}>
                        <div className="space-y-6">
                            <h3 className="font-serif text-2xl text-foreground">Custom Solutions Required</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Mission-critical authorization cannot rely on standard SaaS pricing tiers. Our environmental key derivation stack requires deep integration with your target vehicle's star tracker telemetry and operational software.
                            </p>
                            
                            <ul className="space-y-4 pt-2 pb-6">
                                {b2bFeatures.map((f, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <Shield className="w-5 h-5 mt-0.5 text-cosmic-purple flex-shrink-0" />
                                        <span className="text-foreground/90 font-medium">{f}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Button
                                  variant="outline"
                                  size="lg"
                                  className="w-full sm:w-auto border-cosmic-purple/40 text-cosmic-purple hover:bg-cosmic-purple/10 rounded-xl"
                                  onClick={() => navigate('/contact')}
                                >
                                  Contact Mission Team
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="lg"
                                  className="w-full sm:w-auto text-muted-foreground hover:text-foreground"
                                  onClick={() => navigate('/techdocs')}
                                >
                                  Read Tech Docs <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={300}>
                        <div className="relative rounded-2xl overflow-hidden glass border border-cosmic-purple/20 p-8 shadow-2xl shadow-cosmic-purple/10 aspect-square flex items-center justify-center group">
                            <div className="absolute inset-0 bg-gradient-to-br from-cosmic-purple/5 to-transparent z-0" />
                            
                            <div className="relative z-10 space-y-6 text-center">
                                <div className="w-24 h-24 mx-auto border border-dashed border-cosmic-purple/30 rounded-full flex items-center justify-center animate-[spin_60s_linear_infinite]">
                                    <div className="w-16 h-16 border border-cosmic-purple/50 rounded-full flex items-center justify-center">
                                        <Rocket className="w-6 h-6 text-cosmic-purple/70 animate-pulse" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="font-mono text-xs uppercase tracking-widest text-cosmic-purple/70">Secure Handshake</p>
                                    <p className="text-lg font-serif text-white group-hover:text-glow transition-all">Request Deployment Architecture</p>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
          </section>

        </main>

        <Footer />
        <ScrollToTop />
      </div>
    </div>
  );
};

export default Pricing;
