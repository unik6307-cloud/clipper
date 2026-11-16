import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const campaign = await db.campaign.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, email: true, avatarUrl: true } },
        rights: true,
        sourceAssets: true,
        editingTasks: {
          include: {
            editor: { select: { id: true, name: true, email: true } },
            editVersions: {
              orderBy: { versionNumber: 'desc' },
            },
          },
        },
        finalEdits: {
          include: {
            editVersion: true,
            assignment: {
              include: {
                socialPage: {
                  include: { partner: true },
                },
                invitation: true,
                publishedPost: {
                  include: { analytics: true },
                },
              },
            },
          },
        },
        quotes: true,
        payments: true,
        invoices: true,
        disputes: true,
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Role check: Creators can only see their own campaigns (unless team or admin)
    if (
      user.role === 'CONTENT_CREATOR' &&
      campaign.creatorId !== user.userId
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Convert any BigInt in source assets for JSON serialization
    const safeCampaign = JSON.parse(
      JSON.stringify(campaign, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    return NextResponse.json({ campaign: safeCampaign });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
