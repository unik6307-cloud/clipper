import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { platformAdapters } from '@/lib/social-adapters';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const integrations = [
      {
        id: 'youtube',
        name: 'YouTube Data & Analytics API',
        platform: 'YOUTUBE',
        category: 'Social Distribution',
        ...platformAdapters.YOUTUBE.getIntegrationStatus(),
        connectedPagesCount: 2,
        lastSync: new Date().toISOString(),
      },
      {
        id: 'meta_instagram',
        name: 'Meta Graph API (Instagram Professional)',
        platform: 'INSTAGRAM',
        category: 'Social Distribution',
        ...platformAdapters.INSTAGRAM.getIntegrationStatus(),
        connectedPagesCount: 1,
        lastSync: new Date().toISOString(),
      },
      {
        id: 'tiktok_developer',
        name: 'TikTok Developer Login & Display API',
        platform: 'TIKTOK',
        category: 'Social Distribution',
        ...platformAdapters.TIKTOK.getIntegrationStatus(),
        connectedPagesCount: 1,
        lastSync: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'object_storage',
        name: 'Private Object Storage (AWS S3 / Cloudflare R2)',
        category: 'Infrastructure & Vault',
        status: 'connected',
        configured: true,
        bucketName: process.env.STORAGE_BUCKET_NAME || 'clipper-private-assets',
        provider: process.env.STORAGE_PROVIDER || 'mock_s3',
        documentationUrl: 'https://docs.aws.amazon.com/s3/',
      },
      {
        id: 'payment_processor',
        name: 'Stripe Connect / Marketplace Adapter',
        category: 'Payments & Settlement',
        status: 'connected',
        configured: true,
        commissionPercent: process.env.STRIPE_COMMISSION_PERCENT || 10,
        provider: 'stripe_marketplace',
        documentationUrl: 'https://stripe.com/docs/connect',
      },
    ];

    return NextResponse.json({ integrations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
