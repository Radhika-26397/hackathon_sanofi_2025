// app/api/s3/presign/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Force Node runtime & runtime evaluation
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const { filename, type } = await req.json();
    if (!filename) {
      return NextResponse.json({ error: 'filename required' }, { status: 400 });
    }

    // Read envs at runtime (no build-time inlining)
    const bucket = (process.env.S3_UPLOAD_BUCKET ?? '').trim();
    const region = (process.env.AWS_REGION ?? 'us-east-1').trim();
    if (!bucket) {
      console.error('S3_UPLOAD_BUCKET missing at runtime');
      return NextResponse.json({ error: 'S3_UPLOAD_BUCKET not configured' }, { status: 500 });
    }

    const s3 = new S3Client({ region }); // creds from Amplify service role
    const cmd = new PutObjectCommand({
      Bucket: bucket,
      Key: filename,
      ContentType: type || 'application/octet-stream',
      // If you set S3_ENCRYPTION=true in envs and want SSE-S3, uncomment next line:
      // ServerSideEncryption: 'AES256'
    });

    const url = await getSignedUrl(s3, cmd, { expiresIn: 120 });
    return NextResponse.json({ url, key: filename });
  } catch (e: any) {
    console.error('presign error', e?.message || e);
    return NextResponse.json({ error: 'Failed to generate presigned url' }, { status: 500 });
  }
}
