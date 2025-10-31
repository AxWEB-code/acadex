import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { schoolCode, schoolId } = req.body;

  try {
    // This is a frontend API route - it should call your backend
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/schools/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        schoolCode,
        schoolId,
      }),
    });

    if (!backendResponse.ok) {
      return res.status(backendResponse.status).json({ isValid: false });
    }

    const data = await backendResponse.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Error verifying school code:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}