import React from 'react';
import { useLocation } from 'react-router-dom';
import { V2Navigation } from '../components/V2Navigation';
import { V2Footer } from '../components/V2Footer';
import '../styles/V2DesignSystem.css';

interface V2LayoutProps {
    children: React.ReactNode;
}

export const V2Layout: React.FC<V2LayoutProps> = ({ children }) => {
    const location = useLocation();
    const isObservatory = location.pathname === '/v2/observatory';

    React.useEffect(() => {
        // Swap favicon for V2 pages
        const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        const originalHref = link?.href;
        if (link) {
            link.href = '/v2/logo_v2_perfect.svg';
        }

        // Restore original on unmount
        return () => {
            if (link && originalHref) {
                link.href = originalHref;
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#040814] text-white font-technical selection:bg-cyan-500/30 scanline-effect overflow-x-hidden flex flex-col">
            {/* HUD Noise Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[99]" style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />

            {!isObservatory && <V2Navigation />}

            <main className="relative z-10 flex-1">
                {children}
            </main>

            {!isObservatory && <V2Footer />}

            {/* V1 Exit Link (Small Floating Toggle) */}
            <div className="fixed bottom-8 left-8 z-[100] flex items-center gap-3 group">
                <a
                    href="#/"
                    className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all hover:border-white/20"
                    title="Return to Version 1"
                >
                    <span className="font-aerospace text-[10px] font-bold text-zinc-500 group-hover:text-white transition-colors">V1</span>
                </a>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    <p className="text-[10px] font-aerospace uppercase tracking-widest text-zinc-500">Return to Legacy Site</p>
                </div>
            </div>
        </div>
    );
};
