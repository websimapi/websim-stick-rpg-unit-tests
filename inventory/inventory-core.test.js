import { describe, it, expect } from 'vitest';
import { Inventory } from '../src/inventory.js';
import { Item } from '../src/item.js';

describe('Inventory Core Tests', () => {
    describe('Basic Inventory Creation', () => {
        it('should create inventory with default slots', () => {
            const inventory = new Inventory();
            expect(inventory.maxSlots).toBe(20);
            expect(inventory.usedSlots).toBe(0);
        });

        it('should create inventory with custom slots', () => {
            const inventory = new Inventory(50);
            expect(inventory.maxSlots).toBe(50);
        });

        it('should throw error for invalid slot counts', () => {
            expect(() => new Inventory(0)).toThrow('Invalid slot count');
            expect(() => new Inventory(-1)).toThrow('Invalid slot count');
        });
    });

    describe('Basic Item Management', () => {
        it('should add items to inventory', () => {
            const inventory = new Inventory();
            const item = new Item('Sword', 'weapon', 2);
            
            const result = inventory.addItem(item);
            expect(result).toBe(true);
            expect(inventory.items.length).toBe(1);
            expect(inventory.usedSlots).toBe(2);
        });

        it('should prevent adding items when full', () => {
            const inventory = new Inventory(2);
            const largeItem = new Item('Armor', 'armor', 3);
            
            const result = inventory.addItem(largeItem);
            expect(result).toBe(false);
        });

        it('should remove items from inventory', () => {
            const inventory = new Inventory();
            const item = new Item('Potion', 'consumable', 1);
            inventory.addItem(item);
            
            const removed = inventory.removeItem(item);
            expect(removed).toBe(true);
            expect(inventory.items.length).toBe(0);
            expect(inventory.usedSlots).toBe(0);
        });
    });
});

