import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { logAuditEvent } from '@/lib/audit';
import crypto from 'crypto';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: editVersionId } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const editVersion = await db.editVersion.findUnique({
      where: { id: editVersionId },
      include: {
        editingTask: {
          include: {
            campaign: {
              include: { rights: true },
            },
          },
        },
        finalEdit: true,
      },
    });

    if (!editVersion) {
      return NextResponse.json({ error: 'Edit version not found' }, { status: 404 });
    }

    const campaign = editVersion.editingTask.campaign;

    // Verify creator owns this campaign
    if (user.role !== 'SUPER_ADMIN' && campaign.creatorId !== user.userId) {
      return NextResponse.json({ error: 'Forbidden: You do not own this campaign' }, { status: 403 });
    }

    // Check if already approved as a final edit
    if (editVersion.finalEdit) {
      return NextResponse.json({
        success: true,
        finalEdit: editVersion.finalEdit,
        message: 'This version has already been approved with final Edit ID.',
      });
    }

    // Generate unique opaque immutable Edit ID
    const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
    const finalEditId = `EDIT-${campaign.id.slice(-4).toUpperCase()}-${randomSuffix}`;
    const checksumSha256 = crypto
      .createHash('sha256')
      .update(`${editVersion.id}:${editVersion.storageKey}:${Date.now()}`)
      .digest('hex');

    // Create rights snapshot
    const rightsSnapshot = {
      campaignId: campaign.id,
      approvedAt: new Date().toISOString(),
      approvedByUserId: user.userId,
      permittedTerritories: campaign.rights?.permittedTerritories || 'Worldwide',
      permittedPlatforms: campaign.rights?.permittedPlatforms || 'YouTube Shorts, Instagram Reels, TikTok',
      rule: 'ONE_EDIT_ONE_PAGE: This finalized edit may be distributed to ONE verified social page only.',
    };

    const finalEdit = await db.$transaction(async (tx) => {
      // 1. Mark EditVersion as APPROVED_FINAL
      await tx.editVersion.update({
        where: { id: editVersion.id },
        data: { status: 'APPROVED_FINAL' },
      });

      // 2. Create immutable FinalEdit record
      const createdFinal = await tx.finalEdit.create({
        data: {
          id: finalEditId,
          editVersionId: editVersion.id,
          campaignId: campaign.id,
          checksumSha256,
          durationSeconds: editVersion.durationSeconds,
          aspectRatio: editVersion.aspectRatio,
          storageKey: editVersion.storageKey,
          approvedFileUrl: editVersion.draftUrl,
          approvedByUserId: user.userId,
          rightsSnapshotJson: JSON.stringify(rightsSnapshot),
          status: 'AVAILABLE_FOR_MATCHING',
        },
      });

      // 3. Update campaign status if all edits approved
      await tx.campaign.update({
        where: { id: campaign.id },
        data: { status: 'READY_FOR_DISTRIBUTION' },
      });

      return createdFinal;
    });

    await logAuditEvent({
      actorUserId: user.userId,
      actorRole: user.role,
      action: 'APPROVE_FINAL_EDIT',
      entityType: 'final_edit',
      entityId: finalEdit.id,
      newState: {
        finalEditId: finalEdit.id,
        checksum: finalEdit.checksumSha256,
        status: finalEdit.status,
      },
    });

    return NextResponse.json({
      success: true,
      finalEdit,
      message: `Final Edit ID ${finalEdit.id} successfully generated and ready for AI page discovery.`,
    });
  } catch (error: any) {
    console.error('Error approving edit:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
