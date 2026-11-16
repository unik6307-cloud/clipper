import { NextResponse } from 'next/server';
import { getCurrentUser, assertRole } from '@/lib/auth';
import { db } from '@/lib/db';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['VIDEO_EDITOR', 'OPERATIONS_ADMIN', 'SUPER_ADMIN']);

    const tasks = await db.editingTask.findMany({
      include: {
        campaign: {
          select: {
            id: true,
            title: true,
            objective: true,
            contentNiche: true,
            targetPlatforms: true,
            targetAudience: true,
          },
        },
        sourceAsset: true,
        editVersions: {
          orderBy: { versionNumber: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const safeTasks = JSON.parse(
      JSON.stringify(tasks, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    return NextResponse.json({ tasks: safeTasks });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['VIDEO_EDITOR', 'OPERATIONS_ADMIN', 'SUPER_ADMIN']);

    const {
      editingTaskId,
      title,
      draftUrl,
      hookDescription,
      captionText,
      aspectRatio = '9:16',
      durationSeconds = 45,
      editorNotes,
    } = await req.json();

    if (!editingTaskId || !title || !hookDescription) {
      return NextResponse.json(
        { error: 'editingTaskId, title, and hookDescription are required.' },
        { status: 400 }
      );
    }

    const task = await db.editingTask.findUnique({
      where: { id: editingTaskId },
      include: { editVersions: true },
    });

    if (!task) {
      return NextResponse.json({ error: 'Editing task not found.' }, { status: 404 });
    }

    const nextVersionNumber = task.editVersions.length + 1;
    const finalDraftUrl =
      draftUrl ||
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

    const newVersion = await db.$transaction(async (tx) => {
      const ver = await tx.editVersion.create({
        data: {
          editingTaskId: task.id,
          versionNumber: nextVersionNumber,
          title,
          draftUrl: finalDraftUrl,
          storageKey: `campaigns/${task.campaignId}/edits/${Date.now()}_v${nextVersionNumber}.mp4`,
          hookDescription,
          captionText: captionText || 'Check full video in description! #viral #shorts',
          aspectRatio,
          durationSeconds: Number(durationSeconds),
          editorNotes: editorNotes || 'Cut and graded for high retention.',
          status: 'QA_PENDING',
        },
      });

      await tx.editingTask.update({
        where: { id: task.id },
        data: { status: 'IN_PROGRESS' },
      });

      return ver;
    });

    await logAuditEvent({
      actorUserId: user!.userId,
      actorRole: user!.role,
      action: 'UPLOAD_DRAFT_VERSION',
      entityType: 'edit_version',
      entityId: newVersion.id,
      newState: { versionNumber: nextVersionNumber, title },
    });

    return NextResponse.json({
      success: true,
      message: `Draft v${nextVersionNumber} uploaded and queued for Quality Review.`,
      editVersion: newVersion,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
