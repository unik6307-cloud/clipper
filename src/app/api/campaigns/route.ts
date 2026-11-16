import { NextResponse } from 'next/server';
import { getCurrentUser, assertRole } from '@/lib/auth';
import { db } from '@/lib/db';
import { payments } from '@/lib/payment-adapter';
import { logAuditEvent } from '@/lib/audit';
import crypto from 'crypto';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let whereClause: any = {};
    if (user.role === 'CONTENT_CREATOR') {
      whereClause = { creatorId: user.userId };
    }

    const campaigns = await db.campaign.findMany({
      where: whereClause,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        rights: true,
        sourceAssets: true,
        finalEdits: {
          include: {
            assignment: {
              include: {
                socialPage: true,
                publishedPost: {
                  include: { analytics: true },
                },
              },
            },
          },
        },
        editingTasks: {
          include: {
            editVersions: true,
          },
        },
        quotes: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const safeCampaigns = JSON.parse(
      JSON.stringify(campaigns, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    return NextResponse.json({ campaigns: safeCampaigns });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['CONTENT_CREATOR', 'SUPER_ADMIN']);

    const body = await req.json();
    const {
      title,
      objective,
      contentNiche,
      targetAudience,
      targetPlatforms, // Array of strings or comma-separated
      desiredEditsCount = 3,
      publishingWindowStart,
      publishingWindowEnd,
      // Source Video metadata
      fileName,
      fileSizeBytes = 500000000, // 500 MB default
      durationSeconds = 1800,   // 30 mins
      // Rights declaration
      ownsSourceContent,
      hasThirdPartyLicenses,
      permittedTerritories = 'Worldwide',
      permittedPlatforms = 'YouTube Shorts, Instagram Reels, TikTok',
      licenceDurationMonths = 12,
      rightsNotes,
    } = body;

    // NON-NEGOTIABLE RULE: RIGHTS_BEFORE_DISTRIBUTION
    if (!ownsSourceContent) {
      return NextResponse.json(
        {
          error:
            'RIGHTS_REQUIRED: You must certify that you own or hold full authorization to license the source material.',
        },
        { status: 400 }
      );
    }

    const platformsString = Array.isArray(targetPlatforms) ? targetPlatforms.join(',') : targetPlatforms || 'YOUTUBE,INSTAGRAM,TIKTOK';

    // Calculate unbundled itemized quote
    const quote = payments.calculateQuote({
      clipsCount: Number(desiredEditsCount),
      perClipEditingPriceCents: 12000, // $120.00 / clip
      estimatedPlacementCents: Number(desiredEditsCount) * 15000, // $150.00 / placement
      commissionPercent: 10,
    });

    // Execute atomic creation in database
    const result = await db.$transaction(async (tx) => {
      // 1. Create campaign
      const campaign = await tx.campaign.create({
        data: {
          creatorId: user!.userId,
          title,
          objective: objective || 'BRAND_AWARENESS',
          contentNiche: contentNiche || 'Technology & AI',
          targetAudience: targetAudience || 'General Enthusiasts',
          targetPlatforms: platformsString,
          desiredEditsCount: Number(desiredEditsCount),
          publishingWindowStart: publishingWindowStart ? new Date(publishingWindowStart) : new Date(),
          publishingWindowEnd: publishingWindowEnd ? new Date(publishingWindowEnd) : new Date(Date.now() + 86400000 * 14),
          editingBudgetCents: quote.editingSubtotalCents,
          placementBudgetCents: quote.placementSubtotalCents,
          totalBudgetCents: quote.totalDueCents,
          status: 'PAID', // Move directly to production after quote acceptance
        },
      });

      // 2. Save immutable Rights Declaration
      await tx.campaignRights.create({
        data: {
          campaignId: campaign.id,
          ownsSourceContent: true,
          hasThirdPartyLicenses: Boolean(hasThirdPartyLicenses),
          permittedTerritories,
          permittedPlatforms,
          licenceDurationMonths: Number(licenceDurationMonths),
          rightsNotes: rightsNotes || 'Creator declared full ownership and authorized commercial short-form production.',
          declarationAcceptedAt: new Date(),
          acceptedByUserId: user!.userId,
        },
      });

      // 3. Register Source Asset
      const sourceAsset = await tx.sourceAsset.create({
        data: {
          campaignId: campaign.id,
          fileName: fileName || 'raw_source_recording.mp4',
          fileSizeBytes: BigInt(fileSizeBytes),
          durationSeconds: Number(durationSeconds),
          format: 'mp4',
          storageKey: `campaigns/${campaign.id}/source/${fileName || 'source.mp4'}`,
          checksumSha256: crypto.createHash('sha256').update(`${campaign.id}:${fileName}`).digest('hex'),
          uploadStatus: 'PROCESSED',
          previewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        },
      });

      // 4. Create Editing Task for internal team
      const editingTask = await tx.editingTask.create({
        data: {
          campaignId: campaign.id,
          sourceAssetId: sourceAsset.id,
          status: 'QUEUED',
          targetClipsCount: Number(desiredEditsCount),
          deadline: new Date(Date.now() + 86400000 * 3),
          internalNotes: `Produce ${desiredEditsCount} high-retention short edits optimized for 9:16 mobile engagement.`,
        },
      });

      // 5. Create Itemized Quote & Payment record
      const dbQuote = await tx.quote.create({
        data: {
          campaignId: campaign.id,
          userId: user!.userId,
          editingSubtotalCents: quote.editingSubtotalCents,
          placementSubtotalCents: quote.placementSubtotalCents,
          platformFeeCents: quote.platformFeeCents,
          taxCents: quote.taxCents,
          totalDueCents: quote.totalDueCents,
          currency: 'USD',
          status: 'ACCEPTED',
          acceptedAt: new Date(),
        },
      });

      const payment = await tx.payment.create({
        data: {
          campaignId: campaign.id,
          quoteId: dbQuote.id,
          amountCents: quote.totalDueCents,
          currency: 'USD',
          provider: 'STRIPE_MARKETPLACE',
          providerPaymentId: `pi_mock_${crypto.randomBytes(8).toString('hex')}`,
          idempotencyKey: `idemp_${campaign.id}_${Date.now()}`,
          status: 'SUCCEEDED',
          paidAt: new Date(),
        },
      });

      // 6. Record Double-Entry Ledger Entry
      await tx.ledgerEntry.create({
        data: {
          transactionType: 'CAMPAIGN_CHARGE',
          accountId: user!.userId,
          relatedCampaignId: campaign.id,
          debitCents: quote.totalDueCents,
          creditCents: 0,
          balanceCents: quote.totalDueCents,
          notes: `Campaign payment received for "${campaign.title}"`,
        },
      });

      await tx.ledgerEntry.create({
        data: {
          transactionType: 'PLATFORM_FEE',
          accountId: 'CLIPPER_TREASURY',
          relatedCampaignId: campaign.id,
          debitCents: 0,
          creditCents: quote.platformFeeCents,
          balanceCents: quote.platformFeeCents,
          notes: `Marketplace platform commission (10%) on campaign "${campaign.title}"`,
        },
      });

      return { campaign, sourceAsset, editingTask, dbQuote, payment };
    });

    await logAuditEvent({
      actorUserId: user!.userId,
      actorRole: user!.role,
      action: 'CREATE_CAMPAIGN',
      entityType: 'campaign',
      entityId: result.campaign.id,
      newState: { title, quote: result.dbQuote },
    });

    return NextResponse.json({
      success: true,
      campaign: result.campaign,
      message: 'Campaign created and queued for internal production team.',
    });
  } catch (error: any) {
    console.error('Error creating campaign:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
