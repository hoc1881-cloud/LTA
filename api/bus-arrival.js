/**
 * @file /api/bus-arrival.js
 * Proxy endpoint for Singapore LTA DataMall v3 BusArrival API.
 * GET https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=04121
 * Header: AccountKey: process.env.LTA_ACCOUNT_KEY
 */

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, AccountKey');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed. Use GET.' });
  }

  // Extract query parameters (case-insensitive fallback)
  const busStopCode = req.query.BusStopCode || req.query.busStopCode || req.query.busstopcode;
  const serviceNo = req.query.ServiceNo || req.query.serviceNo || req.query.serviceno;

  if (!busStopCode) {
    return res.status(400).json({
      error: 'BusStopCode is required.',
      usage: '/api/bus-arrival?BusStopCode=04121[&ServiceNo=7]',
    });
  }

  // Check AccountKey from environment variable, header, or query parameter
  const accountKey = 
    process.env.LTA_ACCOUNT_KEY || 
    process.env.ACCOUNT_KEY ||
    req.headers['accountkey'] || 
    req.headers['x-account-key'] ||
    req.query.AccountKey;

  // Build target LTA DataMall URL
  let targetUrl = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${encodeURIComponent(busStopCode)}`;
  if (serviceNo) {
    targetUrl += `&ServiceNo=${encodeURIComponent(serviceNo)}`;
  }

  // If AccountKey is available, attempt real fetch to LTA DataMall
  if (accountKey) {
    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          AccountKey: accountKey,
          accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`LTA DataMall responded with ${response.status}: ${errorText}`);
        return res.status(response.status).json({
          error: `LTA DataMall API error: HTTP ${response.status}`,
          details: errorText,
          targetUrl,
        });
      }

      const data = await response.json();
      
      // Cache response for up to 20 seconds (as LTA refreshes every 20s)
      res.setHeader('Cache-Control', 'public, max-age=15, s-maxage=20');
      return res.status(200).json(data);
    } catch (err) {
      console.error('Fetch error connecting to LTA DataMall:', err);
      return res.status(502).json({
        error: 'Failed to connect to LTA DataMall service.',
        message: err.message,
      });
    }
  }

  // Fallback when LTA_ACCOUNT_KEY is not yet added in environment variables
  const now = new Date();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();

  const sampleServices = serviceNo ? [serviceNo] : ['10', '57', '70', '100', '107', '130', '131', '167', '196'];

  const simulatedServices = sampleServices.map((svc, i) => {
    let hash = 0;
    for (let j = 0; j < (busStopCode + svc).length; j++) {
      hash = ((hash << 5) - hash + (busStopCode + svc).charCodeAt(j)) | 0;
    }
    hash = Math.abs(hash);

    const intervalMin = 7 + (hash % 6);
    const progressSeconds = ((currentMinute * 60 + currentSecond + (hash * 37)) % (intervalMin * 60));
    const nextArrSeconds = (intervalMin * 60) - progressSeconds;

    const arr1 = new Date(now.getTime() + nextArrSeconds * 1000);
    const arr2 = new Date(now.getTime() + (nextArrSeconds + intervalMin * 60) * 1000);
    const arr3 = new Date(now.getTime() + (nextArrSeconds + intervalMin * 120) * 1000);

    const loads = ['SEA', 'SDA', 'LSD'];
    const load1 = loads[(hash + currentMinute) % 3];
    const load2 = loads[(hash + currentMinute + 1) % 3];

    return {
      ServiceNo: svc,
      Operator: 'SBST',
      NextBus: {
        OriginCode: '01012',
        DestinationCode: '10169',
        EstimatedArrival: arr1.toISOString(),
        Latitude: '1.2858',
        Longitude: '103.8530',
        VisitNumber: '1',
        Load: load1,
        Feature: 'WAB',
        Type: (hash + i) % 2 === 0 ? 'DD' : 'SD',
      },
      NextBus2: {
        OriginCode: '01012',
        DestinationCode: '10169',
        EstimatedArrival: arr2.toISOString(),
        Latitude: '1.2910',
        Longitude: '103.8510',
        VisitNumber: '1',
        Load: load2,
        Feature: 'WAB',
        Type: 'SD',
      },
      NextBus3: {
        OriginCode: '01012',
        DestinationCode: '10169',
        EstimatedArrival: arr3.toISOString(),
        Latitude: '1.3000',
        Longitude: '103.8500',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD',
      },
    };
  });

  return res.status(200).json({
    'odata.metadata': 'https://datamall2.mytransport.sg/ltaodataservice/$metadata#BusArrivalv2/@Element',
    BusStopCode: busStopCode,
    Services: simulatedServices,
    _info: {
      status: 'simulated_fallback',
      message: 'LTA_ACCOUNT_KEY is not configured in environment variables. Set LTA_ACCOUNT_KEY in Vercel to fetch live LTA DataMall data.',
      targetUrl,
    },
  });
}
