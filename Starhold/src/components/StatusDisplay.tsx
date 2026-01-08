import { Clock, MapPin, Telescope, Globe } from 'lucide-react';
import { StellariumStatus } from '@/lib/stellarium';

interface StatusDisplayProps {
  status: StellariumStatus | null;
}

export const StatusDisplay = ({ status }: StatusDisplayProps) => {
  if (!status) {
    return (
      <div className="glass rounded-xl p-6">
        <p className="text-muted-foreground text-center">
          Connect to Stellarium to view status
        </p>
      </div>
    );
  }

  const infoItems = [
    {
      icon: Clock,
      label: 'Time',
      value: status.time?.local || 'Unknown',
      color: 'text-cosmic-cyan',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: status.location?.name || 'Unknown',
      color: 'text-cosmic-pink',
    },
    {
      icon: Globe,
      label: 'Planet',
      value: status.location?.planet || 'Earth',
      color: 'text-cosmic-blue',
    },
    {
      icon: Telescope,
      label: 'Field of View',
      value: status.view?.fov ? `${status.view.fov.toFixed(2)}°` : 'Unknown',
      color: 'text-cosmic-purple',
    },
  ];

  return (
    <div className="glass rounded-xl p-6 space-y-4">
      <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cosmic-cyan animate-pulse" />
        Current Sky Status
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {infoItems.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center gap-2">
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
            <p className="text-sm font-medium text-foreground truncate">{item.value}</p>
          </div>
        ))}
      </div>

      {status.location && (
        <div className="pt-3 border-t border-border space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Latitude</span>
            <span className="text-foreground">{status.location.latitude.toFixed(4)}°</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Longitude</span>
            <span className="text-foreground">{status.location.longitude.toFixed(4)}°</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Altitude</span>
            <span className="text-foreground">{status.location.altitude}m</span>
          </div>
        </div>
      )}
    </div>
  );
};
