import { describe, it, expect } from 'vitest';
import { Inventory } from './src/inventory.js';
import { Item } from './src/item.js';

describe('Inventory System', () => {
    describe('Inventory Management', () => {
        it('should create empty inventory', () => {
            const inventory = new Inventory();
            expect(inventory.items.length).toBe(0);
            expect(inventory.maxSlots).toBe(20);
            expect(inventory.usedSlots).toBe(0);
        });

        it('should add item to inventory', () => {
            const inventory = new Inventory();
            const sword = new Item('Iron Sword', 'weapon', 1);
            
            inventory.addItem(sword);
            expect(inventory.items).toContain(sword);
            expect(inventory.usedSlots).toBe(1);
        });

        it('should not exceed inventory limit', () => {
            const inventory = new Inventory(3);
            const items = [
                new Item('Item1', 'misc', 1),
                new Item('Item2', 'misc', 1),
                new Item('Item3', 'misc', 1),
                new Item('Item4', 'misc', 1)
            ];
            
            items.forEach(item => inventory.addItem(item));
            expect(inventory.items.length).toBe(3);
            expect(inventory.canAdd(items[3])).toBe(false);
        });

        it('should handle stackable items', () => {
            const inventory = new Inventory();
            const potion = new Item('Health Potion', 'consumable', 1, { stackable: true });
            
            inventory.addItem(potion);
            inventory.addItem(potion);
            
            expect(inventory.items.length).toBe(1);
            expect(inventory.items[0].quantity).toBe(2);
        });
    });

    describe('Item Management', () => {
        it('should remove item from inventory', () => {
            const inventory = new Inventory();
            const shield = new Item('Wooden Shield', 'armor', 2);
            
            inventory.addItem(shield);
            inventory.removeItem(shield);
            
            expect(inventory.items).not.toContain(shield);
            expect(inventory.usedSlots).toBe(0);
        });

        it('should find items by type', () => {
            const inventory = new Inventory();
            const sword = new Item('Sword', 'weapon', 1);
            const armor = new Item('Armor', 'armor', 3);
            const potion = new Item('Potion', 'consumable', 1);
            
            [sword, armor, potion].forEach(item => inventory.addItem(item));
            
            const weapons = inventory.getItemsByType('weapon');
            expect(weapons).toContain(sword);
            expect(weapons).not.toContain(armor);
        });

        it('should equip items', () => {
            const inventory = new Inventory();
            const character = { level: 5 };
            const sword = new Item('Legendary Sword', 'weapon', 1, {
                equipable: true,
                requirements: { level: 5 }
            });
            
            inventory.addItem(sword);
            const result = inventory.equipItem(sword, character);
            
            expect(result).toBe(true);
            expect(inventory.equipped.weapon).toBe(sword);
        });

        it('should check requirements before equipping', () => {
            const inventory = new Inventory();
            const character = { level: 3 };
            const sword = new Item('Advanced Sword', 'weapon', 1, {
                equipable: true,
                requirements: { level: 10 }
            });
            
            inventory.addItem(sword);
            const result = inventory.equipItem(sword, character);
            
            expect(result).toBe(false);
            expect(inventory.equipped.weapon).toBeUndefined();
        });
    });

    describe('Item Properties', () => {
        it('should calculate item value', () => {
            const item = new Item('Gold Ring', 'misc', 1, { value: 100 });
            expect(item.getValue()).toBe(100);
        });

        it('should apply item effects', () => {
            const potion = new Item('Health Potion', 'consumable', 1, {
                effects: { health: 50 }
            });
            
            const target = { health: 50, maxHealth: 100 };
            potion.use(target);
            
            expect(target.health).toBe(100);
        });

        it('should handle item durability', () => {
            const armor = new Item('Iron Armor', 'armor', 3, {
                durability: 100,
                maxDurability: 100
            });
            
            armor.takeDamage(20);
            expect(armor.durability).toBe(80);
            
            armor.repair();
            expect(armor.durability).toBe(100);
        });
    });
});

