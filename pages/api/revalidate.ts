// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.query.secret !== 'not_realy_secret') {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    await res.unstable_revalidate('/')
    return res.json({ revalidated: true })
  } catch (error) {
    return res.status(500).send('Error revalidating')
  }
}
