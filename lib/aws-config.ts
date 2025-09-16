import AWS from 'aws-sdk';

// Configure AWS
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const bedrock = new AWS.BedrockRuntime({
  region: process.env.AWS_REGION || 'us-east-1',
});

export const lambda = new AWS.Lambda({
  region: process.env.AWS_REGION || 'us-east-1',
});

export const transcribe = new AWS.TranscribeService({
  region: process.env.AWS_REGION || 'us-east-1',
});
