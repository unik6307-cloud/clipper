import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Clipper database...');

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.partnerPayout.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.ledgerEntry.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.postAnalytics.deleteMany();
  await prisma.publishedPost.deleteMany();
  await prisma.partnerInvitation.deleteMany();
  await prisma.distributionAssignment.deleteMany();
  await prisma.pageRecommendation.deleteMany();
  await prisma.finalEdit.deleteMany();
  await prisma.editVersion.deleteMany();
  await prisma.editingTask.deleteMany();
  await prisma.sourceAsset.deleteMany();
  await prisma.campaignRights.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.analyticsSnapshot.deleteMany();
  await prisma.pageVerification.deleteMany();
  await prisma.socialConnection.deleteMany();
  await prisma.socialPage.deleteMany();
  await prisma.partnerProfile.deleteMany();
  await prisma.creatorProfile.deleteMany();
  await prisma.organisationMember.deleteMany();
  await prisma.organisation.deleteMany();
  await prisma.user.deleteMany();

  const dummyPasswordHash = crypto.createHash('sha256').update('password123').digest('hex');

  // 1. Create Users
  const creatorUser = await prisma.user.create({
    data: {
      id: 'usr_creator_acme',
      email: 'creator@acme.io',
      name: 'Sarah Lin',
      passwordHash: dummyPasswordHash,
      role: 'CONTENT_CREATOR',
      status: 'ACTIVE',
      phone: '+1 (555) 019-2831',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
  });

  const partnerUser1 = await prisma.user.create({
    data: {
      id: 'usr_partner_devnetwork',
      email: 'partner@devnetwork.media',
      name: 'Marcus Vance',
      passwordHash: dummyPasswordHash,
      role: 'DISTRIBUTION_PARTNER',
      status: 'ACTIVE',
      phone: '+1 (555) 014-9922',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
  });

  const partnerUser2 = await prisma.user.create({
    data: {
      id: 'usr_partner_growthhub',
      email: 'partner2@growthhub.agency',
      name: 'Elena Rostova',
      passwordHash: dummyPasswordHash,
      role: 'DISTRIBUTION_PARTNER',
      status: 'ACTIVE',
      phone: '+1 (555) 018-4451',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  });

  const editorUser = await prisma.user.create({
    data: {
      id: 'usr_editor_jordan',
      email: 'editor@clipper.internal',
      name: 'Jordan Rivera',
      passwordHash: dummyPasswordHash,
      role: 'VIDEO_EDITOR',
      status: 'ACTIVE',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
  });

  const qaUser = await prisma.user.create({
    data: {
      id: 'usr_qa_taylor',
      email: 'qa@clipper.internal',
      name: 'Taylor Brooks',
      passwordHash: dummyPasswordHash,
      role: 'QUALITY_REVIEWER',
      status: 'ACTIVE',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      id: 'usr_admin_alex',
      email: 'admin@clipper.internal',
      name: 'Alex Chen',
      passwordHash: dummyPasswordHash,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    },
  });

  const opsUser = await prisma.user.create({
    data: {
      id: 'usr_ops_sam',
      email: 'ops@clipper.internal',
      name: 'Samantha Ray',
      passwordHash: dummyPasswordHash,
      role: 'OPERATIONS_ADMIN',
      status: 'ACTIVE',
    },
  });

  const financeUser = await prisma.user.create({
    data: {
      id: 'usr_fin_david',
      email: 'finance@clipper.internal',
      name: 'David Keller',
      passwordHash: dummyPasswordHash,
      role: 'FINANCE_MANAGER',
      status: 'ACTIVE',
    },
  });

  // 2. Profiles and Organisations
  const org = await prisma.organisation.create({
    data: {
      id: 'org_acme_media',
      name: 'Acme Media Labs',
      slug: 'acme-media',
      billingEmail: 'billing@acme.io',
      taxId: 'US-99210291',
      country: 'US',
    },
  });

  await prisma.organisationMember.create({
    data: {
      organisationId: org.id,
      userId: creatorUser.id,
      orgRole: 'OWNER',
    },
  });

  await prisma.creatorProfile.create({
    data: {
      userId: creatorUser.id,
      brandName: 'Acme Engineering & Tech Podcast',
      website: 'https://acme.io',
      bio: 'Weekly deep dives with tech founders and AI engineers.',
      targetNiche: 'Technology & AI',
    },
  });

  const partnerProfile1 = await prisma.partnerProfile.create({
    data: {
      userId: partnerUser1.id,
      businessName: 'DevNetwork Media LLC',
      country: 'US',
      taxStatus: 'W9_VERIFIED',
      payoutMethod: 'STRIPE_CONNECTED',
      payoutDetails: 'acct_1NZ4920492849203',
      isVerified: true,
      rating: 4.95,
      totalEarnings: 840000, // $8,400.00
    },
  });

  const partnerProfile2 = await prisma.partnerProfile.create({
    data: {
      userId: partnerUser2.id,
      businessName: 'GrowthHub Social Agency',
      country: 'US',
      taxStatus: 'W9_VERIFIED',
      payoutMethod: 'STRIPE_CONNECTED',
      payoutDetails: 'acct_2MN948201948201',
      isVerified: true,
      rating: 4.88,
      totalEarnings: 420000, // $4,200.00
    },
  });

  // 3. Social Pages with Provenance Metrics
  const page1 = await prisma.socialPage.create({
    data: {
      id: 'page_techsparks_yt',
      partnerId: partnerProfile1.id,
      platform: 'YOUTUBE',
      handle: '@TechSparksOfficial',
      pageName: 'TechSparks Shorts',
      profileUrl: 'https://youtube.com/@TechSparksOfficial',
      niche: 'Technology & AI',
      primaryLanguage: 'English',
      audienceMarkets: 'United States (58%), Canada (14%), UK (12%)',
      placementPriceCents: 18000, // $180.00
      verificationLevel: 'API_VERIFIED',
      status: 'ACTIVE',
      medianViewsSample: 20,
      medianViews: 34200,
      postingFrequency: 5.2,
      engagementRate: 4.6,
      completionRate: 99.2,
      cancellationRate: 0.8,
      disputeRate: 0.0,
      metricProvenance: 'PLATFORM_API',
      metricLastSync: new Date(),
    },
  });

  const page2 = await prisma.socialPage.create({
    data: {
      id: 'page_codedaily_ig',
      partnerId: partnerProfile1.id,
      platform: 'INSTAGRAM',
      handle: '@codedaily.reels',
      pageName: 'CodeDaily Reels',
      profileUrl: 'https://instagram.com/codedaily.reels',
      niche: 'Technology & AI',
      primaryLanguage: 'English',
      audienceMarkets: 'United States (45%), India (20%), UK (15%)',
      placementPriceCents: 15000, // $150.00
      verificationLevel: 'API_VERIFIED',
      status: 'ACTIVE',
      medianViewsSample: 15,
      medianViews: 26800,
      postingFrequency: 6.0,
      engagementRate: 5.1,
      completionRate: 98.5,
      cancellationRate: 1.5,
      disputeRate: 0.0,
      metricProvenance: 'PLATFORM_API',
      metricLastSync: new Date(),
    },
  });

  const page3 = await prisma.socialPage.create({
    data: {
      id: 'page_devclips_tt',
      partnerId: partnerProfile1.id,
      platform: 'TIKTOK',
      handle: '@devclips_feed',
      pageName: 'DevClips TikTok',
      profileUrl: 'https://tiktok.com/@devclips_feed',
      niche: 'Technology & AI',
      primaryLanguage: 'English',
      audienceMarkets: 'United States (62%), Canada (18%)',
      placementPriceCents: 14000, // $140.00
      verificationLevel: 'MANUAL_VERIFIED',
      status: 'ACTIVE',
      medianViewsSample: 12,
      medianViews: 21500,
      postingFrequency: 4.0,
      engagementRate: 3.9,
      completionRate: 97.0,
      cancellationRate: 2.0,
      disputeRate: 0.0,
      metricProvenance: 'PARTNER_SUBMITTED',
      metricLastSync: new Date(Date.now() - 3600000 * 24 * 2), // 2 days ago
    },
  });

  const page4 = await prisma.socialPage.create({
    data: {
      id: 'page_siliconrev_yt',
      partnerId: partnerProfile2.id,
      platform: 'YOUTUBE',
      handle: '@SiliconReview',
      pageName: 'Silicon Review',
      profileUrl: 'https://youtube.com/@SiliconReview',
      niche: 'Business & Startups',
      primaryLanguage: 'English',
      audienceMarkets: 'United States (70%), Germany (10%)',
      placementPriceCents: 22000, // $220.00
      verificationLevel: 'API_VERIFIED',
      status: 'ACTIVE',
      medianViewsSample: 25,
      medianViews: 45000,
      postingFrequency: 3.5,
      engagementRate: 4.2,
      completionRate: 99.0,
      cancellationRate: 1.0,
      disputeRate: 0.0,
      metricProvenance: 'PLATFORM_API',
      metricLastSync: new Date(),
    },
  });

  const page5 = await prisma.socialPage.create({
    data: {
      id: 'page_unverified_demo',
      partnerId: partnerProfile2.id,
      platform: 'INSTAGRAM',
      handle: '@ai_future_trends',
      pageName: 'AI Future Trends',
      profileUrl: 'https://instagram.com/ai_future_trends',
      niche: 'Technology & AI',
      primaryLanguage: 'English',
      audienceMarkets: 'Global',
      placementPriceCents: 9000, // $90.00
      verificationLevel: 'UNVERIFIED',
      status: 'ACTIVE',
      medianViewsSample: 5,
      medianViews: 8500,
      postingFrequency: 2.0,
      engagementRate: 2.1,
      completionRate: 90.0,
      cancellationRate: 5.0,
      disputeRate: 0.0,
      metricProvenance: 'ESTIMATED',
      metricLastSync: new Date(Date.now() - 3600000 * 24 * 10),
    },
  });

  // Social connections & verifications
  await prisma.socialConnection.create({
    data: {
      socialPageId: page1.id,
      provider: 'youtube',
      accountId: 'UC_TechSparks_YT992',
      scopes: 'https://www.googleapis.com/auth/youtube.readonly,https://www.googleapis.com/auth/yt-analytics.readonly',
      status: 'CONNECTED',
      tokenExpiry: new Date(Date.now() + 3600000 * 24 * 60),
      lastSyncAt: new Date(),
    },
  });

  await prisma.socialConnection.create({
    data: {
      socialPageId: page2.id,
      provider: 'instagram',
      accountId: 'ig_biz_492038102',
      scopes: 'instagram_basic,instagram_manage_insights',
      status: 'CONNECTED',
      tokenExpiry: new Date(Date.now() + 3600000 * 24 * 45),
      lastSyncAt: new Date(),
    },
  });

  // 4. Create Campaign
  const campaign = await prisma.campaign.create({
    data: {
      id: 'cmp_acme_founders_01',
      creatorId: creatorUser.id,
      organisationId: org.id,
      title: 'Episode 42: Next-Gen AI Infrastructure with Greg Brock',
      objective: 'BRAND_AWARENESS',
      contentNiche: 'Technology & AI',
      targetAudience: 'Software engineers, AI builders, technical founders',
      targetPlatforms: 'YOUTUBE,INSTAGRAM,TIKTOK',
      desiredEditsCount: 3,
      publishingWindowStart: new Date(),
      publishingWindowEnd: new Date(Date.now() + 3600000 * 24 * 14),
      editingBudgetCents: 36000, // 3 edits @ $120 = $360.00
      placementBudgetCents: 47000, // 3 placements ~ $470.00
      totalBudgetCents: 83000, // $830.00
      status: 'DISTRIBUTION_IN_PROGRESS',
    },
  });

  // Rights Declaration
  await prisma.campaignRights.create({
    data: {
      campaignId: campaign.id,
      ownsSourceContent: true,
      hasThirdPartyLicenses: true,
      permittedTerritories: 'Worldwide',
      permittedPlatforms: 'YouTube Shorts, Instagram Reels, TikTok',
      licenceDurationMonths: 24,
      rightsNotes: 'Full original interview footage with authorized commercial sync audio licensing.',
      declarationAcceptedAt: new Date(),
      acceptedByUserId: creatorUser.id,
    },
  });

  // Source Asset
  const sourceAsset = await prisma.sourceAsset.create({
    data: {
      id: 'src_acme_ep42_raw',
      campaignId: campaign.id,
      fileName: 'ep42_founder_interview_4k.mp4',
      fileSizeBytes: BigInt(2480000000), // 2.48 GB
      durationSeconds: 3120, // 52 minutes
      format: 'mp4',
      storageKey: 'campaigns/cmp_acme_founders_01/source/ep42_raw.mp4',
      previewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      checksumSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      uploadStatus: 'PROCESSED',
    },
  });

  // Editing Task
  const editingTask = await prisma.editingTask.create({
    data: {
      id: 'task_edit_acme_01',
      campaignId: campaign.id,
      sourceAssetId: sourceAsset.id,
      assignedEditorId: editorUser.id,
      status: 'APPROVED_BY_QA',
      targetClipsCount: 3,
      deadline: new Date(Date.now() + 3600000 * 24 * 3),
      internalNotes: 'Focus on timestamp 04:12 (why transformers scale) and 21:40 (GPU cluster bottleneck). Strong kinetic typography.',
    },
  });

  // Edit Versions
  const editVersion1 = await prisma.editVersion.create({
    data: {
      id: 'ev_clip_01_v2',
      editingTaskId: editingTask.id,
      versionNumber: 2,
      title: 'Clip 1: The $100M GPU Cluster Mistake',
      draftUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      storageKey: 'campaigns/cmp_acme_founders_01/edits/clip1_v2.mp4',
      hookDescription: 'Why 90% of AI startups overpay for GPU clusters in year 1',
      captionText: 'Most AI startups burn 7 figures before realizing compute is not the bottleneck... Here is what actually matters in 2026. #artificialintelligence #techstartup #dev',
      aspectRatio: '9:16',
      durationSeconds: 42,
      editorNotes: 'Paced cuts, highlighted sound bites, added animated captions.',
      qaNotes: 'Audio normalization meets EBU R128 (-14 LUFS). Captions checked 100% accurate. Approved.',
      status: 'APPROVED_FINAL',
    },
  });

  const editVersion2 = await prisma.editVersion.create({
    data: {
      id: 'ev_clip_02_v1',
      editingTaskId: editingTask.id,
      versionNumber: 1,
      title: 'Clip 2: Why Local LLMs Are Taking Over Enterprise',
      draftUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      storageKey: 'campaigns/cmp_acme_founders_01/edits/clip2_v1.mp4',
      hookDescription: 'Enterprise CTOs are silently ditching cloud LLM APIs',
      captionText: 'Privacy, latency, and 10x cost savings. Why local open-weight models won 2026 enterprise software. #softwareengineering #coding',
      aspectRatio: '9:16',
      durationSeconds: 51,
      editorNotes: 'Added diagram overlays at 0:15.',
      qaNotes: 'Verified compliant with brand styling and rights guidelines.',
      status: 'APPROVED_FINAL',
    },
  });

  const editVersion3 = await prisma.editVersion.create({
    data: {
      id: 'ev_clip_03_v1',
      editingTaskId: editingTask.id,
      versionNumber: 1,
      title: 'Clip 3: What 99% Of Junior Devs Get Wrong About Vector DBs',
      draftUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      storageKey: 'campaigns/cmp_acme_founders_01/edits/clip3_v1.mp4',
      hookDescription: 'Vector search is not magic—here is the brutal truth',
      captionText: 'Stop throwing raw embeddings into production without hybrid lexical ranking. Watch full episode in bio. #programming #developer',
      aspectRatio: '9:16',
      durationSeconds: 38,
      editorNotes: 'Clean cut from the 34:00 segment.',
      qaNotes: 'Approved for creator review.',
      status: 'APPROVED_FINAL',
    },
  });

  // Final Edits (Immutable IDs)
  const finalEdit1 = await prisma.finalEdit.create({
    data: {
      id: 'EDIT-ACME-001',
      editVersionId: editVersion1.id,
      campaignId: campaign.id,
      checksumSha256: 'a1b2c3d4e5f601728394a5b6c7d8e9f01234567890abcdef1234567890abcdef',
      durationSeconds: 42,
      aspectRatio: '9:16',
      storageKey: 'final_vault/cmp_acme/EDIT-ACME-001.mp4',
      approvedFileUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      approvedAt: new Date(Date.now() - 3600000 * 24 * 3),
      approvedByUserId: creatorUser.id,
      rightsSnapshotJson: JSON.stringify({
        licenceScope: 'Worldwide, non-exclusive single-channel distribution',
        platformsAllowed: ['YouTube Shorts'],
        creatorConsentRecordedAt: new Date().toISOString(),
        prohibitSubLicensing: true,
      }),
      status: 'PUBLISHED_TRACKING',
    },
  });

  const finalEdit2 = await prisma.finalEdit.create({
    data: {
      id: 'EDIT-ACME-002',
      editVersionId: editVersion2.id,
      campaignId: campaign.id,
      checksumSha256: 'b2c3d4e5f601728394a5b6c7d8e9f01234567890abcdef1234567890abcdefa1',
      durationSeconds: 51,
      aspectRatio: '9:16',
      storageKey: 'final_vault/cmp_acme/EDIT-ACME-002.mp4',
      approvedFileUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      approvedAt: new Date(Date.now() - 3600000 * 24 * 2),
      approvedByUserId: creatorUser.id,
      rightsSnapshotJson: JSON.stringify({
        licenceScope: 'Worldwide, non-exclusive single-channel distribution',
        platformsAllowed: ['Instagram Reels'],
        creatorConsentRecordedAt: new Date().toISOString(),
      }),
      status: 'ASSIGNED_LOCKED',
    },
  });

  const finalEdit3 = await prisma.finalEdit.create({
    data: {
      id: 'EDIT-ACME-003',
      editVersionId: editVersion3.id,
      campaignId: campaign.id,
      checksumSha256: 'c3d4e5f601728394a5b6c7d8e9f01234567890abcdef1234567890abcdefa1b2',
      durationSeconds: 38,
      aspectRatio: '9:16',
      storageKey: 'final_vault/cmp_acme/EDIT-ACME-003.mp4',
      approvedFileUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      approvedAt: new Date(Date.now() - 3600000 * 6),
      approvedByUserId: creatorUser.id,
      rightsSnapshotJson: JSON.stringify({
        licenceScope: 'Worldwide, non-exclusive single-channel distribution',
        platformsAllowed: ['TikTok', 'YouTube Shorts', 'Instagram Reels'],
        creatorConsentRecordedAt: new Date().toISOString(),
      }),
      status: 'AVAILABLE_FOR_MATCHING', // Ready for creator to discover and commit to 1 page!
    },
  });

  // 5. Distribution Assignments (STRICT 1-TO-1 ENFORCEMENT)
  // Edit 1 is assigned exclusively to page1 (TechSparks on YouTube)
  const assignment1 = await prisma.distributionAssignment.create({
    data: {
      id: 'asg_acme_001',
      finalEditId: finalEdit1.id, // UNIQUE!
      socialPageId: page1.id,
      campaignId: campaign.id,
      partnerId: partnerProfile1.id,
      agreedPriceCents: 18000,
      status: 'VERIFIED_PUBLISHED',
      publishingDeadline: new Date(Date.now() + 3600000 * 24 * 5),
      creatorApprovedAt: new Date(Date.now() - 3600000 * 48),
      partnerAcceptedAt: new Date(Date.now() - 3600000 * 36),
    },
  });

  // Edit 2 is assigned exclusively to page2 (CodeDaily on Instagram)
  const assignment2 = await prisma.distributionAssignment.create({
    data: {
      id: 'asg_acme_002',
      finalEditId: finalEdit2.id, // UNIQUE!
      socialPageId: page2.id,
      campaignId: campaign.id,
      partnerId: partnerProfile1.id,
      agreedPriceCents: 15000,
      status: 'ASSET_ACCESS_GRANTED',
      publishingDeadline: new Date(Date.now() + 3600000 * 24 * 3),
      creatorApprovedAt: new Date(Date.now() - 3600000 * 20),
      partnerAcceptedAt: new Date(Date.now() - 3600000 * 12),
    },
  });

  // Invitations
  await prisma.partnerInvitation.create({
    data: {
      assignmentId: assignment1.id,
      socialPageId: page1.id,
      partnerId: partnerProfile1.id,
      proposedFeeCents: 18000,
      expiresAt: new Date(Date.now() + 3600000 * 48),
      status: 'ACCEPTED',
      responseNotes: 'Accepted. Matching tech audience.',
    },
  });

  await prisma.partnerInvitation.create({
    data: {
      assignmentId: assignment2.id,
      socialPageId: page2.id,
      partnerId: partnerProfile1.id,
      proposedFeeCents: 15000,
      expiresAt: new Date(Date.now() + 3600000 * 48),
      status: 'ACCEPTED',
      responseNotes: 'Accepted for Wednesday slot.',
    },
  });

  // Published Post for Assignment 1
  const publishedPost = await prisma.publishedPost.create({
    data: {
      id: 'post_acme_yt_01',
      assignmentId: assignment1.id,
      publicPostUrl: 'https://youtube.com/shorts/dQw4w9WgXcQ',
      platformPostId: 'dQw4w9WgXcQ',
      publishedAt: new Date(Date.now() - 3600000 * 24),
      evidenceUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
      submissionNotes: 'Published as scheduled on @TechSparksOfficial shorts with pin comment link.',
      verificationStatus: 'API_VERIFIED',
      verifiedByUserId: qaUser.id,
      verifiedAt: new Date(Date.now() - 3600000 * 22),
      verificationNotes: 'YouTube Data API confirmed channel ID and video status public.',
    },
  });

  // Analytics for the published post
  await prisma.postAnalytics.create({
    data: {
      publishedPostId: publishedPost.id,
      snapshotAt: new Date(),
      viewsCount: 18450,
      likesCount: 1240,
      commentsCount: 89,
      sharesCount: 312,
      costPerThousandViews: 9.75, // $180 / 18,450 * 1000 = ~$9.75 CPM
      provenance: 'PLATFORM_API',
      attributionCaveat: 'Observed post performance snapshot; does not extrapolate causal brand uplift.',
    },
  });

  // 6. AI Recommendations for EDIT-ACME-003 (Demonstrating deterministic scoring)
  await prisma.pageRecommendation.create({
    data: {
      finalEditId: finalEdit3.id,
      socialPageId: page1.id,
      compositeScore: 94.5,
      nicheScore: 24.5, // 25
      viewsScore: 19.0, // 20
      audienceScore: 14.5, // 15
      priceScore: 13.5, // 15
      activityScore: 9.5, // 10
      deliveryScore: 9.5, // 10
      verificationScore: 4.0, // 5
      explanationText: 'Strongest match: High technology audience overlap (58% US engineers), consistent 34.2K median views, API verified metrics with 99.2% delivery reliability.',
      missingDataCaveat: 'Note: Channel already holds assignment for EDIT-ACME-001. A second assignment to this page requires separate clearance.',
      modelVersion: 'v1.0-deterministic',
    },
  });

  await prisma.pageRecommendation.create({
    data: {
      finalEditId: finalEdit3.id,
      socialPageId: page2.id,
      compositeScore: 91.2,
      nicheScore: 23.5,
      viewsScore: 18.0,
      audienceScore: 14.0,
      priceScore: 14.2,
      activityScore: 9.0,
      deliveryScore: 8.5,
      verificationScore: 4.0,
      explanationText: 'Excellent alternative: High engagement (5.1%) on Instagram Reels, strong developer demographic, competitive placement price ($150).',
      modelVersion: 'v1.0-deterministic',
    },
  });

  await prisma.pageRecommendation.create({
    data: {
      finalEditId: finalEdit3.id,
      socialPageId: page3.id,
      compositeScore: 82.0,
      nicheScore: 22.0,
      viewsScore: 15.5,
      audienceScore: 13.5,
      priceScore: 14.0,
      activityScore: 8.0,
      deliveryScore: 7.0,
      verificationScore: 2.0,
      explanationText: 'Good TikTok candidate: Partner submitted metrics, lower cost ($140), suitable for short punchy hook segment.',
      missingDataCaveat: 'Verification is MANUAL_VERIFIED, not direct platform API sync.',
      modelVersion: 'v1.0-deterministic',
    },
  });

  await prisma.pageRecommendation.create({
    data: {
      finalEditId: finalEdit3.id,
      socialPageId: page5.id,
      compositeScore: 45.0,
      nicheScore: 18.0,
      viewsScore: 7.0,
      audienceScore: 8.0,
      priceScore: 9.0,
      activityScore: 3.0,
      deliveryScore: 0.0,
      verificationScore: 0.0,
      explanationText: 'Unverified profile with estimated views and sporadic posting frequency.',
      missingDataCaveat: 'Metric data is ESTIMATED and not verified by API.',
      exclusionReason: 'Low delivery history and unverified ownership status.',
      modelVersion: 'v1.0-deterministic',
    },
  });

  // 7. Finance: Quotes, Payments, Ledger & Invoices
  const quote = await prisma.quote.create({
    data: {
      id: 'qte_acme_42',
      campaignId: campaign.id,
      userId: creatorUser.id,
      editingSubtotalCents: 36000, // $360.00
      placementSubtotalCents: 47000, // $470.00
      platformFeeCents: 8300, // $83.00 (10% marketplace commission)
      taxCents: 0,
      totalDueCents: 91300, // $913.00
      currency: 'USD',
      status: 'ACCEPTED',
      acceptedAt: new Date(Date.now() - 3600000 * 24 * 4),
    },
  });

  const payment = await prisma.payment.create({
    data: {
      id: 'pay_acme_42_01',
      campaignId: campaign.id,
      quoteId: quote.id,
      amountCents: 91300,
      currency: 'USD',
      provider: 'STRIPE_MARKETPLACE',
      providerPaymentId: 'pi_3Mtwx72eZvKYlo2C0V8B0912',
      idempotencyKey: 'acme_cmp42_payment_idemp_key_001',
      status: 'SUCCEEDED',
      paidAt: new Date(Date.now() - 3600000 * 24 * 4),
    },
  });

  await prisma.invoice.create({
    data: {
      id: 'inv_2026_001',
      invoiceNumber: 'INV-2026-0089',
      userId: creatorUser.id,
      orgId: org.id,
      campaignId: campaign.id,
      amountCents: 91300,
      taxCents: 0,
      status: 'PAID',
      dueDate: new Date(),
      paidAt: new Date(Date.now() - 3600000 * 24 * 4),
    },
  });

  // Double-entry Ledger entries
  await prisma.ledgerEntry.create({
    data: {
      id: 'ledg_001',
      transactionType: 'CAMPAIGN_CHARGE',
      accountId: creatorUser.id,
      relatedCampaignId: campaign.id,
      debitCents: 91300,
      creditCents: 0,
      balanceCents: 91300,
      notes: 'Customer payment received via Stripe Checkout for campaign Ep 42',
    },
  });

  await prisma.ledgerEntry.create({
    data: {
      id: 'ledg_002',
      transactionType: 'PLATFORM_FEE',
      accountId: 'CLIpper_TREASURY',
      relatedCampaignId: campaign.id,
      debitCents: 0,
      creditCents: 8300,
      balanceCents: 8300,
      notes: 'Platform commission 10% earned on campaign Ep 42',
    },
  });

  await prisma.ledgerEntry.create({
    data: {
      id: 'ledg_003',
      transactionType: 'PARTNER_PAYABLE',
      accountId: partnerProfile1.id,
      relatedCampaignId: campaign.id,
      relatedAssignmentId: assignment1.id,
      debitCents: 0,
      creditCents: 18000,
      balanceCents: 18000,
      notes: 'Payable locked for post publication on @TechSparksOfficial',
    },
  });

  // Partner Payout for assignment 1
  await prisma.partnerPayout.create({
    data: {
      id: 'payout_asg_001',
      partnerId: partnerProfile1.id,
      assignmentId: assignment1.id,
      amountCents: 18000,
      status: 'ELIGIBLE', // Verified published, ready for settlement batch
      createdAt: new Date(),
    },
  });

  // 8. Audit Logs capturing sensitive operations
  await prisma.auditLog.create({
    data: {
      actorUserId: creatorUser.id,
      actorRole: 'CONTENT_CREATOR',
      action: 'APPROVE_FINAL_EDIT',
      entityType: 'final_edit',
      entityId: finalEdit1.id,
      newStateJson: JSON.stringify({ status: 'APPROVED_FINAL', editId: finalEdit1.id }),
      ipAddress: '192.168.1.42',
    },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: creatorUser.id,
      actorRole: 'CONTENT_CREATOR',
      action: 'COMMIT_ASSIGNMENT',
      entityType: 'distribution_assignment',
      entityId: assignment1.id,
      newStateJson: JSON.stringify({
        rule: 'ONE_EDIT_ONE_PAGE',
        finalEditId: finalEdit1.id,
        socialPageId: page1.id,
        status: 'PARTNER_INVITED',
      }),
      ipAddress: '192.168.1.42',
    },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: qaUser.id,
      actorRole: 'QUALITY_REVIEWER',
      action: 'VERIFY_PUBLICATION',
      entityType: 'published_post',
      entityId: publishedPost.id,
      newStateJson: JSON.stringify({
        verificationStatus: 'API_VERIFIED',
        publicPostUrl: publishedPost.publicPostUrl,
      }),
      ipAddress: '10.0.1.15',
    },
  });

  // 9. Notifications
  await prisma.notification.create({
    data: {
      userId: creatorUser.id,
      title: 'Post Verified & Tracking',
      message: 'Your edit EDIT-ACME-001 has been verified on @TechSparksOfficial on YouTube Shorts.',
      link: '/creator/placements',
      type: 'ASSIGNMENT',
    },
  });

  await prisma.notification.create({
    data: {
      userId: partnerUser1.id,
      title: 'Publication Due Soon',
      message: 'Reminder: Edit EDIT-ACME-002 is due for publication on @codedaily.reels within 48 hours.',
      link: '/partner/assignments',
      type: 'ASSIGNMENT',
    },
  });

  console.log('Database seeded successfully with all relationships, strict rules, and sample data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
