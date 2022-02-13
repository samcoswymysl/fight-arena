import { Router } from 'express';

export const arenaRouter = Router();

arenaRouter
  .get('/', (req, res) => {
    res.render('arena/fight-form.hbs');
  })

  .post('/', (req, res) => {
    res.render('arena/fight.hbs');
  });
