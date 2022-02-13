import { v4 as uuid } from 'uuid';
import { FieldPacket } from 'mysql2';
import { pool } from '../utils/db';
import { ValidationError } from '../utils/errors';

type WarriorRecordResult = [WarriorRecord[], FieldPacket[]];

export class WarriorRecord {
  public id?: string;
  /**
        name must be unique
     */
  public readonly name: string;
  public readonly strength: number;
  public readonly defence: number;
  public readonly stamina: number;
  public readonly agility: number;
  public wins?: number;

  constructor(obj: Omit<WarriorRecord, 'validate' | 'update' | 'insert'>) {
    const {
      id, name, strength, defence, stamina, agility, wins,
    } = obj;

    this.validate(name, strength, defence, stamina, agility);

    this.id = id ?? uuid();
    this.name = name;
    this.strength = strength;
    this.defence = defence;
    this.stamina = stamina;
    this.agility = agility;
    this.wins = wins ?? 0;
  }

  // eslint-disable-next-line class-methods-use-this,max-len
  private validate(name: string, strength: number, defence: number, stamina: number, agility: number) {
    const statsArr = [strength, defence, stamina, agility];
    const statSum = statsArr.reduce((prev, curr) => prev + curr, 0);
    if (statSum !== 10) throw new ValidationError(`Suma statystyk musi wynosić 10 a w tj chwili jest to ${statSum}`);

    statsArr.forEach((stat) => {
      if (stat < 1) {
        throw new ValidationError('Każda z umiejętności musi wynosić co najmniej 1');
      }
    });

    if (name.length < 3 && name.length > 74) throw new ValidationError(`Imie musi mieć od 3 do 74 znaków aktualnie ma ${name.length}`);
  }

  async insert(): Promise<string> {
    await pool.execute('INSERT INTO  `warriors` (`id`, `name`, `strength`, `defence`, `stamina`, `agility`, `wins`) VALUES (:id, :name, :strength, :defence, :stamina, :agility, :wins)', {
      id: this.id,
      name: this.name,
      strength: this.strength,
      defence: this.defence,
      stamina: this.stamina,
      agility: this.agility,
      wins: this.wins,
    });

    return this.id!;
  }

  async update(): Promise<void> {
    await pool.execute('UPDATE `warriors` SET  `wins` = :wins WHERE  `id` = :id', {
      id: this.id,
      wins: this.wins,
    });
  }

  static async getOne(id: string): Promise<WarriorRecord | null> {
    const [[results]] = await pool.execute('SELECT * FROM `warriors` WHERE  `id` = :id', {
      id,
    }) as WarriorRecordResult;
    return results ? null : new WarriorRecord(results);
  }

  static async getOneByName(name: string): Promise<boolean> {
    const [results] = await pool.execute('SELECT  `name` FROM `warriors` WHERE  `name` = :name', {
      name,
    }) as WarriorRecordResult;
    return !!results.length;
  }

  static async listAll(): Promise<WarriorRecord[]> {
    const [results] = await pool.execute('SELECT * FROM `warriors` WHERE  1') as WarriorRecordResult;

    return results.map((result) => new WarriorRecord(result));
  }

  static async listTop(topCount: number): Promise<WarriorRecord[]> {
    const [results] = await pool.execute('SELECT * FROM `warriors` ORDER BY  `wins` DESC LIMIT  :topCount', {
      topCount,
    }) as WarriorRecordResult;

    return results.map((result) => new WarriorRecord(result));
  }
}
