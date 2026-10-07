/**
 * @file /api/health.js
 * Health monitoring endpoint to verify API operation and configuration.
 */

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, AccountKey');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const hasLtaKey = Boolean(process.env.LTA_ACCOUNT_KEY);

  const healthData = {
    status: 'ok',
    service: 'Singapore LTA Bus Arrival API Proxy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0),
    environment: {
      hasLtaAccountKey: hasLtaKey,
      nodeVersion: process.version,
    },
    endpoints: {
      health: '/api/health',
      busArrival: '/api/bus-arrival?BusStopCode=04121[&ServiceNo=7]',
    },
    ltaDataMallTarget: 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival',
  };

  return res.status(200).json(healthData);
}
