import { describe, it, expect } from 'vitest';
import { Character } from './src/character.js';
import { Stats } from './src/stats.js';

describe('Character', () => {
    describe('Creation - Edge Cases', () => {
        it('should throw error for null name', () => {
            expect(() => new Character(null)).toThrow('Character name cannot be empty');
        });

        it('should throw error for undefined name', () => {
            expect(() => new Character(undefined)).toThrow('Character name cannot be empty');
        });

        it('should throw error for whitespace-only name', () => {
            expect(() => new Character('   ')).toThrow('Character name cannot be empty');
        });

        it('should handle very long names', () => {
            const longName = 'a'.repeat(100);
            const character = new Character(longName);
            expect(character.name).toBe(longName);
        });

        it('should handle unicode names', () => {
            const character = new Character('🗡️ Warrior ⚔️');
            expect(character.name).toBe('🗡️ Warrior ⚔️');
        });

        it('should create character with null stats', () => {
            const character = new Character('Test', null);
            expect(character.stats).toBeDefined();
            expect(character.stats.strength).toBe(1);
        });

        it('should create character with extremely high stats', () => {
            const stats = new Stats(999, 999, 999, 999);
            const character = new Character('Overpowered', stats);
            expect(character.stats.strength).toBe(999);
        });

        it('should create character with zero stats', () => {
            const stats = new Stats(0, 0, 0, 0);
            const character = new Character('Weakling', stats);
            expect(character.health).toBe(1); // Minimum health
        });

        it('should handle negative stat values', () => {
            const stats = new Stats(-5, -3, -2, -1);
            const character = new Character('Cursed', stats);
            expect(character.health).toBe(1); // Should not go below 1
        });
    });

    describe('Leveling - Detailed Progression', () => {
        it('should handle multiple level ups from large experience gain', () => {
            const character = new Character('Rapid');
            character.gainExperience(550); // Should level up from 1->2, 2->3 (needs 300 total)
            
            expect(character.level).toBe(3);
            expect(character.experience).toBe(50);
            expect(character.maxHealth).toBe(120);
        });

        it('should handle max level cap', () => {
            const character = new Character('Maxed');
            character.level = 99;
            character.gainExperience(1000000);
            
            expect(character.level).toBe(100);
            expect(character.experience).toBe(0);
        });

        it('should calculate experience requirements for very high levels', () => {
            const character = new Character('Elite');
            character.level = 50;
            expect(character.getExperienceNeeded()).toBe(5000);
        });

        it('should handle fractional experience', () => {
            const character = new Character('Fractional');
            character.gainExperience(99.9);
            character.gainExperience(0.1);
            
            expect(character.level).toBe(2);
            expect(character.experience).toBe(0);
        });

        it('should not level down when losing experience', () => {
            const character = new Character('Descending');
            character.level = 5;
            character.experience = 50;
            character.loseExperience(100);
            
            expect(character.level).toBe(5);
            expect(character.experience).toBe(0);
        });

        it('should provide stat increases per level', () => {
            const character = new Character('Growth');
            const initialStats = { ...character.stats };
            
            character.gainExperience(100);
            
            expect(character.stats.strength).toBeGreaterThan(initialStats.strength);
        });
    });

    describe('Combat - Advanced Scenarios', () => {
        it('should handle damage that exceeds health', () => {
            const character = new Character('Test');
            character.takeDamage(200);
            
            expect(character.health).toBe(0);
            expect(character.isAlive()).toBe(false);
        });

        it('should handle healing beyond max health', () => {
            const character = new Character('Test');
            character.health = 50;
            character.heal(100);
            
            expect(character.health).toBe(100);
        });

        it('should handle negative healing', () => {
            const character = new Character('Test');
            character.health = 50;
            character.heal(-20);
            
            expect(character.health).toBe(50);
        });

        it('should calculate damage with defense calculation', () => {
            const attacker = new Character('Atk', new Stats(20, 5, 10, 5));
            const defender = new Character('Def', new Stats(5, 15, 10, 5));
            
            const damage = attacker.calculateDamage();
            const actualDamage = Math.max(damage - defender.stats.defense, 1);
            
            expect(actualDamage).toBeLessThan(damage);
            expect(actualDamage).toBeGreaterThan(0);
        });

        it('should handle critical hits with multiplier', () => {
            const character = new Character('Critical', new Stats(10, 5, 20, 5));
            const baseDamage = character.calculateDamage();
            const critDamage = character.calculateDamage(true);
            
            expect(critDamage).toBe(baseDamage * 2);
        });

        it('should handle elemental damage calculations', () => {
            const character = new Character('Wizard', new Stats(5, 5, 5, 15));
            const elementalDamage = character.calculateElementalDamage('fire', 15);
            
            expect(elementalDamage).toBe(30); // 15 + (15 * intelligence modifier)
        });

        it('should handle status effects in combat', () => {
            const character = new Character('Poisoned');
            character.applyStatus('poison', 5);
            const initialHealth = character.health;
            
            character.updateStatusEffects();
            
            expect(character.health).toBeLessThan(initialHealth);
            expect(character.getStatusDuration('poison')).toBe(4);
        });

        it('should handle multiple simultaneous status effects', () => {
            const character = new Character('Debuffed');
            character.applyStatus('poison', 3);
            character.applyStatus('burn', 2);
            character.applyStatus('freeze', 1);
            
            expect(character.statusEffects.length).toBe(3);
            expect(character.getStatusDuration('poison')).toBe(3);
        });
    });

    describe('Inventory - Complex Management', () => {
        it('should handle inventory with identical items', () => {
            const character = new Character('Collector');
            const item = { name: 'Gold Coin', type: 'currency', stackable: true };
            
            for (let i = 0; i < 100; i++) {
                character.addItem(item);
            }
            
            expect(character.inventory.length).toBe(1);
            expect(character.inventory[0].quantity).toBe(100);
        });

        it('should find items by type recursively', () => {
            const character = new Character('Organized');
            const sword = { name: 'Sword', type: 'weapon' };
            const shield = { name: 'Shield', type: 'weapon' };
            const potion = { name: 'Potion', type: 'consumable' };
            
            [sword, shield, potion].forEach(item => character.addItem(item));
            
            const weapons = character.findItemsByType('weapon');
            expect(weapons).toHaveLength(2);
            expect(weapons).toContain(sword);
            expect(weapons).toContain(shield);
        });

        it('should handle item degradation over time', () => {
            const character = new Character('User');
            const sword = { name: 'Damaged Sword', type: 'weapon', durability: 100 };
            
            character.addItem(sword);
            for (let i = 0; i < 3; i++) {
                character.useItem(sword);
            }
            
            expect(sword.durability).toBe(97);
            expect(sword.condition).toBe('excellent');
        });

        it('should handle inventory sorting by name/type/value', () => {
            const character = new Character('Sorter');
            const items = [
                { name: 'Z', type: 'misc', value: 100 },
                { name: 'A', type: 'weapon', value: 50 },
                { name: 'M', type: 'shield', value: 200 }
            ];
            
            items.forEach(item => character.addItem(item));
            character.sortInventory('name');
            
            expect(character.inventory[0].name).toBe('A');
            expect(character.inventory[2].name).toBe('Z');
        });

        it('should handle inventory overflow with priority removal', () => {
            const character = new Character('LimitedSpace');
            character.inventoryLimit = 3;
            
            const valuable = { name: 'Diamond', value: 1000 };
            const cheap = { name: 'Rock', value: 1 };
            
            character.addItem(cheap);
            character.addItem(valuable);
            
            expect(character.inventory).toHaveLength(2);
            expect(character.inventory).toContain(valuable);
        });

        it('should prevent adding null/undefined items', () => {
            const character = new Character('Careful');
            
            expect(() => character.addItem(null)).toThrow('Cannot add null item');
            expect(() => character.addItem(undefined)).toThrow('Cannot add null item');
        });

        it('should update character stats when equipping items', () => {
            const character = new Character('Equipped');
            const sword = { name: 'Power Sword', type: 'weapon', damage: 25 };
            const armor = { name: 'Steel Armor', type: 'armor', defense: 20 };
            
            character.equip(sword);
            character.equip(armor);
            
            expect(character.equipment.weapon).toBe(sword);
            expect(character.damageModifier).toBe(25);
            expect(character.defenseModifier).toBe(20);
        });
    });

    describe('Character States - Edge Behavior', () => {
        it('should handle near-death state with 1 HP', () => {
            const character = new Character('NearDeath');
            character.health = 1;
            character.takeDamage(0.5);
            
            expect(character.health).toBe(0.5);
            expect(character.isAlive()).toBe(true);
        });

        it('should handle mana/energy drain states', () => {
            const character = new Character('Caster', new Stats(5, 5, 5, 15));
            character.mana = 100;
            character.castSpell('fireball', 40);
            
            expect(character.mana).toBe(60);
        });

        it('should handle character sleep/fatigue cycle', () => {
            const character = new Character('Tired');
            character.fatigue = 100;
            character.sleep(8);
            
            expect(character.fatigue).toBe(0);
            expect(character.isWellRested).toBe(true);
        });

        it('should handle character hunger system', () => {
            const character = new Character('Hungry');
            character.hunger = 0;
            character.passTime(100); // 100 minutes
            
            expect(character.hunger).toBeGreaterThan(0);
            expect(character.characterHungerPenalty()).toBeGreaterThan(0);
        });

        it('should handle resurrecting dead character', () => {
            const character = new Character('Resurrected');
            character.health = 0;
            character.resurrect();
            
            expect(character.health).toBe(character.maxHealth * 0.1);
            expect(character.isAlive()).toBe(true);
            expect(character.hasResurrectionSickness).toBe(true);
        });
    });

    describe('Character Relationships and Party System', () => {
        it('should handle character reputation with factions', () => {
            const character = new Character('Politician');
            character.adjustFactionReputation('town', 50);
            character.adjustFactionReputation('bandits', -25);
            
            expect(character.getFactionReputation('town')).toBe(50);
            expect(character.getFactionReputation('bandits')).toBe(-25);
        });

        it('should handle character party membership', () => {
            const leader = new Character('Leader');
            const follower = new Character('Follower');
            
            leader.addToParty(follower);
            
            expect(leader.party.members).toHaveLength(1);
            expect(follower.partyLeader).toBe(leader);
        });

        it('should prevent circular party invites', () => {
            const c1 = new Character('A');
            const c2 = new Character('B');
            const c3 = new Character('C');
            
            c1.addToParty(c2);
            c2.addToParty(c3);
            const result = c3.addToParty(c1); // Should fail
            
            expect(result).toBe(false);
        });

        it('should handle character trading with gold/money', () => {
            const merchant = new Character('Merchant');
            const buyer = new Character('Buyer');
            buyer.gold = 1000;
            
            const item = { name: 'Magic Item', value: 500 };
            merchant.inventory = [item];
            
            buyer.purchaseFrom(merchant, item);
            
            expect(buyer.gold).toBe(500);
            expect(merchant.gold).toBe(500);
            expect(buyer.inventory).toContain(item);
        });
    });

    describe('Character Serialization - Save/Load', () => {
        it('should serialize complete character state', () => {
            const character = new Character('SaveTest', new Stats(10, 8, 6, 4));
            character.level = 5;
            character.experience = 250;
            character.health = 75;
            character.addItem({ name: 'Sword', type: 'weapon' });
            
            const saveData = character.serialize();
            expect(saveData.name).toBe('SaveTest');
            expect(saveData.level).toBe(5);
            expect(saveData.inventory).toHaveLength(1);
        });

        it('should deserialize character with all attributes', () => {
            const data = {
                name: 'Loaded',
                level: 10,
                experience: 999,
                health: 50,
                stats: { strength: 20, defense: 15, agility: 12, intelligence: 8 },
                inventory: [{ name: 'Magic Sword', type: 'weapon' }]
            };
            
            const character = Character.deserialize(data);
            expect(character.name).toBe('Loaded');
            expect(character.level).toBe(10);
            expect(character.inventory.length).toBe(1);
        });

        it('should handle corrupted save data gracefully', () => {
            const corruptedData = null;
            const character = Character.deserialize(corruptedData);
            
            expect(character).toBeNull();
        });

        it('should maintain character UUID across saves', () => {
            const character = new Character('Persistent');
            const id = character.id;
            
            const saveData = character.serialize();
            const newCharacter = Character.deserialize(saveData);
            
            expect(newCharacter.id).toBe(id);
        });
    });
});