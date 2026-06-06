import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => { res.json({ message: 'streams route' }); });

export default router;
