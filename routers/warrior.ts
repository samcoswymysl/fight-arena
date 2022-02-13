import { Router } from 'express';
import { WarriorRecord } from '../records/warrior.record';
import { ValidationError } from '../utils/errors';

export const warriorRouter = Router();

warriorRouter
  .get('/', (req, res, next) => {
    res.render('warrior/add-form.hbs');
  })
  .post('/', async (req, res, next) => {
    const {
      name,
      strength,
      defence,
      stamina,
      agility,
    } = req.body as {
      name: string;
      strength: string;
      defence:string;
      stamina: string;
      agility: string;
    };

    if (await WarriorRecord.getOneByName(name)) {
      throw new ValidationError(`Wojownik o imieniu ${name} już istnieje wybierz inne imię`);
    }

    const warrior = new WarriorRecord({
      name: String(name),
      agility: Number(agility),
      defence: Number(defence),
      stamina: Number(stamina),
      strength: Number(strength),
    });

    const id = await warrior.insert();

    res.render('warrior/warrior-added.hbs', {
      name: warrior.name,
      id,
    });
  });
