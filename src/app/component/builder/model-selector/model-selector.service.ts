import { Injectable } from '@angular/core';

import { ModelStats } from '../../model';

interface stats {
    abilities: Object,
    defense: number,
    lifePoints: number,
    melee?: Object,
    moraleBonus: number,
    range?: Object,
    skillBonus: number,
    skillList: string,
    talentList: string
};

@Injectable()
export class ModelSelectorService {
    private abilityList: string[] = ['agility', 'dexterity', 'endurance', 'knowledge', 'spirit', 'strength'];
    private abilityTiers: number[] = [10, 14, 20, 30];

    constructor() {}

    calculateStats(stats: ModelStats) {
        let ability: number = (stats.type === 'Hero') ? 8 : 6;
        let abilities: {agility?: number, dexterity?: number, endurance?: number, knowledge?: number, spirit?: number, strength?: number} = {};
        for (let abilityName of this.abilityList) {
            abilities[abilityName] = ability;
        }
        abilities = (<any>Object).assign(abilities, stats.abilities);

        let defense: number = (stats.shield === 'S' || stats.shield === 'AN') ? 5 : (stats.shield === 'L') ? 6 : 4;
        if (abilities.agility === 4) {
            defense = -1;
        } else {
            for (let i=0; this.abilityTiers.length > i; i++) {
                if (abilities.agility === this.abilityTiers[i]) {
                    defense = defense + i + 1;
                }
            }
        }

        let ratingBonus: number = 0;
        if (abilities.dexterity === 4) {
            ratingBonus = -1;
        } else {
            for (let i=0; this.abilityTiers.length > i; i++) {
                if (abilities.dexterity === this.abilityTiers[i]) {
                    ratingBonus = ratingBonus + i + 1;
                }
            }
        }

        let lifePoints: number = (stats.type === 'Hero') ? 2 : 1;
        if (stats.talents) {
            for (let talent of stats.talents) {
                if (['Leader', 'Tough'].indexOf(talent) > -1) {
                    lifePoints++;
                }
            }
        }
        if (abilities.endurance === 4) {
            lifePoints--;
        } else {
            for (let i=0; this.abilityTiers.length > i; i++) {
                if (abilities.endurance === this.abilityTiers[i]) {
                    lifePoints = lifePoints + i + 1;
                }
            }
        }

        let skillBonus: number = 0;
        if (abilities.knowledge === 4) {
            skillBonus = -1;
        } else {
            for (let i=0; this.abilityTiers.length > i; i++) {
                if (abilities.knowledge === this.abilityTiers[i]) {
                    skillBonus = skillBonus + i + 1;
                }
            }
        }

        let moraleBonus: number = 0;
        if (abilities.spirit === 4) {
            moraleBonus = -1;
        } else {
            for (let i=0; this.abilityTiers.length > i; i++) {
                if (abilities.spirit === this.abilityTiers[i]) {
                    moraleBonus = moraleBonus + i + 1;
                }
            }
        }

        let damageBonus: number = 0;
        if (abilities.strength === 4) {
            damageBonus = -1;
        } else {
            for (let i=0; this.abilityTiers.length > i; i++) {
                if (abilities.strength === this.abilityTiers[i]) {
                    damageBonus = damageBonus + i + 1;
                }
            }
        }

        let skillList: string;
        let talentList: string = '';
        if (stats.skills) {
            skillList = stats.skills.map(skill => `${skill.name} - d${skill.rating}`).join(', ');
        }
        if (stats.talents) {
            const talents = stats.talents.map((m) => {
                const count = stats.talents.reduce((sum, r) => (r === m) ? sum + 1 : sum, 0);
                return (count > 1) ? `${m}[${count}]` : m;
            });
            talentList = Array.from(new Set(talents)).join(', ');
        }
        
        let updatedStats: stats = {
            abilities,
            defense,
            lifePoints,
            moraleBonus,
            skillBonus,
            skillList,
            talentList
        };

        if (stats.melee) {
            let melee = stats.melee;
            for (let weapon of melee) {
                weapon.ratingBonus = ratingBonus;
                weapon.damageBonus = (weapon.damageBonus) ? damageBonus + weapon.damageBonus : damageBonus;
                if (weapon.abilities) {
                    weapon.abilityList = weapon.abilities.join(', ');
                }
            }
            updatedStats.melee = melee;
        }

        if (stats.range) {
            let range = stats.range;
            for (let weapon of range) {
                weapon.ratingBonus = ratingBonus;
                weapon.damageBonus = (weapon.damageBonus) ? damageBonus + weapon.damageBonus : damageBonus;
                if (weapon.abilities) {
                    weapon.abilityList = weapon.abilities.join(', ');
                }
            }
            updatedStats.range = range;
        }
        
        return updatedStats;
    }
}