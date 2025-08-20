import { Router } from 'express';
import { Request, Response } from 'express';
const homeRouter = Router();

homeRouter.get('/home', (req: Request, res: Response) => {
    res.json({ message: `Welcome, ${(req as any).user.name}. This is our protected area.` });
});

export { homeRouter };