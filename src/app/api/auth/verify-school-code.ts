// pages/api/auth/verify-school-code.js (or similar)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { schoolCode, schoolId } = req.body;

  try {
    // Query your database to check if the school code matches
    const school = await prisma.school.findFirst({
      where: {
        id: schoolId,
        schoolCode: schoolCode, // Your schoolCode column
      },
    });

    return res.status(200).json({ 
      isValid: !!school 
    });

  } catch (error) {
    console.error('Error verifying school code:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}