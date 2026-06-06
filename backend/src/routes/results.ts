import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { GradingEngine } from '../services/GradingEngine';
import prisma from '../prisma';

const router = Router();

// Trigger recalculation
router.post('/calculate', authenticate, requireRole(['SCHOOL_ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  try {
    const { streamId, academicYearId, term } = req.body;

    if (!streamId || !academicYearId || !term) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await GradingEngine.processStreamResults(streamId, academicYearId, term);

    res.json({ message: 'Results calculated successfully', processedCount: result.processedCount });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to calculate results' });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const results = await prisma.studentResult.findMany({
      include: {
        student: true,
        subject: true
      }
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

export default router;
