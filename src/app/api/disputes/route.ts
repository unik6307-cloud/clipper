import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let whereClause: any = {};
    if (user.role === 'CONTENT_CREATOR') {
      whereClause = { raisedByUserId: user.userId };
    }

    const disputes = await db.dispute.findMany({
      where: whereClause,
      include: {
        campaign: { select: { id: true, title: true } },
        raisedByUser: { select: { name: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ disputes });
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

    const { campaignId, assignmentId, reasonCategory, description } = await req.json();

    if (!campaignId || !reasonCategory || !description) {
      return NextResponse.json(
        { error: 'campaignId, reasonCategory, and description are required.' },
        { status: 400 }
      );
    }

    const dispute = await db.dispute.create({
      data: {
        campaignId,
        assignmentId: assignmentId || null,
        raisedByUserId: user.userId,
        reasonCategory,
        description,
        status: 'OPEN',
      },
    });

    // If copyright or takedown, update assignment or campaign state
    if (reasonCategory === 'COPYRIGHT' && assignmentId) {
      await db.distributionAssignment.update({
        where: { id: assignmentId },
        data: { status: 'DISPUTED' },
      });
    }

    await logAuditEvent({
      actorUserId: user.userId,
      actorRole: user.role,
      action: 'RAISE_DISPUTE_OR_TAKEDOWN',
      entityType: 'dispute',
      entityId: dispute.id,
      newState: { reasonCategory, description },
    });

    return NextResponse.json({
      success: true,
      message: 'Dispute / Takedown notice registered. Operations team has been alerted.',
      dispute,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !['OPERATIONS_ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { disputeId, resolutionStatus, resolutionNotes } = await req.json();

    const updated = await db.dispute.update({
      where: { id: disputeId },
      data: {
        status: resolutionStatus,
        resolutionNotes,
        resolvedAt: new Date(),
        resolvedByUserId: user.userId,
      },
    });

    await logAuditEvent({
      actorUserId: user.userId,
      actorRole: user.role,
      action: 'RESOLVE_DISPUTE',
      entityType: 'dispute',
      entityId: disputeId,
      newState: { status: resolutionStatus, resolutionNotes },
    });

    return NextResponse.json({ success: true, dispute: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
