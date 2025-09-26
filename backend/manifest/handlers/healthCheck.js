module.exports = async (req, res) => {
  const timestamp = new Date().toISOString();
  const appId = req.get('X-App-ID') || 'Unknown';
  
  console.log(`🔍 [HEALTH] Health check requested at ${timestamp}`);
  console.log(`🔍 [HEALTH] App ID: ${appId}`);
  
  try {
    const healthStatus = {
      status: 'ok',
      timestamp: timestamp,
      appId: appId,
      manifest: 'connected',
      version: '4.16.1',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      platform: {
        node: process.version,
        arch: process.arch,
        platform: process.platform
      }
    };
    
    console.log(`✅ [HEALTH] Health check successful:`, healthStatus);
    
    res.status(200).json(healthStatus);
  } catch (error) {
    console.error(`❌ [HEALTH] Health check failed:`, error);
    
    const errorStatus = {
      status: 'error',
      timestamp: timestamp,
      appId: appId,
      error: error.message,
      manifest: 'disconnected'
    };
    
    res.status(500).json(errorStatus);
  }
};