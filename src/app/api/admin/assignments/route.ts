import { NextResponse } from 'next/server';
import { getCurrentUser, assertRole } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['OPERATIONS_ADMIN', 'CAMPAIGN_MANAGER', 'SUPER_ADMIN']);

    const assignments = await db.distributionAssignment.findMany({
      include: {
        finalEdit: {
          include: {
            campaign: { select: { id: true, title: true } },
            editVersion: { select: { title: true, durationSeconds: true } },
          },
        },
        socialPage: {
          include: {
            partner: { select: { businessName: true, rating: true, country: true } },
          },
        },
        invitation: true,
        publishedPost: {
          include: { analytics: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ assignments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
