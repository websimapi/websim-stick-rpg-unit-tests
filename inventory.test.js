import { describe, it, expect } from 'vitest';
import { Inventory } from './src/inventory.js';
import { Item } from './src/item.js';

describe('Inventory System - Ultra Detailed', () => {
    describe('Inventory Creation - Extreme Edge Cases', () => {
        it('should throw error for zero slots', () => {
            expect(() => new Inventory(0)).toThrow('Invalid slot count');
        });

        it('should throw error for negative infinity', () => {
            expect(() => new Inventory(-Infinity)).toThrow('Invalid slot count');
        });

        it('should handle very large valid slot counts', () => {
            const inventory = new Inventory(999999);
            expect(inventory.maxSlots).toBe(999999);
        });

        it('should handle single slot inventory', () => {
            const inventory = new Inventory(1);
            expect(inventory.maxSlots).toBe(1);
            expect(inventory.usedSlots).toBe(0);
        });

        it('should handle fractional slots by rounding down', () => {
            const inventory = new Inventory(5.7);
            expect(inventory.maxSlots).toBe(5);
        });

        it('should create inventory with default values', () => {
            const inventory = new Inventory();
            expect(inventory.items).toEqual([]);
            expect(inventory.weight).toBe(0);
            expect(inventory.value).toBe(0);
        });
    });

    describe('Item Creation - Comprehensive', () => {
        it('should create basic items with all properties', () => {
            const item = new Item('Iron Sword', 'weapon', 2);
            expect(item.name).toBe('Iron Sword');
            expect(item.type).toBe('weapon');
            expect(item.slots).toBe(2);
            expect(item.quantity).toBe(1);
            expect(item.properties).toEqual({});
        });

        it('should create items with custom properties', () => {
            const item = new Item('Magic Potion', 'consumable', 1, {
                stackable: true,
                maxStack: 99,
                value: 50,
                weight: 0.5,
                rarity: 'rare',
                effects: { healing: 25 }
            });
            
            expect(item.properties.stackable).toBe(true);
            expect(item.properties.maxStack).toBe(99);
            expect(item.properties.value).toBe(50);
        });

        it('should generate unique item IDs', () => {
            const item1 = new Item('A', 'type', 1);
            const item2 = new Item('A', 'type', 1);
            
            expect(item1.id).toBeDefined();
            expect(item2.id).toBeDefined();
            expect(item1.id).not.toBe(item2.id);
        });

        it('should handle null/empty values gracefully', () => {
            const item = new Item('', '', 0);
            expect(item.name).toBe('');
            expect(item.type).toBe('');
            expect(item.slots).toBe(0);
        });

        it('should handle very large slot requirements', () => {
            const item = new Item('Colossal', 'special', 1000);
            expect(item.slots).toBe(1000);
        });
    });

    describe('Advanced Item Stacking - Complex Scenarios', () => {
        it('should handle cross-item stacking with different properties', () => {
            const inventory = new Inventory();
            const potion1 = new Item('Healing Potion', 'consumable', 1, {
                stackable: true,
                maxStack: 10
            });
            const potion2 = new Item('Healing Potion', 'consumable', 1, {
                stackable: true,
                maxStack: 10
            });
            const potionDiff = new Item('Healing Potion', 'consumable', 1, {
                stackable: true,
                maxStack: 5 // Different max stack
            });
            
            inventory.addItem(potion1);
            inventory.addItem(potion2);
            
            expect(inventory.items).toHaveLength(1);
            expect(inventory.items[0].quantity).toBe(2);
        });

        it('should split stacks intelligently', () => {
            const inventory = new Inventory();
            const gold = new Item('Gold Coin', 'currency', 1, {
                stackable: true,
                maxStack: 100
            });
            
            inventory.addItem(gold);
            inventory.items[0].quantity = 150;
            
            const splitResult = inventory.splitStack(0, 50);
            
            expect(inventory.items).toHaveLength(2);
            expect(inventory.items[0].quantity).toBe(100);
            expect(inventory.items[1].quantity).toBe(50);
        });

        it('should merge compatible stacks', () => {
            const inventory = new Inventory();
            const potion = new Item('Potion', 'consumable', 1, {
                stackable: true,
                maxStack: 10
            });
            
            inventory.addItem(potion);
            inventory.addItem(potion);
            inventory.items[0].quantity = 3;
            inventory.items[1].quantity = 7;
            
            inventory.mergeStacks(0, 1);
            
            expect(inventory.items).toHaveLength(1);
            expect(inventory.items[0].quantity).toBe(10);
        });

        it('should handle stack overflow during merge', () => {
            const inventory = new Inventory();
            const item = new Item('Stack Item', 'misc', 1, {
                stackable: true,
                maxStack: 5
            });
            
            inventory.addItem(item);
            inventory.addItem(item);
            inventory.items[0].quantity = 4;
            inventory.items[1].quantity = 3;
            
            inventory.mergeStacks(0, 1);
            
            expect(inventory.items).toHaveLength(2);
            expect(inventory.items[0].quantity).toBe(5);
            expect(inventory.items[1].quantity).toBe(2);
        });

        it('should handle partial stack uses', () => {
            const inventory = new Inventory();
            const potion = new Item('Potion', 'consumable', 1, {
                stackable: true,
                maxStack: 10
            });
            
            inventory.addItem(potion);
            inventory.items[0].quantity = 5;
            
            inventory.useStackedItem(0, 2);
            
            expect(inventory.items[0].quantity).toBe(3);
            expect(inventory.usedSlots).toBe(1);
        });
    });

    describe('Dynamic Inventory Operations - Performance', () => {
        it('should handle rapid add/remove cycles', () => {
            const inventory = new Inventory(50);
            const item = new Item('Rapid Item', 'test', 1);
            
            for (let i = 0; i < 100; i++) {
                inventory.addItem(item);
                inventory.removeItem(item);
            }
            
            expect(inventory.items).toHaveLength(0);
            expect(inventory.usedSlots).toBe(0);
        });

        it('should handle bulk operations efficiently', () => {
            const inventory = new Inventory(100);
            const items = Array.from({ length: 1000 }, (_, i) => 
                new Item(`Item${i}`, 'bulk', 1)
            );
            
            inventory.addBulkItems(items.slice(0, 50));
            expect(inventory.items).toHaveLength(50);
            
            inventory.removeBulkItems(items.slice(25, 75));
            expect(inventory.items).toHaveLength(25);
        });

        it('should handle inventory compression', () => {
            const inventory = new Inventory(10);
            const items = Array.from({ length: 500 }, (_, i) => 
                new Item(`Item${i}`, 'misc', 1)
            );
            
            inventory.addBulkItems(items);
            inventory.compressInventories();
            
            expect(inventory.usedSlots).toBeGreaterThan(0);
            expect(inventory.usedSlots).toBeLessThanOrEqual(10);
        });
    });

    describe('Equipment System - Advanced Features', () => {
        it('should handle equipment sets with bonuses', () => {
            const inventory = new Inventory();
            const head = new Item('Steel Helmet', 'armor', 2, {
                equipable: true,
                slot: 'helmet',
                setBonus: { 'steel': 1 }
            });
            const chest = new Item('Steel Armor', 'armor', 4, {
                equipable: true,
                slot: 'chest',
                setBonus: { 'steel': 2 }
            });
            
            inventory.addItem(head);
            inventory.addItem(chest);
            
            inventory.equipItem(head, { level: 1 });
            inventory.equipItem(chest, { level: 1 });
            
            expect(inventory.getSetBonus('steel')).toBe(3);
            expect(inventory.calculateSetEffects().defense).toBeGreaterThan(0);
        });

        it('should handle equipment level requirements', () => {
            const inventory = new Inventory();
            const sword = new Item('Epic Sword', 'weapon', 2, {
                equipable: true,
                slot: 'weapon',
                requirements: { level: 25, strength: 20 }
            });
            
            inventory.addItem(sword);
            
            const lowLevel = { level: 5, strength: 10 };
            expect(inventory.canEquipItem(sword, lowLevel)).toBe(false);
            
            const highLevel = { level: 30, strength: 25 };
            expect(inventory.canEquipItem(sword, highLevel)).toBe(true);
        });

        it('should handle equipment durability and repairs', () => {
            const inventory = new Inventory();
            const weapon = new Item('Durability Sword', 'weapon', 2, {
                equipable: true,
                slot: 'weapon',
                durability: 100,
                maxDurability: 100
            });
            
            inventory.addItem(weapon);
            inventory.equipItem(weapon, { level: 1 });
            inventory.reduceDurability('weapon', 30);
            
            expect(inventory.equipped.weapon.durability).toBe(70);
            expect(inventory.calculateDurabilityPenalty()).toBeGreaterThan(0);
            
            inventory.repairItem('weapon', 20);
            expect(inventory.equipped.weapon.durability).toBe(90);
        });

        it('should handle equipment transmoging/illusion', () => {
            const inventory = new Inventory();
            const displayItem = new Item('Golden Sword', 'weapon', 2, {
                equipable: true,
                slot: 'weapon',
                appearance: 'epic',
                transmogs: true
            });
            
            const realItem = new Item('Iron Sword', 'weapon', 2, {
                equipable: true,
                slot: 'weapon',
                stats: { damage: 25 }
            });
            
            inventory.addItem(displayItem);
            inventory.addItem(realItem);
            inventory.equipItemWithIllusion(realItem, displayItem, {});
            
            expect(inventory.getEquippedStats().damage).toBe(25);
            expect(inventory.equipped.weapon.name).toBe('Golden Sword');
            expect(inventory.equipped.weapon.realItem).toBe(realItem);
        });

        it('should handle equipment enchanting', () => {
            const inventory = new Inventory();
            const item = new Item('Enchantable Sword', 'weapon', 2, {
                equipable: true,
                slot: 'weapon',
                enchantable: true,
                maxEnchants: 3
            });
            
            inventory.addItem(item);
            inventory.equipItem(item, {});
            
            inventory.enchantItem('weapon', { flame: 1 });
            inventory.enchantItem('weapon', { frost: 1 });
            
            expect(inventory.equipped.weapon.enchants).toHaveLength(2);
            expect(inventory.calculateEnchantments()).toEqual({ flame: 1, frost: 1 });
        });
    });

    describe('Advanced Queries and Filtering', () => {
        it('should perform complex item queries', () => {
            const inventory = new Inventory();
            const items = [
                new Item('Rusted Sword', 'weapon', 2, { value: 1, quality: 'poor' }),
                new Item('Steel Sword', 'weapon', 2, { value: 50, quality: 'normal' }),
                new Item('Magic Sword', 'weapon', 2, { value: 200, quality: 'magic', enchanted: true }),
                new Item('Legendary Sword', 'weapon', 2, { value: 1000, quality: 'legendary' })
            ];
            
            items.forEach(item => inventory.addItem(item));
            
            const magicalWeapons = inventory.queryItems({
                type: 'weapon',
                'properties.enchanted': true,
                'properties.value': { $gt: 100 }
            });
            
            expect(magicalWeapons).toHaveLength(1);
            expect(magicalWeapons[0].name).toBe('Magic Sword');
        });

        it('should filter by complex conditions', () => {
            const inventory = new Inventory();
            const items = [
                new Item('Pot1', 'consumable', 1, { stackable: true, value: 5 }),
                new Item('Pot2', 'consumable', 1, { stackable: true, value: 15 }),
                new Item('Pot3', 'consumable', 1, { stackable: true, value: 25 })
            ];
            
            items.forEach(item => inventory.addItem(item));
            
            const valuablePotions = inventory.filterItems((item) => 
                item.type === 'consumable' && item.properties.value > 10
            );
            
            expect(valuablePotions).toHaveLength(2);
            expect(valuablePotions.map(p => p.properties.value)).toEqual([15, 25]);
        });

        it('should support item search with fuzzy matching', () => {
            const inventory = new Inventory();
            const items = [
                new Item('Excalibur', 'weapon', 2),
                new Item('Axcalibre', 'weapon', 2),
                new Item('Excaliber', 'weapon', 2),
                new Item('Axe', 'weapon', 1)
            ];
            
            items.forEach(item => inventory.addItem(item));
            
            const similar = inventory.fuzzyFind('excalibur');
            expect(similar).toHaveLength(3);
        });

        it('should handle pagination for large inventories', () => {
            const inventory = new Inventory(1000);
            Array.from({ length: 500 }).forEach((_, i) => 
                inventory.addItem(new Item(`Item${i}`, 'misc', 1))
            );
            
            const page1 = inventory.getPagedItems(0, 50);
            const page2 = inventory.getPagedItems(50, 50);
            
            expect(page1.length).toBe(50);
            expect(page2.length).toBe(50);
            expect(page1[0].name).toBe('Item0');
            expect(page2[0].name).toBe('Item50');
        });
    });

    describe('Inventory Economy - Advanced Trading', () => {
        it('should track market values over time', () => {
            const inventory = new Inventory();
            const gold = new Item('Gold Coin', 'currency', 1, {
                value: 1,
                fluctuation: 0.1,
                baseValue: 1
            });
            
            inventory.addItem(gold);
            const initial = gold.properties.currentValue;
            
            for (let i = 0; i < 1000; i++) {
                inventory.updateMarketValues();
            }
            
            expect(gold.properties.currentValue).not.toBe(initial);
            expect(Math.abs(gold.properties.currentValue - 1)).toBeLessThan(0.3);
        });

        it('should handle item crafting and recipes', () => {
            const inventory = new Inventory();
            const wood = new Item('Wood', 'crafting', 1, {
                quality: 'common',
                stackable: true,
                maxStack: 50
            });
            const iron = new Item('Iron', 'crafting', 1, {
                quality: 'common',
                stackable: true,
                maxStack: 30
            });
            
            inventory.addItem(wood);
            inventory.addItem(wood);
            inventory.addItem(iron);
            
            inventory.items[0].quantity = 5;
            inventory.items[1].quantity = 3;
            
            const recipe = {
                requirements: [
                    { type: 'crafting', name: 'Wood', quantity: 3 },
                    { type: 'crafting', name: 'Iron', quantity: 2 }
                ],
                result: new Item('Axe', 'weapon', 2, { quality: 'poor' })
            };
            
            const crafted = inventory.craftItem(recipe);
            expect(crafted.name).toBe('Axe');
            expect(inventory.items[0].quantity).toBe(2);
            expect(inventory.items[1].quantity).toBe(1);
        });

        it('should handle item auctions and bidding', () => {
            const inventory = new Inventory();
            const rare = new Item('Rare Artifact', 'treasure', 1, {
                value: 1000,
                rarity: 'legendary',
                auctionable: true
            });
            
            inventory.addItem(rare);
            
            const bid = inventory.placeBid(rare, { bidder: 'player', amount: 1200 });
            expect(bid.success).toBe(true);
            expect(rare.properties.highestBid).toBe(1200);
        });

        it('should handle inventory insurance and protection', () => {
            const inventory = new Inventory();
            const valuable = new Item('Crown', 'treasure', 1, {
                value: 5000,
                insured: true,
                insurance: { value: 4500, premium: 450 }
            });
            
            inventory.addItem(valuable);
            inventory.purchaseInsurance(valuable);
            
            expect(inventory.totalInsuranceCoverage).toBe(4500);
            expect(inventory.monthlyInsuranceCost).toBe(450);
        });
    });

    describe('Security and Validations', () => {
        it('should prevent item cloning exploits', () => {
            const inventory = new Inventory();
            const original = new Item('Unique', 'unique', 1, { flagged: 'unique' });
            
            inventory.addItem(original);
            
            const clone = Object.assign({}, original);
            const result = inventory.addItem(clone);
            
            expect(result).toBe(false);
            expect(inventory.items).toHaveLength(1);
        });

        it('should detect duplicate item IDs', () => {
            const inventory = new Inventory();
            const item1 = new Item('Item1', 'type', 1);
            const item2 = new Item('Item2', 'type', 1);
            
            item2.id = item1.id; // Force duplicate ID
            
            inventory.addItem(item1);
            const result = inventory.addItem(item2);
            
            expect(result).toBe(false);
        });

        it('should validate item properties on add', () => {
            const inventory = new Inventory();
            const invalidItem = {
                name: 'Invalid',
                type: 'weapon',
                slots: 'not-a-number'
            };
            
            expect(() => inventory.addItem(invalidItem)).toThrow('Invalid item slots');
        });

        it('should sanitize and escape item names', () => {
            const inventory = new Inventory();
            const malicious = new Item('<script>alert("xss")</script>', 'weapon', 1);
            
            inventory.addItem(malicious);
            const sanitized = inventory.items[0].name;
            
            expect(sanitized).not.toContain('<script>');
        });
    });
});