import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { logAuditEvent } from '@/lib/audit';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: editVersionId } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { feedbackNotes } = await req.json();

    const editVersion = await db.editVersion.findUnique({
      where: { id: editVersionId },
      include: {
        editingTask: {
          include: { campaign: true },
        },
      },
    });

    if (!editVersion) {
      return NextResponse.json({ error: 'Edit version not found' }, { status: 404 });
    }

    const updated = await db.editVersion.update({
      where: { id: editVersion.id },
      data: {
        status: 'CREATOR_REVISION_REQUESTED',
        creatorFeedback: feedbackNotes || 'Creator requested adjustments on pacing/captions.',
      },
    });

    await db.editingTask.update({
      where: { id: editVersion.editingTaskId },
      data: { status: 'REVISION_NEEDED' },
    });

    await logAuditEvent({
      actorUserId: user.userId,
      actorRole: user.role,
      action: 'REQUEST_REVISION',
      entityType: 'edit_version',
      entityId: editVersion.id,
      newState: { feedbackNotes },
    });

    return NextResponse.json({
      success: true,
      editVersion: updated,
      message: 'Revision requested. Internal editor notified.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
