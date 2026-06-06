import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => { res.json({ message: 'subjects route' }); });

export default router;
