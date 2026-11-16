import { db } from './db';

export interface QuoteCalculationInput {
  clipsCount: number;
  perClipEditingPriceCents?: number;
  estimatedPlacementCents?: number;
  commissionPercent?: number;
  taxPercent?: number;
}

export interface ItemizedQuote {
  editingSubtotalCents: number;
  placementSubtotalCents: number;
  platformFeeCents: number;
  taxCents: number;
  totalDueCents: number;
  currency: string;
}

export class PaymentService {
  /**
   * Calculates a transparent, unbundled marketplace quote.
   * Separates editing production costs from distribution placement fees.
   */
  public calculateQuote(input: QuoteCalculationInput): ItemizedQuote {
    const perClip = input.perClipEditingPriceCents ?? 12000; // $120.00 / clip default
    const editingSubtotalCents = input.clipsCount * perClip;
    const placementSubtotalCents = input.estimatedPlacementCents ?? input.clipsCount * 15000; // ~$150.00 per placement
    const commissionPercent = input.commissionPercent ?? 10; // 10% marketplace fee
    const platformFeeCents = Math.round((editingSubtotalCents + placementSubtotalCents) * (commissionPercent / 100));
    const taxPercent = input.taxPercent ?? 0;
    const taxCents = Math.round((editingSubtotalCents + platformFeeCents) * (taxPercent / 100));
    const totalDueCents = editingSubtotalCents + placementSubtotalCents + platformFeeCents + taxCents;

    return {
      editingSubtotalCents,
      placementSubtotalCents,
      platformFeeCents,
      taxCents,
      totalDueCents,
      currency: 'USD',
    };
  }

  /**
   * Creates an immutable double-entry ledger movement.
   */
  public async recordLedgerEntry(data: {
    transactionType: 'CAMPAIGN_CHARGE' | 'PLATFORM_FEE' | 'PARTNER_PAYABLE' | 'PAYOUT_SETTLEMENT' | 'REFUND';
    accountId: string;
    relatedCampaignId?: string;
    relatedAssignmentId?: string;
    debitCents: number;
    creditCents: number;
    notes?: string;
  }) {
    return db.ledgerEntry.create({
      data: {
        transactionType: data.transactionType,
        accountId: data.accountId,
        relatedCampaignId: data.relatedCampaignId,
        relatedAssignmentId: data.relatedAssignmentId,
        debitCents: data.debitCents,
        creditCents: data.creditCents,
        balanceCents: data.debitCents - data.creditCents,
        notes: data.notes,
      },
    });
  }

  /**
   * Marks a verified assignment eligible for payout batching.
   */
  public async markPayoutEligible(assignmentId: string, partnerId: string, amountCents: number) {
    const existing = await db.partnerPayout.findFirst({
      where: { assignmentId },
    });

    if (existing) {
      return db.partnerPayout.update({
        where: { id: existing.id },
        data: { status: 'ELIGIBLE' },
      });
    }

    return db.partnerPayout.create({
      data: {
        partnerId,
        assignmentId,
        amountCents,
        status: 'ELIGIBLE',
      },
    });
  }
}

export const payments = new PaymentService();
