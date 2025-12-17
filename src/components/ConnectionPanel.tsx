import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wifi, WifiOff, Loader2, Settings } from 'lucide-react';
import { StellariumConfig } from '@/lib/stellarium';

interface ConnectionPanelProps {
  isConnected: boolean;
  isConnecting: boolean;
  config: StellariumConfig;
  error: string | null;
  onConnect: (config?: Partial<StellariumConfig>) => void;
  onDisconnect: () => void;
}

export const ConnectionPanel = ({
  isConnected,
  isConnecting,
  config,
  error,
  onConnect,
  onDisconnect,
}: ConnectionPanelProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [host, setHost] = useState(config.host);
  const [port, setPort] = useState(config.port.toString());

  const handleConnect = () => {
    onConnect({
      host,
      port: parseInt(port, 10) || 8090,
    });
  };

  return (
    <div className="glass rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isConnected ? 'bg-cosmic-cyan/20' : 'bg-muted'}`}>
            {isConnected ? (
              <Wifi className="w-5 h-5 text-cosmic-cyan" />
            ) : (
              <WifiOff className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">
              Stellarium Connection
            </h3>
            <p className="text-sm text-muted-foreground">
              {isConnected ? `Connected to ${config.host}:${config.port}` : 'Not connected'}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {showSettings && (
        <div className="space-y-3 pt-2 border-t border-border">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="host" className="text-xs text-muted-foreground">Host</Label>
              <Input
                id="host"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="localhost"
                className="bg-background/50"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="port" className="text-xs text-muted-foreground">Port</Label>
              <Input
                id="port"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder="8090"
                className="bg-background/50"
              />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="flex gap-2">
        {isConnected ? (
          <Button variant="outline" onClick={onDisconnect} className="flex-1">
            Disconnect
          </Button>
        ) : (
          <Button
            variant="cosmic"
            onClick={handleConnect}
            disabled={isConnecting}
            className="flex-1"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting...
              </>
            ) : (
              'Connect'
            )}
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Requires Stellarium running with Remote Control plugin on port {port}
      </p>
    </div>
  );
};
