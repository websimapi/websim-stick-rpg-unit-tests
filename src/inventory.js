// This file will be implemented later to make tests pass
export class Inventory {
    constructor(maxSlots = 20) {
        if (maxSlots <= 0) {
            throw new Error('Invalid slot count');
        }
        
        this.maxSlots = maxSlots;
        this.items = [];
        this.equipped = {};
    }
    
    get usedSlots() {
        return this.items.reduce((total, item) => total + item.slots, 0);
    }
    
    addItem(item) {
        if (!item) return false;
        
        const slotsNeeded = item.slots;
        if (this.usedSlots + slotsNeeded > this.maxSlots) {
            return false;
        }
        
        // Handle stackable items
        if (item.stackable) {
            const existingItem = this.items.find(i => 
                i.name === item.name && i.type === item.type
            );
            if (existingItem) {
                if (existingItem.quantity + (item.quantity || 1) <= item.maxStack) {
                    existingItem.quantity += (item.quantity || 1);
                    return true;
                } else {
                    // Split into multiple stacks
                    const remaining = existingItem.quantity + (item.quantity || 1) - item.maxStack;
                    existingItem.quantity = item.maxStack;
                    
                    if (remaining > 0) {
                        const newStack = { ...item };
                        newStack.quantity = remaining;
                        this.items.push(newStack);
                    }
                    return true;
                }
            }
        }
        
        this.items.push(item);
        return true;
    }
    
    removeItem(item) {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    }
    
    splitStack(itemIndex, quantity) {
        const item = this.items[itemIndex];
        if (!item || !item.stackable || item.quantity <= quantity) {
            return null;
        }
        
        const splitItem = { ...item };
        splitItem.quantity = quantity;
        item.quantity -= quantity;
        
        this.items.push(splitItem);
        return splitItem;
    }
    
    equipItem(item, character) {
        if (!item.equipable || !item.slot) return false;
        
        if (!this.canEquipItem(item, character)) {
            return false;
        }
        
        this.equipped[item.slot] = item;
        return true;
    }
    
    canEquipItem(item, character) {
        if (!item.equipable) return false;
        
        if (item.requirements) {
            if (item.requirements.level && character.level < item.requirements.level) {
                return false;
            }
        }
        
        return true;
    }
    
    getEquippedStats() {
        const stats = { defense: 0, damage: 0 };
        
        Object.values(this.equipped).forEach(item => {
            if (item.stats) {
                Object.keys(item.stats).forEach(stat => {
                    stats[stat] = (stats[stat] || 0) + item.stats[stat];
                });
            }
        });
        
        return stats;
    }
    
    getSetBonus(setName) {
        let totalBonus = 0;
        
        Object.values(this.equipped).forEach(item => {
            if (item.setBonus && item.setBonus[setName]) {
                totalBonus += item.setBonus[setName];
            }
        });
        
        return totalBonus;
    }
}