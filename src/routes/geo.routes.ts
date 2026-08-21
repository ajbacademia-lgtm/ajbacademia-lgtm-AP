import { Router, Request, Response } from 'express';

const router = Router();

const COUNTRY_MAP: Record<string, string> = {
  US: 'United States',
  GB: 'United Kingdom',
  CA: 'Canada',
  AU: 'Australia',
  DE: 'Germany',
  FR: 'France',
  JP: 'Japan',
  IN: 'India',
  NL: 'Netherlands',
  SG: 'Singapore',
  CH: 'Switzerland',
  SE: 'Sweden',
  ES: 'Spain',
  IT: 'Italy',
  BR: 'Brazil',
  ZA: 'South Africa',
  NZ: 'New Zealand',
};

/**
 * GET /api/geo/region
 * Returns country information based on request headers or default regional settings
 */
router.get('/region', (req: Request, res: Response) => {
  try {
    const cfCountry = req.headers['cf-ipcountry'] as string;
    const gcpCountry = req.headers['x-appengine-country'] as string;
    const headerCountry = req.headers['x-country-code'] as string;

    const rawCode = (cfCountry || gcpCountry || headerCountry || 'US').toUpperCase();
    const countryName = COUNTRY_MAP[rawCode] || (rawCode !== 'XX' && rawCode !== 'T1' ? rawCode : 'Global');

    return res.json({
      success: true,
      country_code: rawCode,
      country_name: countryName,
      city: 'Global',
      region: 'Global',
    });
  } catch (error) {
    return res.json({
      success: true,
      country_code: 'US',
      country_name: 'United States',
      city: 'Global',
      region: 'Global',
    });
  }
});

export default router;
