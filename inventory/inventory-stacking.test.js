import { describe, it, expect } from 'vitest';
import { Inventory } from '../src/inventory.js';
import { Item } from '../src/item.js';

describe('Inventory Stacking Tests', () => {
    describe('Stackable Items', () => {
        it('should stack similar items', () => {
            const inventory = new Inventory();
            const potion = new Item('Health Potion', 'consumable', 1, { 
                stackable: true, 
                maxStack: 10 
            });
            
            inventory.addItem(potion);
            inventory.addItem(potion);
            
            expect(inventory.items.length).toBe(1);
            expect(inventory.items[0].quantity).toBe(2);
        });

        it('should respect max stack limits', () => {
            const inventory = new Inventory();
            const coins = new Item('Gold Coin', 'currency', 1, {
                stackable: true,
                maxStack: 100
            });
            
            coins.quantity = 150;
            inventory.addItem(coins);
            
            expect(inventory.items.length).toBe(2);
            expect(inventory.items[0].quantity).toBe(100);
            expect(inventory.items[1].quantity).toBe(50);
        });

        it('should split stacks correctly', () => {
            const inventory = new Inventory();
            const arrows = new Item('Arrow', 'ammo', 1, {
                stackable: true,
                maxStack: 50
            });
            
            inventory.addItem(arrows);
            inventory.items[0].quantity = 30;
            
            const split = inventory.splitStack(0, 10);
            expect(split.quantity).toBe(10);
            expect(inventory.items[0].quantity).toBe(20);
            expect(inventory.items.length).toBe(2);
        });
    });
});