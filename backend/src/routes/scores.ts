import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import prisma from '../prisma';

const router = Router();

// Bulk batch upsert for spreadsheet commits
router.post('/batch', authenticate, requireRole(['TEACHER', 'CLASS_TEACHER', 'SCHOOL_ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  try {
    const { scores } = req.body; 
    // scores: { studentId: string, assessmentId: string, score: number }[]

    if (!Array.isArray(scores)) {
      return res.status(400).json({ message: 'Scores must be an array' });
    }

    // Process each score. In a real scenario we'd do a batch upsert, but Prisma's createMany doesn't support ON CONFLICT well across all DBs without raw SQL.
    // We'll use a transaction of upserts.
    const result = await prisma.$transaction(async (tx) => {
      let count = 0;
      for (const item of scores) {
        // Validate score against maxScore (we should ideally fetch assessments first)
        const assessment = await tx.assessment.findUnique({ where: { id: item.assessmentId } });
        if (!assessment) continue;
        
        if (item.score < 0 || item.score > assessment.maxScore) {
          throw new Error(`Invalid score for student ${item.studentId}. Score must be between 0 and ${assessment.maxScore}`);
        }

        await tx.studentScore.upsert({
          where: {
            studentId_assessmentId: {
              studentId: item.studentId,
              assessmentId: item.assessmentId
            }
          },
          update: { score: item.score },
          create: {
            studentId: item.studentId,
            assessmentId: item.assessmentId,
            score: item.score
          }
        });
        count++;
      }
      return count;
    });

    res.json({ message: 'Scores saved successfully', count: result });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to save scores' });
  }
});

router.get('/', authenticate, async (req, res) => {
  const { studentId, assessmentId } = req.query;
  const where: any = {};
  if (studentId) where.studentId = String(studentId);
  if (assessmentId) where.assessmentId = String(assessmentId);

  try {
    const scores = await prisma.studentScore.findMany({ where });
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

export default router;
