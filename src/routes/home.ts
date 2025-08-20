import { Router } from 'express';
import { Request, Response } from 'express';
const homeRouter = Router();

homeRouter.get('/home', (req: Request, res: Response) => {
    res.json({ message: `Welcome, ${req.user?.name}. This is our protected area.` });
});

export { homeRouter };