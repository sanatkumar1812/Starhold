export const SKYVIEW_BASE_URL = 'https://skyview.gsfc.nasa.gov/current/cgi/runquery.pl';

export interface SkyViewOptions {
    survey?: string;
    pixels?: number;
    scaling?: string;
}

export const getSkyViewUrl = (ra: number, dec: number, options: SkyViewOptions = {}): string => {
    const {
        survey = 'DSS2 Red', // Digitized Sky Survey 2 - good visual coverage
        pixels = 600,
        scaling = 'Linear'
    } = options;

    // SkyView parameters
    const params = new URLSearchParams({
        Position: `${ra},${dec}`,
        Survey: survey,
        Return: 'JPG',
        Pixels: pixels.toString(),
        Scaling: scaling,
        Size: '0.2', // Field of view in degrees (approx moon size)
        Interpolation: 'Bilinear'
    });

    return `${SKYVIEW_BASE_URL}?${params.toString()}`;
};
