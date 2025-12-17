import { useState, useCallback } from 'react';
import { Search, Star, Loader2, Crosshair } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { stellariumAPI, ObjectInfo } from '@/lib/stellarium';
import { toast } from 'sonner';

interface ObjectSearchProps {
  isConnected: boolean;
}

export const ObjectSearch = ({ isConnected }: ObjectSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [selectedObject, setSelectedObject] = useState<ObjectInfo | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim() || !isConnected) return;

    setIsSearching(true);
    setSelectedObject(null);

    try {
      const searchResults = await stellariumAPI.searchObjects(query);
      setResults(searchResults.slice(0, 20)); // Limit to 20 results
      
      if (searchResults.length === 0) {
        toast.info('No objects found');
      }
    } catch (err) {
      toast.error('Search failed. Check Stellarium connection.');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [query, isConnected]);

  const handleSelectObject = async (name: string) => {
    setIsLoadingInfo(true);
    try {
      const info = await stellariumAPI.getObjectInfo(name);
      setSelectedObject(info);
    } catch (err) {
      toast.error('Failed to get object info');
    } finally {
      setIsLoadingInfo(false);
    }
  };

  const handleFocusObject = async (name: string) => {
    try {
      await stellariumAPI.focusObject(name);
      toast.success(`Focused on ${name}`);
    } catch (err) {
      toast.error('Failed to focus object');
    }
  };

  const formatValue = (key: string, value: unknown): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') {
      if (key.includes('magnitude')) return value.toFixed(2);
      if (key.includes('distance')) return value.toExponential(2);
      return value.toFixed(4);
    }
    return String(value);
  };

  const importantKeys = ['name', 'localized-name', 'type', 'above-horizon', 'altitude', 'azimuth', 'ra', 'dec', 'magnitude', 'distance', 'constellation'];

  return (
    <div className="glass rounded-xl p-6 space-y-4">
      <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
        <Star className="w-5 h-5 text-cosmic-gold" />
        Search Celestial Objects
      </h3>

      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search stars, planets, nebulae..."
          disabled={!isConnected}
          className="bg-background/50"
        />
        <Button
          variant="cosmic"
          onClick={handleSearch}
          disabled={!isConnected || isSearching || !query.trim()}
        >
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </Button>
      </div>

      {!isConnected && (
        <p className="text-sm text-muted-foreground text-center">
          Connect to Stellarium to search objects
        </p>
      )}

      {results.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {results.map((name) => (
            <button
              key={name}
              onClick={() => handleSelectObject(name)}
              className="w-full text-left p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors flex items-center justify-between group"
            >
              <span className="text-sm text-foreground">{name}</span>
              <Crosshair 
                className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-cosmic-cyan"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFocusObject(name);
                }}
              />
            </button>
          ))}
        </div>
      )}

      {isLoadingInfo && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-cosmic-purple" />
        </div>
      )}

      {selectedObject && !isLoadingInfo && (
        <div className="mt-4 p-4 rounded-lg bg-secondary/30 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-semibold text-cosmic-cyan">
              {String(selectedObject['localized-name'] || selectedObject.name || 'Unknown')}
            </h4>
            <Button
              variant="glass"
              size="sm"
              onClick={() => handleFocusObject(String(selectedObject.name))}
            >
              <Crosshair className="w-4 h-4 mr-1" />
              Focus
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(selectedObject)
              .filter(([key]) => importantKeys.includes(key))
              .map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/-/g, ' ')}
                  </span>
                  <span className="text-foreground font-medium">
                    {formatValue(key, value)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
