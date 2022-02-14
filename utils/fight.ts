import { WarriorRecord } from '../records/warrior.record';

export const fight = (warrior1: WarriorRecord, warrior2:WarriorRecord): {
  log: string[];
  winner: WarriorRecord,
} => {
  const log: string[] = [];
  const warrior1TmpStats = {
    hp: warrior1.stamina * 10,
    dp: warrior1.defence,
    warrior: warrior1,
  };
  const warrior2TmpStats = {
    hp: warrior2.stamina * 10,
    dp: warrior2.defence,
    warrior: warrior2,
  };

  let attacker = warrior1TmpStats;
  let defender = warrior2TmpStats;

  do {
    const attackStrength = attacker.warrior.strength;
    log.push(`Atakuje ${attacker.warrior.name}`);

    if (defender.dp + defender.warrior.agility > attackStrength && defender.dp > 0) {
      defender.dp -= Math.ceil(attackStrength / defender.warrior.agility);
      if (defender.dp < 0) {
        defender.hp += Math.ceil((attackStrength + defender.dp) / defender.warrior.agility);
        log.push(`${defender.warrior.name} częściowo unika ciosu i zostaje mu ${defender.hp} życia`);
      } else {
        log.push(`${defender.warrior.name} łatwo odbija atak swoją tarczą`);
      }
    } else if (defender.dp + defender.warrior.agility > attackStrength && defender.dp < 0) {
      defender.hp -= Math.ceil(attackStrength / defender.warrior.agility);

      log.push(`${defender.warrior.name} częściowo unika ciosu i zostaje mu ${defender.hp} życia`);
    } else {
      defender.dp -= attackStrength;
      if (defender.dp < 0) {
        defender.hp += defender.dp;
        log.push(`${defender.warrior.name} otrzymuje cios i zostaje mu ${defender.hp} życia`);
      } else {
        log.push(`${defender.warrior.name} Przyjuje cios na tarczę`);
      }
    }
    [defender, attacker] = [attacker, defender];
  } while (attacker.hp > 0);

  const winner = defender.warrior;
  log.push(`Zwycięzcą jest ${winner.name} a ${attacker.warrior.name} wędruje do Valhalla`);
  return {
    log,
    winner,
  };
};
