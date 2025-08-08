import { describe, it, expect } from 'vitest';
import { Inventory } from './src/inventory.js';
import { Item } from './src/item.js';

describe('Inventory System - Detailed', () => {
    describe('Inventory Management - Core', () => {
        it('should create empty inventory with default slots', () => {
            const inventory = new Inventory();
            expect(inventory.items).toEqual([]);
            expect(inventory.maxSlots).toBe(20);
            expect(inventory.usedSlots).toBe(0);
            expect(inventory.isEmpty()).toBe(true);
        });

        it('should create inventory with custom slot count', () => {
            const inventory = new Inventory(10);
            expect(inventory.maxSlots).toBe(10);
        });

        it('should prevent negative slot counts', () => {
            expect(() => new Inventory(-5)).toThrow('Invalid slot count');
        });

        it('should add single item correctly', () => {
            const inventory = new Inventory();
            const sword = new Item('Iron Sword', 'weapon', 1);
            
            const result = inventory.addItem(sword);
            
            expect(result).toBe(true);
            expect(inventory.items).toHaveLength(1);
            expect(inventory.items[0]).toBe(sword);
            expect(inventory.usedSlots).toBe(1);
            expect(inventory.isEmpty()).toBe(false);
        });

        it('should handle multiple item additions', () => {
            const inventory = new Inventory();
            const items = [
                new Item('Sword', 'weapon', 1),
                new Item('Shield', 'armor', 2),
                new Item('Potion', 'consumable', 1)
            ];
            
            items.forEach(item => inventory.addItem(item));
            
            expect(inventory.items).toHaveLength(3);
            expect(inventory.usedSlots).toBe(4);
        });

        it('should not exceed inventory capacity', () => {
            const inventory = new Inventory(2);
            const largeItem = new Item('Crate', 'misc', 3);
            
            const result = inventory.addItem(largeItem);
            
            expect(result).toBe(false);
            expect(inventory.items).toHaveLength(0);
            expect(inventory.usedSlots).toBe(0);
        });

        it('should check if item can be added', () => {
            const inventory = new Inventory(3);
            const item1 = new Item('Item1', 'misc', 2);
            const item2 = new Item('Item2', 'misc', 2);
            
            expect(inventory.canAdd(item1)).toBe(true);
            
            inventory.addItem(item1);
            expect(inventory.canAdd(item2)).toBe(false);
        });
    });

    describe('Stackable Items', () => {
        it('should stack identical items with stackable property', () => {
            const inventory = new Inventory();
            const potion = new Item('Health Potion', 'consumable', 1, { 
                stackable: true,
                maxStack: 10
            });
            
            inventory.addItem(potion);
            inventory.addItem(potion);
            
            expect(inventory.items).toHaveLength(1);
            expect(inventory.items[0].quantity).toBe(2);
            expect(inventory.usedSlots).toBe(1);
        });

        it('should respect max stack size', () => {
            const inventory = new Inventory();
            const potion = new Item('Health Potion', 'consumable', 1, { 
                stackable: true,
                maxStack: 5
            });
            
            for (let i = 0; i < 7; i++) {
                inventory.addItem(potion);
            }
            
            expect(inventory.items).toHaveLength(2);
            expect(inventory.items[0].quantity).toBe(5);
            expect(inventory.items[1].quantity).toBe(2);
        });

        it('should not stack non-stackable items', () => {
            const inventory = new Inventory();
            const sword = new Item('Iron Sword', 'weapon', 1, { stackable: false });
            
            inventory.addItem(sword);
            inventory.addItem(sword);
            
            expect(inventory.items).toHaveLength(2);
            expect(inventory.items[0].quantity).toBe(1);
            expect(inventory.items[1].quantity).toBe(1);
            expect(inventory.usedSlots).toBe(2);
        });
    });

    describe('Item Removal', () => {
        it('should remove item from inventory', () => {
            const inventory = new Inventory();
            const item = new Item('Test Item', 'misc', 1);
            
            inventory.addItem(item);
            const result = inventory.removeItem(item);
            
            expect(result).toBe(true);
            expect(inventory.items).toHaveLength(0);
            expect(inventory.usedSlots).toBe(0);
        });

        it('should handle removal of non-existent item', () => {
            const inventory = new Inventory();
            const item1 = new Item('Item1', 'misc', 1);
            const item2 = new Item('Item2', 'misc', 1);
            
            inventory.addItem(item1);
            const result = inventory.removeItem(item2);
            
            expect(result).toBe(false);
            expect(inventory.items).toHaveLength(1);
        });

        it('should remove by item ID', () => {
            const inventory = new Inventory();
            const item = new Item('Test Item', 'misc', 1);
            item.id = 'test123';
            
            inventory.addItem(item);
            const result = inventory.removeItemById('test123');
            
            expect(result).toBe(true);
            expect(inventory.items).toHaveLength(0);
        });

        it('should remove by index', () => {
            const inventory = new Inventory();
            const item1 = new Item('Item1', 'misc', 1);
            const item2 = new Item('Item2', 'misc', 1);
            
            inventory.addItem(item1);
            inventory.addItem(item2);
            
            const removed = inventory.removeItemAt(0);
            
            expect(removed).toBe(item1);
            expect(inventory.items).toHaveLength(1);
            expect(inventory.items[0]).toBe(item2);
        });
    });

    describe('Item Queries', () => {
        it('should find items by type', () => {
            const inventory = new Inventory();
            const sword = new Item('Sword', 'weapon', 1);
            const armor = new Item('Armor', 'armor', 3);
            const potion = new Item('Potion', 'consumable', 1);
            
            [sword, armor, potion].forEach(item => inventory.addItem(item));
            
            const weapons = inventory.getItemsByType('weapon');
            const armors = inventory.getItemsByType('armor');
            
            expect(weapons).toHaveLength(1);
            expect(weapons[0]).toBe(sword);
            expect(armors).toHaveLength(1);
            expect(armors[0]).toBe(armor);
        });

        it('should find items by name', () => {
            const inventory = new Inventory();
            const sword1 = new Item('Iron Sword', 'weapon', 1);
            const sword2 = new Item('Steel Sword', 'weapon', 1);
            
            inventory.addItem(sword1);
            inventory.addItem(sword2);
            
            const results = inventory.findItems('sword');
            expect(results).toHaveLength(2);
        });

        it('should get item count by type', () => {
            const inventory = new Inventory();
            
            inventory.addItem(new Item('Sword1', 'weapon', 1));
            inventory.addItem(new Item('Sword2', 'weapon', 1));
            inventory.addItem(new Item('Potion', 'consumable', 1));
            
            expect(inventory.getItemCountByType('weapon')).toBe(2);
            expect(inventory.getItemCountByType('consumable')).toBe(1);
        });

        it('should check if inventory contains item type', () => {
            const inventory = new Inventory();
            inventory.addItem(new Item('Sword', 'weapon', 1));
            
            expect(inventory.hasItemType('weapon')).toBe(true);
            expect(inventory.hasItemType('armor')).toBe(false);
        });
    });

    describe('Equipment Management', () => {
        it('should equip weapon', () => {
            const inventory = new Inventory();
            const character = { level: 1 };
            const sword = new Item('Sword', 'weapon', 1, {
                equipable: true,
                slot: 'weapon',
                requirements: { level: 1 }
            });
            
            inventory.addItem(sword);
            const result = inventory.equipItem(sword, character);
            
            expect(result).toBe(true);
            expect(inventory.equipped.weapon).toBe(sword);
        });

        it('should unequip item', () => {
            const inventory = new Inventory();
            const character = { level: 1 };
            const sword = new Item('Sword', 'weapon', 1, {
                equipable: true,
                slot: 'weapon',
                requirements: { level: 1 }
            });
            
            inventory.addItem(sword);
            inventory.equipItem(sword, character);
            inventory.unequipItem('weapon');
            
            expect(inventory.equipped.weapon).toBeUndefined();
        });

        it('should prevent equipping without requirements', () => {
            const inventory = new Inventory();
            const character = { level: 1 };
            const sword = new Item('Advanced Sword', 'weapon', 1, {
                equipable: true,
                slot: 'weapon',
                requirements: { level: 10 }
            });
            
            inventory.addItem(sword);
            const result = inventory.equipItem(sword, character);
            
            expect(result).toBe(false);
            expect(inventory.equipped.weapon).toBeUndefined();
        });

        it('should auto-unequip when equipping new item', () => {
            const inventory = new Inventory();
            const character = { level: 1 };
            const sword1 = new Item('Sword1', 'weapon', 1, {
                equipable: true,
                slot: 'weapon',
                requirements: { level: 1 }
            });
            const sword2 = new Item('Sword2', 'weapon', 1, {
                equipable: true,
                slot: 'weapon',
                requirements: { level: 1 }
            });
            
            inventory.addItem(sword1);
            inventory.addItem(sword2);
            
            inventory.equipItem(sword1, character);
            expect(inventory.equipped.weapon).toBe(sword1);
            
            inventory.equipItem(sword2, character);
            expect(inventory.equipped.weapon).toBe(sword2);
            expect(inventory.items).toContain(sword1);
        });
    });

    describe('Inventory State', () => {
        it('should get total item value', () => {
            const inventory = new Inventory();
            inventory.addItem(new Item('Gold Ring', 'misc', 1, { value: 100 }));
            inventory.addItem(new Item('Silver Ring', 'misc', 1, { value: 50 }));
            
            expect(inventory.getTotalValue()).toBe(150);
        });

        it('should get inventory weight', () => {
            const inventory = new Inventory();
            inventory.addItem(new Item('Heavy Item', 'misc', 3));
            inventory.addItem(new Item('Light Item', 'misc', 1));
            
            expect(inventory.getTotalWeight()).toBe(4);
        });

        it('should serialize inventory', () => {
            const inventory = new Inventory();
            const item = new Item('Test', 'misc', 1);
            inventory.addItem(item);
            
            const data = inventory.serialize();
            expect(data.items).toHaveLength(1);
            expect(data.maxSlots).toBe(20);
        });

        it('should deserialize inventory', () => {
            const inventory = new Inventory();
            const data = {
                items: [{ name: 'Test', type: 'misc', slots: 1 }],
                maxSlots: 15,
                equipped: {}
            };
            
            inventory.deserialize(data);
            expect(inventory.maxSlots).toBe(15);
            expect(inventory.items).toHaveLength(1);
        });
    });
});