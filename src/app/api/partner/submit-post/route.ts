import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { platformAdapters } from '@/lib/social-adapters';
import { logAuditEvent } from '@/lib/audit';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      assignmentId,
      publicPostUrl,
      publishedAt,
      evidenceUrl,
      submissionNotes,
    } = await req.json();

    if (!assignmentId || !publicPostUrl) {
      return NextResponse.json(
        { error: 'assignmentId and publicPostUrl are required.' },
        { status: 400 }
      );
    }

    const assignment = await db.distributionAssignment.findUnique({
      where: { id: assignmentId },
      include: {
        socialPage: true,
        finalEdit: true,
        campaign: true,
        publishedPost: true,
      },
    });

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found.' }, { status: 404 });
    }

    if (assignment.publishedPost) {
      return NextResponse.json(
        { error: 'A post submission already exists for this assignment. Contact support if editing is needed.' },
        { status: 400 }
      );
    }

    // Platform validation using adapter
    const adapter = platformAdapters[assignment.socialPage.platform];
    if (!adapter) {
      return NextResponse.json({ error: `Unsupported platform ${assignment.socialPage.platform}` }, { status: 400 });
    }

    let validationResult;
    try {
      validationResult = await adapter.verifyPostPublication(
        publicPostUrl,
        assignment.socialPage.handle
      );
    } catch (valErr: any) {
      return NextResponse.json(
        { error: `URL Validation Error: ${valErr.message}` },
        { status: 400 }
      );
    }

    const publicationDate = publishedAt ? new Date(publishedAt) : new Date();

    const createdPost = await db.$transaction(async (tx) => {
      // 1. Create published post record
      const post = await tx.publishedPost.create({
        data: {
          assignmentId: assignment.id,
          publicPostUrl,
          platformPostId: validationResult.platformPostId,
          publishedAt: publicationDate,
          evidenceUrl: evidenceUrl || null,
          submissionNotes: submissionNotes || 'Post submitted by partner.',
          verificationStatus: 'PENDING_VERIFICATION', // Routes to QA review
        },
      });

      // 2. Advance assignment state
      await tx.distributionAssignment.update({
        where: { id: assignment.id },
        data: {
          status: 'SUBMITTED_FOR_VERIFICATION',
        },
      });

      // 3. Create initial analytics snapshot with strict non-fake provenance
      await tx.postAnalytics.create({
        data: {
          publishedPostId: post.id,
          snapshotAt: new Date(),
          viewsCount: validationResult.viewsCount || 0,
          likesCount: validationResult.likesCount || 0,
          commentsCount: validationResult.commentsCount || 0,
          sharesCount: validationResult.sharesCount || 0,
          provenance: validationResult.provenance,
          attributionCaveat:
            'Observed post metrics at time of submission. Not guaranteed incremental reach or conversion.',
          rawJson: validationResult.rawApiResponse
            ? JSON.stringify(validationResult.rawApiResponse)
            : null,
        },
      });

      // 4. Notify QA team
      await tx.notification.create({
        data: {
          userId: assignment.campaign.creatorId,
          title: 'Post Submitted for Review',
          message: `Distribution partner for page ${assignment.socialPage.handle} has submitted the live post URL. Verification pending.`,
          link: '/creator/placements',
          type: 'ASSIGNMENT',
        },
      });

      return post;
    });

    await logAuditEvent({
      actorUserId: user.userId,
      actorRole: user.role,
      action: 'SUBMIT_PUBLISHED_POST',
      entityType: 'published_post',
      entityId: createdPost.id,
      newState: {
        publicPostUrl,
        platformPostId: validationResult.platformPostId,
        verificationStatus: 'PENDING_VERIFICATION',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Post submitted successfully and queued for verification.',
      publishedPost: createdPost,
    });
  } catch (error: any) {
    console.error('Submit post error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
