import { describe, it, expect } from 'vitest';
import { Character } from './src/character.js';
import { Stats } from './src/stats.js';

describe('Character', () => {
    describe('Creation', () => {
        it('should create a character with default stats', () => {
            const character = new Character('Stickman');
            expect(character.name).toBe('Stickman');
            expect(character.level).toBe(1);
            expect(character.experience).toBe(0);
            expect(character.health).toBe(100);
            expect(character.maxHealth).toBe(100);
        });

        it('should create a character with custom stats', () => {
            const stats = new Stats(10, 5, 8, 3);
            const character = new Character('Custom', stats);
            expect(character.stats.strength).toBe(10);
            expect(character.stats.defense).toBe(5);
            expect(character.stats.agility).toBe(8);
            expect(character.stats.intelligence).toBe(3);
        });

        it('should not allow empty character name', () => {
            expect(() => new Character('')).toThrow('Character name cannot be empty');
        });
    });

    describe('Leveling', () => {
        it('should level up when reaching experience threshold', () => {
            const character = new Character('Stickman');
            character.gainExperience(100);
            expect(character.level).toBe(2);
            expect(character.experience).toBe(0);
            expect(character.maxHealth).toBe(110);
        });

        it('should calculate experience needed for next level', () => {
            const character = new Character('Stickman');
            expect(character.getExperienceNeeded()).toBe(100);
            character.level = 5;
            expect(character.getExperienceNeeded()).toBe(500);
        });
    });

    describe('Combat', () => {
        it('should take damage correctly', () => {
            const character = new Character('Stickman');
            character.takeDamage(30);
            expect(character.health).toBe(70);
        });

        it('should die when health reaches zero', () => {
            const character = new Character('Stickman');
            character.takeDamage(100);
            expect(character.isAlive()).toBe(false);
        });

        it('should deal damage based on strength', () => {
            const stats = new Stats(15, 5, 8, 3);
            const character = new Character('Warrior', stats);
            const damage = character.calculateDamage();
            expect(damage).toBeGreaterThan(10);
        });
    });

    describe('Inventory', () => {
        it('should add items to inventory', () => {
            const character = new Character('Stickman');
            const item = { name: 'Sword', type: 'weapon' };
            character.addItem(item);
            expect(character.inventory.length).toBe(1);
            expect(character.inventory[0]).toBe(item);
        });

        it('should not exceed inventory limit', () => {
            const character = new Character('Stickman');
            character.inventoryLimit = 3;
            for (let i = 0; i < 5; i++) {
                character.addItem({ name: `Item${i}`, type: 'misc' });
            }
            expect(character.inventory.length).toBe(3);
        });

        it('should remove items from inventory', () => {
            const character = new Character('Stickman');
            const item = { name: 'Potion', type: 'consumable' };
            character.addItem(item);
            character.removeItem(item);
            expect(character.inventory.length).toBe(0);
        });
    });
});

