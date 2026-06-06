import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => { res.json({ message: 'students route' }); });

export default router;
