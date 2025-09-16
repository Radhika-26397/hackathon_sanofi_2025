import { NextRequest, NextResponse } from 'next/server';
import { s3 } from '../../../../lib/aws-s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function POST(req: NextRequest) {
  try {
    const { filename, type } = await req.json();
    if (!filename) {
      return NextResponse.json({ error: 'filename required' }, { status: 400 });
    }
    const bucket = process.env.S3_UPLOAD_BUCKET || "kbr920804837659"
    if (!bucket) {
      return NextResponse.json({ error: 'S3_UPLOAD_BUCKET not configured' }, { status: 500 });
    }
  const key = filename;
    const encryption = process.env.S3_ENCRYPTION === 'true';
  const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: type, ...(encryption ? { ServerSideEncryption: 'AES256' } : {}) });
  const url = await getSignedUrl(s3(), command, { expiresIn: 120 });
  return NextResponse.json({ url, key });
  } catch (e) {
    console.error('presign error', e);
    return NextResponse.json({ error: 'Failed to generate presigned url' }, { status: 500 });
  }
}
