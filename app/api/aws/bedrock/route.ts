import { NextRequest, NextResponse } from 'next/server';
import { bedrock } from '@/lib/aws-config';

export async function POST(request: NextRequest) {
  try {
    const { prompt, modelId = 'anthropic.claude-3-sonnet-20240229-v1:0' } = await request.json();

    const params = {
      modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    };

    const response = await bedrock.invokeModel(params).promise();
    const responseBody = JSON.parse(response.body.toString());

    return NextResponse.json({
      success: true,
      data: responseBody
    });
  } catch (error) {
    console.error('Bedrock API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
