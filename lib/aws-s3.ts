import { S3Client } from '@aws-sdk/client-s3';

let _s3: S3Client | null = null;

export function s3() {
  if (!_s3) {
    _s3 = new S3Client({
      region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1',
    });
  }
  return _s3;
}
