import { describe, it, expect } from 'vitest';
import { Inventory } from '../src/inventory.js';
import { Item } from '../src/item.js';

describe('Inventory Equipment Tests', () => {
    describe('Equipment Basics', () => {
        it('should equip items to slots', () => {
            const inventory = new Inventory();
            const sword = new Item('Iron Sword', 'weapon', 2, {
                equipable: true,
                slot: 'weapon'
            });
            
            inventory.addItem(sword);
            const result = inventory.equipItem(sword, {});
            
            expect(result).toBe(true);
            expect(inventory.equipped.weapon).toBe(sword);
        });

        it('should prevent equipping items with level requirements', () => {
            const inventory = new Inventory();
            const epicSword = new Item('Epic Sword', 'weapon', 2, {
                equipable: true,
                slot: 'weapon',
                requirements: { level: 25 }
            });
            
            inventory.addItem(epicSword);
            const result = inventory.canEquipItem(epicSword, { level: 10 });
            
            expect(result).toBe(false);
        });

        it('should calculate equipment bonuses', () => {
            const inventory = new Inventory();
            const armor = new Item('Steel Armor', 'armor', 4, {
                equipable: true,
                slot: 'chest',
                stats: { defense: 15 }
            });
            
            inventory.addItem(armor);
            inventory.equipItem(armor, {});
            
            expect(inventory.getEquippedStats().defense).toBe(15);
        });
    });

    describe('Equipment Sets', () => {
        it('should detect equipment set bonuses', () => {
            const inventory = new Inventory();
            const helmet = new Item('Iron Helmet', 'armor', 2, {
                equipable: true,
                slot: 'helmet',
                setBonus: { 'iron_set': 1 }
            });
            const chest = new Item('Iron Chest', 'armor', 4, {
                equipable: true,
                slot: 'chest',
                setBonus: { 'iron_set': 2 }
            });
            
            inventory.addItem(helmet);
            inventory.addItem(chest);
            inventory.equipItem(helmet, {});
            inventory.equipItem(chest, {});
            
            expect(inventory.getSetBonus('iron_set')).toBe(3);
        });
    });
});

