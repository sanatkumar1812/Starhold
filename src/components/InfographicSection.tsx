import { useEffect, useRef, useState } from 'react';
import { ScrollReveal } from './ScrollReveal';
import { CheckCircle2, XCircle, Cpu, Lock, Radio, Satellite, Star, Shield } from 'lucide-react';



type CompRow = {
  aspect: string;
  legacyOk: boolean;
  starholdOk: boolean;
  legacyLabel?: string;
  starholdLabel?: string;
};

const comparison: CompRow[] = [
  { aspect: 'GPS-Independent',          legacyOk: false, starholdOk: true  },
  { aspect: 'No Ground Contact Needed', legacyOk: false, starholdOk: true  },
  { aspect: 'Spoof-Resistant',          legacyOk: false, starholdOk: true  },
  { aspect: 'Zero New Hardware',        legacyOk: true, legacyLabel: 'Already Deployed', starholdOk: true, starholdLabel: 'No Hardware Needed' },
  { aspect: 'Deep-Space Capable',       legacyOk: true, legacyLabel: 'Limited', starholdOk: true, starholdLabel: 'Native' },
  { aspect: 'EW-Resilient',             legacyOk: false, starholdOk: true  },
  { aspect: 'Physics-Based Auth',       legacyOk: false, starholdOk: true  },
];

export const InfographicSection = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(59,130,246,0.05),transparent_65%)] pointer-events-none" />
      <div className="max-w-7xl mx-auto space-y-28 relative z-10">
        {/* ── C: COMPARISON TABLE ── */}
        <ScrollReveal delay={200}>
          <div className="space-y-10">
            <div className="text-center space-y-2">
              <p className="text-xs font-mono uppercase tracking-[0.4em] text-cosmic-blue">Zero-Trust vs Legacy</p>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground">
                Legacy <span className="text-red-400">vs</span> Starhold
              </h2>
            </div>

            <div className="glass rounded-[2.5rem] border-white/5 overflow-hidden">
              {/* Header row */}
              <div className="grid grid-cols-3 border-b border-white/10 bg-white/[0.02]">
                <div className="p-5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground border-r border-white/10 flex items-center">
                  Capability
                </div>
                <div className="p-5 flex items-center justify-center gap-2 border-r border-white/10">
                  <div className="flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span className="text-sm font-bold text-red-400 font-serif">Legacy Systems</span>
                  </div>
                </div>
                <div className="p-5 flex items-center justify-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-bold text-emerald-400 font-serif">Starhold</span>
                  </div>
                </div>
              </div>

              {/* Data rows */}
              {comparison.map((row, i) => (
                <div
                  key={row.aspect}
                  className={`grid grid-cols-3 border-b border-white/5 hover:bg-white/[0.025] transition-colors duration-200 ${i % 2 === 1 ? 'bg-white/[0.01]' : ''}`}
                >
                  <div className="p-4 md:p-5 text-sm text-foreground/70 border-r border-white/10 flex items-center font-medium">
                    {row.aspect}
                  </div>
                  <div className="p-4 md:p-5 border-r border-white/10 flex items-center justify-center">
                    {row.legacyLabel
                      ? <span className="text-xs text-red-300/60 font-mono text-center">{row.legacyLabel}</span>
                      : row.legacyOk
                        ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        : <XCircle className="w-5 h-5 text-red-400/80" />
                    }
                  </div>
                  <div className="p-4 md:p-5 flex items-center justify-center">
                    {row.starholdLabel
                      ? <span className="text-xs text-emerald-300/70 font-mono text-center">{row.starholdLabel}</span>
                      : row.starholdOk
                        ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        : <XCircle className="w-5 h-5 text-red-400/80" />
                    }
                  </div>
                </div>
              ))}

              {/* Gradient footer strip */}
              <div className="h-1 bg-gradient-to-r from-red-500/40 via-white/5 to-emerald-500/40" />
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
