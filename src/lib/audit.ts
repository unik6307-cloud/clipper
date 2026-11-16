import { db } from './db';

export async function logAuditEvent(params: {
  actorUserId?: string | null;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  previousState?: unknown;
  newState?: unknown;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    return await db.auditLog.create({
      data: {
        actorUserId: params.actorUserId || null,
        actorRole: params.actorRole,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        previousStateJson: params.previousState ? JSON.stringify(params.previousState) : null,
        newStateJson: params.newState ? JSON.stringify(params.newState) : null,
        ipAddress: params.ipAddress || '127.0.0.1',
        userAgent: params.userAgent || 'Clipper System Service',
      },
    });
  } catch (err) {
    console.error('Failed to write audit log:', err);
    return null;
  }
}
