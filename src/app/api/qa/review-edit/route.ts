import { NextResponse } from 'next/server';
import { getCurrentUser, assertRole } from '@/lib/auth';
import { db } from '@/lib/db';
import { logAuditEvent } from '@/lib/audit';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['QUALITY_REVIEWER', 'OPERATIONS_ADMIN', 'SUPER_ADMIN']);

    const { editVersionId, action, notes, checklist } = await req.json();

    if (!editVersionId || !['APPROVE', 'REQUEST_CHANGES'].includes(action)) {
      return NextResponse.json({ error: 'editVersionId and action (APPROVE/REQUEST_CHANGES) are required.' }, { status: 400 });
    }

    const editVersion = await db.editVersion.findUnique({
      where: { id: editVersionId },
      include: {
        editingTask: {
          include: { campaign: true },
        },
      },
    });

    if (!editVersion) {
      return NextResponse.json({ error: 'Edit version not found.' }, { status: 404 });
    }

    const isApproval = action === 'APPROVE';
    const newStatus = isApproval ? 'QA_APPROVED' : 'QA_REJECTED';

    const updated = await db.$transaction(async (tx) => {
      const updatedVer = await tx.editVersion.update({
        where: { id: editVersion.id },
        data: {
          status: newStatus,
          qaNotes: notes || (isApproval ? 'QA verified: Audio LUFS, 9:16 format, captions, and hook cleared.' : 'Adjustments needed.'),
        },
      });

      if (isApproval) {
        // Move editing task status to draft ready / creator review
        await tx.editingTask.update({
          where: { id: editVersion.editingTaskId },
          data: { status: 'DRAFT_READY' },
        });

        // Notify Creator that draft is ready for review
        await tx.notification.create({
          data: {
            userId: editVersion.editingTask.campaign.creatorId,
            title: 'Draft Edit Ready for Review',
            message: `QA has approved "${editVersion.title}". Preview and approve it in your Studio.`,
            link: '/creator/studio',
            type: 'EDITING',
          },
        });
      } else {
        await tx.editingTask.update({
          where: { id: editVersion.editingTaskId },
          data: { status: 'REVISION_NEEDED' },
        });
      }

      return updatedVer;
    });

    await logAuditEvent({
      actorUserId: user!.userId,
      actorRole: user!.role,
      action: isApproval ? 'QA_APPROVE_EDIT' : 'QA_REJECT_EDIT',
      entityType: 'edit_version',
      entityId: editVersion.id,
      newState: { status: newStatus, notes, checklist },
    });

    return NextResponse.json({
      success: true,
      message: isApproval
        ? 'Edit approved and released to creator review.'
        : 'Edit returned to video editor with correction notes.',
      editVersion: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
