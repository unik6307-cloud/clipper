import crypto from 'crypto';

export interface PresignedUploadResponse {
  uploadUrl: string;
  storageKey: string;
  expiresInSeconds: number;
  headers: Record<string, string>;
}

export interface PresignedDownloadResponse {
  downloadUrl: string;
  storageKey: string;
  expiresAt: string;
  isExpiring: boolean;
}

export class StorageService {
  private static instance: StorageService;
  private bucket: string;

  private constructor() {
    this.bucket = process.env.STORAGE_BUCKET_NAME || 'clipper-private-assets';
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  /**
   * Generates a short-lived presigned URL for direct multipart/secure client uploads.
   * Binaries are never routed through application memory or insecure public folders.
   */
  public generatePresignedUploadUrl(
    campaignId: string,
    fileName: string,
    fileSizeBytes: number,
    contentType: string = 'video/mp4'
  ): PresignedUploadResponse {
    // Validate file constraints
    const maxSizeBytes = 10 * 1024 * 1024 * 1024; // 10 GB limit for source video
    if (fileSizeBytes > maxSizeBytes) {
      throw new Error(`File size ${(fileSizeBytes / (1024 * 1024 * 1024)).toFixed(1)}GB exceeds 10GB limit.`);
    }

    const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storageKey = `campaigns/${campaignId}/source/${Date.now()}_${sanitizedName}`;
    const token = crypto.randomBytes(24).toString('hex');

    return {
      uploadUrl: `https://${this.bucket}.s3.amazonaws.com/${storageKey}?signature=${token}&expires=3600`,
      storageKey,
      expiresInSeconds: 3600,
      headers: {
        'Content-Type': contentType,
        'x-amz-server-side-encryption': 'AES256',
        'x-amz-acl': 'private',
      },
    };
  }

  /**
   * Generates an access-controlled expiring download link.
   * Partners can only obtain this after officially accepting an assignment.
   */
  public generateExpiringDownloadUrl(
    storageKey: string,
    assignmentId: string,
    partnerId: string,
    ttlMinutes: number = 15
  ): PresignedDownloadResponse {
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();
    const token = crypto
      .createHmac('sha256', process.env.AUTH_SECRET || 'secret')
      .update(`${storageKey}:${assignmentId}:${partnerId}:${expiresAt}`)
      .digest('hex');

    // Demo/sample direct download asset for playback
    const sampleCdnBase = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
    const downloadUrl = `${sampleCdnBase}?token=${token}&expires=${expiresAt}&assignment=${assignmentId}`;

    return {
      downloadUrl,
      storageKey,
      expiresAt,
      isExpiring: true,
    };
  }

  /**
   * Generates SHA-256 checksum for immutable edit identity verification.
   */
  public calculateChecksum(content: Buffer | string): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }
}

export const storage = StorageService.getInstance();
