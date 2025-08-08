import { describe, it, expect, vi } from 'vitest';
import { Combat } from './src/combat.js';
import { Character } from './src/character.js';

describe('Combat System', () => {
    describe('Combat Initialization', () => {
        it('should initialize combat with two characters', () => {
            const player = new Character('Player');
            const enemy = new Character('Enemy');
            const combat = new Combat(player, enemy);
            
            expect(combat.player).toBe(player);
            expect(combat.enemy).toBe(enemy);
            expect(combat.turn).toBe(0);
            expect(combat.isActive).toBe(true);
        });

        it('should not allow combat with dead characters', () => {
            const player = new Character('Player');
            const enemy = new Character('Enemy');
            enemy.health = 0;
            
            expect(() => new Combat(player, enemy)).toThrow('Cannot start combat with dead character');
        });
    });

    describe('Turn Management', () => {
        it('should determine turn order based on agility', () => {
            const fastChar = new Character('Fast', { agility: 20 });
            const slowChar = new Character('Slow', { agility: 5 });
            const combat = new Combat(fastChar, slowChar);
            
            expect(combat.getFirstTurn()).toBe(fastChar);
        });

        it('should alternate turns correctly', () => {
            const player = new Character('Player');
            const enemy = new Character('Enemy');
            const combat = new Combat(player, enemy);
            
            expect(combat.getCurrentTurn()).toBe(player);
            combat.nextTurn();
            expect(combat.getCurrentTurn()).toBe(enemy);
        });

        it('should increment turn counter', () => {
            const combat = new Combat(new Character('P'), new Character('E'));
            combat.nextTurn();
            expect(combat.turn).toBe(1);
            combat.nextTurn();
            expect(combat.turn).toBe(2);
        });
    });

    describe('Combat Actions', () => {
        it('should execute attack action', () => {
            const player = new Character('Player');
            const enemy = new Character('Enemy');
            const combat = new Combat(player, enemy);
            
            const initialHealth = enemy.health;
            combat.attack(player, enemy);
            
            expect(enemy.health).toBeLessThan(initialHealth);
        });

        it('should handle critical hits', () => {
            const player = new Character('Player');
            const enemy = new Character('Enemy');
            const combat = new Combat(player, enemy);
            
            vi.spyOn(Math, 'random').mockReturnValue(0.95); // Force critical
            
            const damage = combat.calculateDamage(player, enemy, true);
            expect(damage).toBeGreaterThan(player.calculateDamage() * 1.5);
            
            Math.random.mockRestore();
        });

        it('should end combat when a character dies', () => {
            const player = new Character('Player');
            const enemy = new Character('Enemy');
            enemy.health = 10;
            const combat = new Combat(player, enemy);
            
            combat.attack(player, enemy);
            
            expect(combat.isActive).toBe(false);
            expect(combat.winner).toBe(player);
        });
    });

    describe('Combat Rewards', () => {
        it('should award experience to winner', () => {
            const player = new Character('Player');
            const enemy = new Character('Enemy');
            enemy.health = 10;
            const combat = new Combat(player, enemy);
            
            const initialExp = player.experience;
            combat.attack(player, enemy);
            
            expect(player.experience).toBeGreaterThan(initialExp);
        });

        it('should calculate experience based on enemy level', () => {
            const player = new Character('Player');
            const enemy = new Character('Enemy');
            enemy.level = 5;
            const combat = new Combat(player, enemy);
            
            const exp = combat.calculateExperience(enemy);
            expect(exp).toBe(150);
        });

        it('should drop items from enemy', () => {
            const player = new Character('Player');
            const enemy = new Character('Enemy');
            enemy.drops = [{ name: 'Gold', type: 'currency' }];
            enemy.health = 10;
            
            const combat = new Combat(player, enemy);
            combat.attack(player, enemy);
            
            expect(player.inventory.length).toBe(1);
            expect(player.inventory[0].name).toBe('Gold');
        });
    });
});

