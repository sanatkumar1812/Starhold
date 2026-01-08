import { useState, useEffect } from 'react';
import { Sparkles, Loader2, Crosshair } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { stellariumAPI } from '@/lib/stellarium';
import { toast } from 'sonner';

interface QuickObjectsProps {
  isConnected: boolean;
}

const POPULAR_OBJECTS = [
  { name: 'Sun', emoji: '☀️' },
  { name: 'Moon', emoji: '🌙' },
  { name: 'Mars', emoji: '🔴' },
  { name: 'Jupiter', emoji: '🟤' },
  { name: 'Saturn', emoji: '🪐' },
  { name: 'Venus', emoji: '💫' },
  { name: 'Polaris', emoji: '⭐' },
  { name: 'Sirius', emoji: '✨' },
  { name: 'Orion Nebula', emoji: '🌌' },
  { name: 'Andromeda Galaxy', emoji: '🌀' },
];

export const QuickObjects = ({ isConnected }: QuickObjectsProps) => {
  const [objectTypes, setObjectTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [focusingObject, setFocusingObject] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected) {
      loadObjectTypes();
    }
  }, [isConnected]);

  const loadObjectTypes = async () => {
    setIsLoading(true);
    try {
      const types = await stellariumAPI.listObjectTypes();
      setObjectTypes(types.slice(0, 10));
    } catch (err) {
      console.error('Failed to load object types');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFocusObject = async (name: string) => {
    setFocusingObject(name);
    try {
      await stellariumAPI.focusObject(name);
      toast.success(`Focused on ${name}`);
    } catch (err) {
      toast.error(`Failed to focus on ${name}`);
    } finally {
      setFocusingObject(null);
    }
  };

  return (
    <div className="glass rounded-xl p-6 space-y-4">
      <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-cosmic-gold" />
        Quick Navigation
      </h3>

      {!isConnected ? (
        <p className="text-sm text-muted-foreground text-center">
          Connect to Stellarium to use quick navigation
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2">
            {POPULAR_OBJECTS.map((obj) => (
              <Button
                key={obj.name}
                variant="glass"
                size="sm"
                onClick={() => handleFocusObject(obj.name)}
                disabled={focusingObject === obj.name}
                className="justify-start"
              >
                {focusingObject === obj.name ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <span className="mr-2">{obj.emoji}</span>
                )}
                {obj.name}
              </Button>
            ))}
          </div>

          {objectTypes.length > 0 && (
            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Available Object Types
              </h4>
              <div className="flex flex-wrap gap-2">
                {objectTypes.map((type) => (
                  <span
                    key={type}
                    className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
