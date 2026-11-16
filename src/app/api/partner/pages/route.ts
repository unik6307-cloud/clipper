import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import crypto from 'crypto';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const partner = await db.partnerProfile.findUnique({
      where: { userId: user.userId },
      include: {
        socialPages: {
          include: {
            connections: true,
            verifications: true,
            assignments: {
              include: { finalEdit: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ pages: partner?.socialPages || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let partner = await db.partnerProfile.findUnique({
      where: { userId: user.userId },
    });

    if (!partner) {
      // Auto-create partner profile if not yet created
      partner = await db.partnerProfile.create({
        data: {
          userId: user.userId,
          businessName: `${user.name} Media`,
          country: 'US',
          payoutMethod: 'STRIPE_CONNECTED',
        },
      });
    }

    const {
      platform,
      handle,
      pageName,
      profileUrl,
      niche,
      primaryLanguage = 'English',
      audienceMarkets = 'US, UK, CA',
      placementPriceCents = 15000,
    } = await req.json();

    if (!platform || !handle || !pageName || !profileUrl || !niche) {
      return NextResponse.json(
        { error: 'Platform, handle, pageName, profileUrl, and niche are required.' },
        { status: 400 }
      );
    }

    // Check if handle already exists for this platform
    const existing = await db.socialPage.findUnique({
      where: {
        platform_handle: {
          platform,
          handle,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Social page ${handle} on ${platform} is already registered.` },
        { status: 409 }
      );
    }

    const verificationCode = `CLIPPER-VERIFY-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const newPage = await db.$transaction(async (tx) => {
      const page = await tx.socialPage.create({
        data: {
          partnerId: partner!.id,
          platform,
          handle,
          pageName,
          profileUrl,
          niche,
          primaryLanguage,
          audienceMarkets,
          placementPriceCents: Number(placementPriceCents),
          verificationLevel: 'PENDING_REVIEW',
          status: 'ACTIVE',
          medianViews: 20000, // estimated starting point
          medianViewsSample: 5,
          metricProvenance: 'PARTNER_SUBMITTED',
        },
      });

      await tx.pageVerification.create({
        data: {
          socialPageId: page.id,
          verificationType: 'PROFILE_BIO_CODE',
          verificationCode,
          status: 'PENDING',
        },
      });

      return page;
    });

    return NextResponse.json({
      success: true,
      page: newPage,
      verificationChallenge: {
        method: 'PROFILE_BIO_CODE',
        code: verificationCode,
        instruction: `Place code "${verificationCode}" in your ${platform} bio/about section or connect via official OAuth to verify ownership.`,
      },
    });
  } catch (error: any) {
    console.error('Add page error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
