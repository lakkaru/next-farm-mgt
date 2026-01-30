import { NextResponse } from 'next/server';

/**
 * Health check endpoint for load balancers and monitoring
 * GET /api/health
 */
export async function GET() {
  const healthcheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      memory: getMemoryUsage(),
      api: await checkBackendAPI(),
    },
  };

  const allHealthy = Object.values(healthcheck.checks).every(
    (check) => check.status === 'healthy'
  );

  return NextResponse.json(healthcheck, {
    status: allHealthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}

function getMemoryUsage() {
  const used = process.memoryUsage();
  return {
    status: 'healthy',
    heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)} MB`,
    heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)} MB`,
    rss: `${Math.round(used.rss / 1024 / 1024)} MB`,
  };
}

async function checkBackendAPI() {
  try {
    const apiUrl = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      return { status: 'unknown', message: 'API URL not configured' };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${apiUrl.replace('/api', '')}/health`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      return { status: 'healthy', responseTime: 'OK' };
    }
    return { status: 'unhealthy', message: `API returned ${response.status}` };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}
