import { NextResponse } from 'next/server';
import { getCurrentUser, assertRole } from '@/lib/auth';
import { db } from '@/lib/db';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['OPERATIONS_ADMIN', 'SUPER_ADMIN']);

    const users = await db.user.findMany({
      include: {
        creatorProfile: true,
        partnerProfile: {
          include: { socialPages: true },
        },
        campaigns: { select: { id: true, title: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['SUPER_ADMIN', 'OPERATIONS_ADMIN']);

    const { targetUserId, role, status } = await req.json();

    if (!targetUserId) {
      return NextResponse.json({ error: 'targetUserId is required' }, { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: { id: targetUserId },
      data: {
        ...(role ? { role } : {}),
        ...(status ? { status } : {}),
      },
    });

    await logAuditEvent({
      actorUserId: user!.userId,
      actorRole: user!.role,
      action: 'UPDATE_USER_PERMISSIONS',
      entityType: 'user',
      entityId: targetUserId,
      newState: { role, status },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
