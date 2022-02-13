import { NextFunction, Request, Response } from 'express';

export class ValidationError extends Error {}

export const handleError = (er: Error, req: Request, res: Response, next:NextFunction): void => {
  console.error(er);

  res
    .status(er instanceof ValidationError ? 400 : 500)
    .render('error.hbs', {
      message: er instanceof ValidationError ? er.message : 'Przepraszamy spróbój później',
    });
};
