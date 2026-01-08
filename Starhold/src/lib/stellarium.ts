export interface StellariumConfig {
  host: string;
  port: number;
}

export interface StellariumStatus {
  selectioninfo: string;
  time: {
    jday: number;
    deltaT: number;
    gmtShift: number;
    timeRate: number;
    timetype: string;
    utc: string;
    local: string;
    isTimeNow: boolean;
    dateFormat: string;
    timeFormat: string;
  };
  location: {
    name: string;
    role: string;
    landscapeKey: string;
    latitude: number;
    longitude: number;
    altitude: number;
    planet: string;
    lightPollution: number;
    temperature: number;
    pressure: number;
    srtmAllowed: boolean;
  };
  view: {
    fov: number;
  };
}

export interface CelestialObject {
  name: string;
  localized_name?: string;
  type?: string;
  above_horizon?: boolean;
  altitude?: number;
  azimuth?: number;
  ra?: string;
  dec?: string;
  magnitude?: number;
  distance?: string;
  constellation?: string;
}

export interface ObjectInfo {
  [key: string]: string | number | boolean | undefined;
}

const DEFAULT_CONFIG: StellariumConfig = {
  host: 'localhost',
  port: 8090,
};

class StellariumAPI {
  private config: StellariumConfig = DEFAULT_CONFIG;

  setConfig(config: Partial<StellariumConfig>) {
    this.config = { ...this.config, ...config };
  }

  getConfig(): StellariumConfig {
    return this.config;
  }

  private getBaseUrl(): string {
    return `http://${this.config.host}:${this.config.port}`;
  }

  async getStatus(): Promise<StellariumStatus> {
    const response = await fetch(`${this.getBaseUrl()}/api/main/status`);
    if (!response.ok) throw new Error('Failed to fetch status');
    return response.json();
  }

  async searchObjects(query: string): Promise<string[]> {
    const response = await fetch(
      `${this.getBaseUrl()}/api/objects/find?str=${encodeURIComponent(query)}`
    );
    if (!response.ok) throw new Error('Failed to search objects');
    return response.json();
  }

  async getObjectInfo(name: string): Promise<ObjectInfo> {
    const response = await fetch(
      `${this.getBaseUrl()}/api/objects/info?name=${encodeURIComponent(name)}&format=json`
    );
    if (!response.ok) throw new Error('Failed to get object info');
    return response.json();
  }

  async listObjectTypes(): Promise<string[]> {
    const response = await fetch(`${this.getBaseUrl()}/api/objects/listobjecttypes`);
    if (!response.ok) throw new Error('Failed to list object types');
    return response.json();
  }

  async listObjectsByType(type: string): Promise<string[]> {
    const response = await fetch(
      `${this.getBaseUrl()}/api/objects/listobjectsbytype?type=${encodeURIComponent(type)}`
    );
    if (!response.ok) throw new Error('Failed to list objects by type');
    return response.json();
  }

  async focusObject(name: string): Promise<void> {
    const response = await fetch(`${this.getBaseUrl()}/api/main/focus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `target=${encodeURIComponent(name)}`,
    });
    if (!response.ok) throw new Error('Failed to focus object');
  }

  async setFieldOfView(fov: number): Promise<void> {
    const response = await fetch(`${this.getBaseUrl()}/api/main/fov`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `fov=${fov}`,
    });
    if (!response.ok) throw new Error('Failed to set FOV');
  }

  async simbadLookup(name: string): Promise<CelestialObject[]> {
    const response = await fetch(
      `${this.getBaseUrl()}/api/simbad/lookup?str=${encodeURIComponent(name)}`
    );
    if (!response.ok) throw new Error('Failed to lookup in SIMBAD');
    return response.json();
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.getStatus();
      return true;
    } catch {
      return false;
    }
  }
}

export const stellariumAPI = new StellariumAPI();
