import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Compass, Menu, X, Shield, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const V2Navigation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = React.useState(false);
    const [isVisible, setIsVisible] = React.useState(true);
    const [lastScrollY, setLastScrollY] = React.useState(0);

    React.useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const links = [
        { name: 'Observatory', path: '/v2/observatory', icon: Compass },
        { name: 'Missions', path: '/v2/for-missions', icon: Shield },
        { name: 'Archive', path: '/v2/for-you', icon: Cpu },
        { name: 'Academy', path: '/v2/academy' },
        { name: 'Tech Docs', path: '/v2/techdocs' },
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-transparent backdrop-blur-md transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'} animate-in fade-in slide-in-from-top-4`}>
            <div className="w-full px-6 lg:px-8 h-20 flex items-center justify-between">
                <div className="flex items-center gap-10 lg:gap-16">
                    <Link to="/v2" className="flex items-center gap-1 group">
                        <img src="v2/logo_v2.svg" alt="" className="w-12 h-auto group-hover:scale-110 transition-transform" />
                        <img src="v2/starhold_text_logo.png" alt="Starhold" className="h-6 w-auto object-contain -ml-2" />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {links.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`font-aerospace text-xs font-bold uppercase tracking-widest transition-colors hover:text-cyan-400 flex items-center gap-2 ${location.pathname === link.path ? 'text-cyan-400' : 'text-zinc-500'
                                    }`}
                            >
                                {link.icon && <link.icon className="w-3 h-3" />}
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* System Access */}
                <div className="flex items-center gap-6">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/v2/dashboard')}
                        className="hidden sm:flex border-cyan-500/20 text-cyan-400 font-aerospace font-bold uppercase tracking-widest text-[10px] hover:bg-cyan-500/10 h-9 px-5 rounded-none"
                    >
                        System Access
                    </Button>
                    <button className="lg:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="lg:hidden absolute top-20 left-0 w-full bg-[#040814] border-b border-white/5 p-8 animate-in slide-in-from-top-4">
                    <div className="flex flex-col gap-6">
                        {links.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className="font-aerospace text-lg font-bold uppercase tracking-widest text-zinc-400 hover:text-cyan-400"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};
