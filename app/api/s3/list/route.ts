import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// ✅ Force this to run on Node.js runtime in Amplify
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const { filename, type } = await req.json();
    if (!filename) {
      return NextResponse.json({ error: 'filename required' }, { status: 400 });
    }

    // ✅ Read env vars safely at runtime
    const bucket = (process.env.S3_UPLOAD_BUCKET ?? '').trim();
    const region = (process.env.AWS_REGION ?? 'us-east-1').trim();
    const encryption = (process.env.S3_ENCRYPTION ?? '').toLowerCase() === 'true';

    if (!bucket) {
      console.error('S3_UPLOAD_BUCKET missing at runtime');
      return NextResponse.json({ error: 'S3_UPLOAD_BUCKET not configured' }, { status: 500 });
    }

    // ✅ Create S3 client using Amplify service role credentials
    const s3 = new S3Client({ region });

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: filename,
      ContentType: type || 'application/octet-stream',
      ...(encryption ? { ServerSideEncryption: 'AES256' } : {})
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 120 });

    return NextResponse.json({ url, key: filename });
  } catch (e) {
    console.error('presign error', e);
    return NextResponse.json({ error: 'Failed to generate presigned url' }, { status: 500 });
  }
}
