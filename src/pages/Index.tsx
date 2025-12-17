import { Starfield } from '@/components/Starfield';
import { ConnectionPanel } from '@/components/ConnectionPanel';
import { StatusDisplay } from '@/components/StatusDisplay';
import { ObjectSearch } from '@/components/ObjectSearch';
import { QuickObjects } from '@/components/QuickObjects';
import { useStellariumConnection } from '@/hooks/useStellariumConnection';
import { Telescope, Github, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const {
    isConnected,
    isConnecting,
    status,
    error,
    config,
    connect,
    disconnect,
  } = useStellariumConnection();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Starfield />
      
      {/* Header */}
      <header className="relative z-10 border-b border-border/50 glass">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl gradient-cosmic">
              <Telescope className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-gradient-cosmic">
                Stellar Control
              </h1>
              <p className="text-xs text-muted-foreground">
                Stellarium Remote Interface
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <a
                href="https://stellarium.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <ExternalLink className="w-4 h-4" />
                Stellarium
              </a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a
                href="https://github.com/Stellarium/stellarium"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Explore the <span className="text-gradient-cosmic glow-text">Cosmos</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Control your Stellarium planetarium software remotely. Search for celestial objects,
            navigate the night sky, and explore the universe from your browser.
          </p>
        </div>

        {/* Panels Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Connection Panel */}
          <div className="lg:col-span-1">
            <ConnectionPanel
              isConnected={isConnected}
              isConnecting={isConnecting}
              config={config}
              error={error}
              onConnect={connect}
              onDisconnect={disconnect}
            />
          </div>

          {/* Status Display */}
          <div className="lg:col-span-1">
            <StatusDisplay status={status} />
          </div>

          {/* Quick Objects */}
          <div className="lg:col-span-1">
            <QuickObjects isConnected={isConnected} />
          </div>

          {/* Object Search - Full Width */}
          <div className="md:col-span-2 lg:col-span-3">
            <ObjectSearch isConnected={isConnected} />
          </div>
        </div>

        {/* Setup Instructions */}
        {!isConnected && (
          <div className="mt-12 max-w-2xl mx-auto glass rounded-xl p-6 space-y-4">
            <h3 className="font-display font-semibold text-foreground text-center">
              Getting Started
            </h3>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cosmic-purple/20 text-cosmic-purple text-xs flex items-center justify-center font-bold">1</span>
                <span>Download and install <a href="https://stellarium.org/" target="_blank" rel="noopener noreferrer" className="text-cosmic-cyan hover:underline">Stellarium</a> if you haven't already</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cosmic-purple/20 text-cosmic-purple text-xs flex items-center justify-center font-bold">2</span>
                <span>Open Stellarium and go to <strong>Configuration → Plugins → Remote Control</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cosmic-purple/20 text-cosmic-purple text-xs flex items-center justify-center font-bold">3</span>
                <span>Enable the plugin and check <strong>"Load at startup"</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cosmic-purple/20 text-cosmic-purple text-xs flex items-center justify-center font-bold">4</span>
                <span>Configure the server (default: localhost:8090) and enable <strong>"Enable automatically on startup"</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cosmic-purple/20 text-cosmic-purple text-xs flex items-center justify-center font-bold">5</span>
                <span>Restart Stellarium and click <strong>Connect</strong> above</span>
              </li>
            </ol>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            Built for{' '}
            <a
              href="https://stellarium.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cosmic-cyan hover:underline"
            >
              Stellarium
            </a>
            {' '}open-source planetarium
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
