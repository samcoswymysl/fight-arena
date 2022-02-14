import { Router } from 'express';
import { WarriorRecord } from '../records/warrior.record';
import { ValidationError } from '../utils/errors';
import { fight } from '../utils/fight';

export const arenaRouter = Router();

arenaRouter
  .get('/', async (req, res) => {
    const warriors = await WarriorRecord.listAll();
    res.render('arena/fight-form.hbs', {
      warriors,
    });
  })

  .post('/', async (req, res, next) => {
    const {
      warrior1: warrior1Id,
      warrior2: warrior2Id,
    }: {
      warrior1: string,
      warrior2: string
    } = req.body;

    if (warrior1Id === warrior2Id) {
      throw new ValidationError('Musisz wybrać 2 różnych wojowników');
    }
    const warrior1 = await WarriorRecord.getOne(warrior1Id);
    const warrior2 = await WarriorRecord.getOne(warrior2Id);
    if (!warrior1 || !warrior2) {
      throw new ValidationError(`Nie znaleziono przeciwnika nr ${warrior1 ? 2 : 1}`);
    }

    const { log, winner } = fight(warrior1, warrior2);

    winner.wins! += 1;
    await winner.update();

    res.render('arena/fight.hbs', {
      log,
    });
  });
