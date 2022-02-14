import { Router } from 'express';
import { WarriorRecord } from '../records/warrior.record';

export const hallOfGloryRouter = Router();

hallOfGloryRouter
  .get('/', async (req, res, next) => {
    const warriors = (
      await WarriorRecord.listTop(10)
    ).map((warrior, index) => ({
      place: index + 1,
      ...warrior,
    }));

    res.render('hall-of-glory/hall-of-glory.hbs', {
      warriors,

    });
  });
