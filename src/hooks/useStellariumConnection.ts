import { useState, useCallback, useEffect } from 'react';
import { stellariumAPI, StellariumConfig, StellariumStatus } from '@/lib/stellarium';

export const useStellariumConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState<StellariumStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<StellariumConfig>(stellariumAPI.getConfig());

  const connect = useCallback(async (newConfig?: Partial<StellariumConfig>) => {
    setIsConnecting(true);
    setError(null);

    if (newConfig) {
      stellariumAPI.setConfig(newConfig);
      setConfig(stellariumAPI.getConfig());
    }

    try {
      const connected = await stellariumAPI.testConnection();
      setIsConnected(connected);
      
      if (connected) {
        const statusData = await stellariumAPI.getStatus();
        setStatus(statusData);
      } else {
        setError('Could not connect to Stellarium. Make sure it\'s running with Remote Control enabled.');
      }
    } catch (err) {
      setIsConnected(false);
      setError(err instanceof Error ? err.message : 'Connection failed');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    setStatus(null);
  }, []);

  const refreshStatus = useCallback(async () => {
    if (!isConnected) return;
    
    try {
      const statusData = await stellariumAPI.getStatus();
      setStatus(statusData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh status');
    }
  }, [isConnected]);

  // Auto-refresh status every 5 seconds when connected
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(refreshStatus, 5000);
    return () => clearInterval(interval);
  }, [isConnected, refreshStatus]);

  return {
    isConnected,
    isConnecting,
    status,
    error,
    config,
    connect,
    disconnect,
    refreshStatus,
  };
};
