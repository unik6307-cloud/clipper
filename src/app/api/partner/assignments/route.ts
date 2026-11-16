import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { storage } from '@/lib/storage-adapter';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const partner = await db.partnerProfile.findUnique({
      where: { userId: user.userId },
    });

    const whereClause: any = partner ? { partnerId: partner.id } : {};

    const assignments = await db.distributionAssignment.findMany({
      where: whereClause,
      include: {
        socialPage: true,
        finalEdit: {
          include: {
            editVersion: {
              select: {
                title: true,
                hookDescription: true,
                captionText: true,
                aspectRatio: true,
                durationSeconds: true,
              },
            },
          },
        },
        campaign: {
          select: {
            id: true,
            title: true,
            objective: true,
            targetPlatforms: true,
          },
        },
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

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { assignmentId, action } = await req.json();

    if (action === 'GET_DOWNLOAD_URL') {
      const assignment = await db.distributionAssignment.findUnique({
        where: { id: assignmentId },
        include: {
          finalEdit: true,
          socialPage: true,
        },
      });

      if (!assignment) {
        return NextResponse.json({ error: 'Assignment not found.' }, { status: 404 });
      }

      // Partner must have accepted the assignment
      const allowedStatuses = [
        'ASSET_ACCESS_GRANTED',
        'PUBLISHING_DUE',
        'SUBMITTED_FOR_VERIFICATION',
        'VERIFIED_PUBLISHED',
        'TRACKING',
        'COMPLETED',
      ];

      if (!allowedStatuses.includes(assignment.status)) {
        return NextResponse.json(
          {
            error:
              'ACCESS_DENIED: Asset download is only accessible after accepting the publishing invitation.',
          },
          { status: 403 }
        );
      }

      // Generate 15-minute expiring link
      const downloadInfo = storage.generateExpiringDownloadUrl(
        assignment.finalEdit.storageKey,
        assignment.id,
        assignment.partnerId,
        15 // 15 mins
      );

      await logAuditEvent({
        actorUserId: user.userId,
        actorRole: user.role,
        action: 'DOWNLOAD_FINAL_ASSET',
        entityType: 'final_edit',
        entityId: assignment.finalEdit.id,
        newState: {
          assignmentId: assignment.id,
          socialPage: assignment.socialPage.handle,
          expiresAt: downloadInfo.expiresAt,
        },
      });

      return NextResponse.json({
        success: true,
        downloadUrl: downloadInfo.downloadUrl,
        expiresAt: downloadInfo.expiresAt,
        finalEditId: assignment.finalEdit.id,
        instructions: {
          rule: 'DISTRIBUTION_PARTNER_DOES_NOT_EDIT: You must publish this exact creative without alterations.',
          targetPage: assignment.socialPage.handle,
          platform: assignment.socialPage.platform,
        },
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
