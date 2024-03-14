import express, { Response, Request, Router } from 'express';

import { StatusCodes } from 'http-status-codes';

const router: Router = express.Router();

export function healterouter(): Router {
  router.get('/health-router', (_req: Request, res: Response) => {
    res.status(StatusCodes.OK).send('birinchi router');
  });
  return router;
}
