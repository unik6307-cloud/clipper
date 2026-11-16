import { PrismaClient } from '@prisma/client';
import assert from 'assert';

const prisma = new PrismaClient();

async function runTests() {
  console.log('--- RUNNING CLIPPER AUTOMATED ACCEPTANCE TESTS ---');

  let passed = 0;
  let failed = 0;

  // TEST 1: ONE_EDIT_ONE_PAGE Database & Transactional Constraint
  try {
    console.log('\n[TEST 1] Enforce ONE_EDIT_ONE_PAGE (Unique Constraint on Final Edit Assignment)...');
    
    // Attempting to assign EDIT-ACME-001 (already assigned to TechSparks) to another page (CodeDaily)
    let caughtError = null;
    try {
      await prisma.distributionAssignment.create({
        data: {
          finalEditId: 'EDIT-ACME-001', // Already assigned!
          socialPageId: 'page_codedaily_ig',
          campaignId: 'cmp_acme_founders_01',
          partnerId: 'usr_partner_devnetwork',
          agreedPriceCents: 15000,
          status: 'PROPOSED',
        },
      });
    } catch (err) {
      caughtError = err;
    }

    assert(caughtError !== null, 'Expected database unique constraint failure when assigning same Edit ID to second page!');
    assert(
      caughtError.code === 'P2002' || caughtError.message.includes('Unique constraint'),
      `Expected Prisma P2002 Unique Constraint error, got: ${caughtError.code || caughtError.message}`
    );

    console.log('✅ TEST 1 PASSED: Database strictly rejected duplicate assignment of EDIT-ACME-001.');
    passed++;
  } catch (err) {
    console.error('❌ TEST 1 FAILED:', err.message);
    failed++;
  }

  // TEST 2: Assignment State Immutability & Audit Trail
  try {
    console.log('\n[TEST 2] Verifying Assignment Integrity & Audit Trail...');
    const assignment = await prisma.distributionAssignment.findUnique({
      where: { finalEditId: 'EDIT-ACME-001' },
      include: { finalEdit: true, socialPage: true },
    });

    assert(assignment !== null, 'Assignment for EDIT-ACME-001 must exist');
    assert.strictEqual(assignment.finalEditId, 'EDIT-ACME-001');
    assert.strictEqual(assignment.socialPageId, 'page_techsparks_yt');
    assert.strictEqual(assignment.status, 'VERIFIED_PUBLISHED');

    const auditLogs = await prisma.auditLog.findMany({
      where: { entityId: 'asg_acme_001' },
    });
    assert(auditLogs.length > 0, 'Audit log must record assignment commitment');

    console.log('✅ TEST 2 PASSED: Assignment state and audit log verified.');
    passed++;
  } catch (err) {
    console.error('❌ TEST 2 FAILED:', err.message);
    failed++;
  }

  // TEST 3: No Fake Analytics & Provenance Tracking
  try {
    console.log('\n[TEST 3] Verifying Metric Provenance & Attribution Caveats...');
    const postAnalytics = await prisma.postAnalytics.findFirst({
      where: { post: { assignment: { finalEditId: 'EDIT-ACME-001' } } },
    });

    assert(postAnalytics !== null, 'Post analytics snapshot must exist');
    assert(postAnalytics.provenance === 'PLATFORM_API', 'Analytics must declare authentic provenance source');
    assert(
      postAnalytics.attributionCaveat && postAnalytics.attributionCaveat.length > 10,
      'Analytics must include attribution limitation disclaimer'
    );

    const socialPage = await prisma.socialPage.findUnique({
      where: { id: 'page_techsparks_yt' },
    });
    assert(socialPage.medianViewsSample >= 10, 'Median views must show sample size');
    assert(socialPage.metricProvenance === 'PLATFORM_API', 'Page metrics must record data source');

    console.log('✅ TEST 3 PASSED: Verified provenance and non-fabrication disclaimers.');
    passed++;
  } catch (err) {
    console.error('❌ TEST 3 FAILED:', err.message);
    failed++;
  }

  // TEST 4: Rights Declaration Required
  try {
    console.log('\n[TEST 4] Verifying Rights & Licensing Clearances...');
    const campaignRights = await prisma.campaignRights.findUnique({
      where: { campaignId: 'cmp_acme_founders_01' },
    });

    assert(campaignRights !== null, 'Campaign rights declaration must exist');
    assert.strictEqual(campaignRights.ownsSourceContent, true, 'Creator must certify ownership or license');
    assert(campaignRights.declarationAcceptedAt !== null, 'Timestamp of declaration must be recorded');

    console.log('✅ TEST 4 PASSED: Rights declarations verified before distribution.');
    passed++;
  } catch (err) {
    console.error('❌ TEST 4 FAILED:', err.message);
    failed++;
  }

  // TEST 5: Double-Entry Ledger & Financial Breakdown
  try {
    console.log('\n[TEST 5] Verifying Financial Ledger & Itemized Quote Integrity...');
    const quote = await prisma.quote.findUnique({
      where: { id: 'qte_acme_42' },
    });

    assert(quote !== null, 'Quote must exist');
    const calculatedTotal = quote.editingSubtotalCents + quote.placementSubtotalCents + quote.platformFeeCents + quote.taxCents;
    assert.strictEqual(calculatedTotal, quote.totalDueCents, 'Quote components must sum to total due');

    const ledger = await prisma.ledgerEntry.findMany({
      where: { relatedCampaignId: 'cmp_acme_founders_01' },
    });
    assert(ledger.length >= 3, 'Ledger must record charge, fee, and payable entries');

    console.log('✅ TEST 5 PASSED: Financial math and ledger accounting verified.');
    passed++;
  } catch (err) {
    console.error('❌ TEST 5 FAILED:', err.message);
    failed++;
  }

  console.log(`\n========================================`);
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
