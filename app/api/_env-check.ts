import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    HAS_KEY: Boolean((process.env.MY_AWS_ACCESS_KEY_ID ?? '').trim()),
    HAS_SECRET: Boolean((process.env.MY_AWS_SECRET_ACCESS_KEY ?? '').trim()),
  });
}
