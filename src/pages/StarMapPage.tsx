import { useNavigate } from 'react-router-dom';
import { InteractiveMap } from '@/components/InteractiveMap';
import { useMemories, Memory } from '@/hooks/useMemories';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { MemoryDetailModal } from '@/components/MemoryDetailModal';

export default function StarMapPage() {
    const { memories, generateShareToken } = useMemories();
    const navigate = useNavigate();
    const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const handleMemoryClick = (memory: Memory) => {
        setSelectedMemory(memory);
        setIsDetailOpen(true);
    };

    const handleGenerateShareLink = async (id: string) => {
        return await generateShareToken(id);
    };

    return (
        <div className="w-full h-screen bg-black relative">
            {/* Main Map */}
            <InteractiveMap
                memories={memories}
                onMemoryClick={handleMemoryClick}
                className="w-full h-full"
            />

            {/* Top Overlay */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/dashboard')}
                    className="pointer-events-auto text-white/50 hover:text-white hover:bg-white/10 gap-2"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Return to Dashboard
                </Button>
            </div>

            {/* Modals */}
            <MemoryDetailModal
                memory={selectedMemory}
                isOpen={isDetailOpen}
                onClose={() => {
                    setIsDetailOpen(false);
                    setSelectedMemory(null);
                }}
                onGenerateShareLink={handleGenerateShareLink}
                showAnimation={true}
            />
        </div>
    );
}
