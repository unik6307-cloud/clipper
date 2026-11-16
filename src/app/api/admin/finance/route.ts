import { NextResponse } from 'next/server';
import { getCurrentUser, assertRole } from '@/lib/auth';
import { db } from '@/lib/db';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['FINANCE_MANAGER', 'SUPER_ADMIN']);

    const [ledgerEntries, quotes, invoices, payouts] = await Promise.all([
      db.ledgerEntry.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }),
      db.quote.findMany({
        include: {
          campaign: { select: { id: true, title: true } },
          user: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      db.invoice.findMany({
        include: {
          campaign: { select: { title: true } },
          user: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      db.partnerPayout.findMany({
        include: {
          partner: true,
          assignment: {
            include: {
              socialPage: true,
              finalEdit: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return NextResponse.json({
      ledgerEntries,
      quotes,
      invoices,
      payouts,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['FINANCE_MANAGER', 'SUPER_ADMIN']);

    const { action, payoutIds } = await req.json();

    if (action === 'PROCESS_PAYOUT_BATCH') {
      if (!payoutIds || !Array.isArray(payoutIds) || payoutIds.length === 0) {
        return NextResponse.json({ error: 'payoutIds array required' }, { status: 400 });
      }

      const batchId = `BATCH-${Date.now()}`;

      const updated = await db.$transaction(async (tx) => {
        // Mark payouts as PAID
        await tx.partnerPayout.updateMany({
          where: { id: { in: payoutIds } },
          data: {
            status: 'PAID',
            batchId,
            paidAt: new Date(),
          },
        });

        // Record settlement movement in ledger
        for (const payoutId of payoutIds) {
          const payout = await tx.partnerPayout.findUnique({
            where: { id: payoutId },
          });
          if (payout) {
            await tx.ledgerEntry.create({
              data: {
                transactionType: 'PAYOUT_SETTLEMENT',
                accountId: payout.partnerId,
                relatedAssignmentId: payout.assignmentId,
                debitCents: payout.amountCents,
                creditCents: 0,
                balanceCents: 0,
                notes: `Settlement disbursed via Marketplace Payout Batch ${batchId}`,
              },
            });
          }
        }

        return { batchId, count: payoutIds.length };
      });

      await logAuditEvent({
        actorUserId: user!.userId,
        actorRole: user!.role,
        action: 'PROCESS_PAYOUT_BATCH',
        entityType: 'partner_payout',
        entityId: batchId,
        newState: { batchId, payoutIdsCount: payoutIds.length },
      });

      return NextResponse.json({
        success: true,
        message: `Settlement completed for ${updated.count} partner payouts in batch ${batchId}.`,
        batchId,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
