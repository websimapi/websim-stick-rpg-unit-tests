import { Stats } from './stats.js';

export class Character {
    constructor(name, stats = null) {
        if (!name || (typeof name === 'string' && name.trim() === '')) {
            throw new Error('Character name cannot be empty');
        }
        
        this.name = name;
        this.stats = stats || new Stats(1, 1, 1, 1);
        this.level = 1;
        this.experience = 0;
        this.maxHealth = Math.max(1, 100 + (this.stats.strength * 10) + (this.stats.defense * 5));
        this.health = this.maxHealth;
        this.mana = 100 + (this.stats.intelligence * 10);
        this.maxMana = this.mana;
        this.inventory = [];
        this.equipment = {};
        this.statusEffects = [];
        this.fatigue = 0;
        this.hunger = 0;
        this.gold = 0;
        this.party = { members: [] };
        this.partyLeader = null;
        this.factionReputation = {};
        this.completedQuests = [];
        this.activeQuests = [];
        this.damageModifier = 0;
        this.defenseModifier = 0;
        this.inventoryLimit = 50;
        this.isWellRested = true;
        this.hasResurrectionSickness = false;
        this.drops = [];
        this.id = Math.random().toString(36).substr(2, 9);
    }
    
    isAlive() {
        return this.health > 0;
    }
    
    gainExperience(amount) {
        if (this.level >= 100) {
            this.experience = 0;
            return;
        }
        
        this.experience += Math.floor(amount);
        
        while (this.experience >= this.getExperienceNeeded() && this.level < 100) {
            this.experience -= this.getExperienceNeeded();
            this.levelUp();
        }
        
        if (this.level >= 100) {
            this.experience = 0;
        }
    }
    
    loseExperience(amount) {
        this.experience = Math.max(0, this.experience - amount);
    }
    
    getExperienceNeeded() {
        return this.level * 100;
    }
    
    levelUp() {
        this.level++;
        const healthIncrease = 20 + (this.stats.strength * 2);
        this.maxHealth += healthIncrease;
        this.health = this.maxHealth;
        
        // Increase stats
        this.stats.strength += 1;
        this.stats.defense += 1;
        this.stats.agility += 1;
        this.stats.intelligence += 1;
    }
    
    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
    }
    
    heal(amount) {
        if (amount < 0) return;
        this.health = Math.min(this.maxHealth, this.health + amount);
    }
    
    calculateDamage(isCritical = false) {
        const baseDamage = this.stats.strength + this.damageModifier;
        return isCritical ? baseDamage * 2 : baseDamage;
    }
    
    calculateElementalDamage(element, baseDamage) {
        return baseDamage + (baseDamage * (this.stats.intelligence / 100));
    }
    
    addItem(item) {
        if (!item) {
            throw new Error('Cannot add null item');
        }
        
        if (this.inventory.length >= this.inventoryLimit) {
            // Remove least valuable item if at limit
            const leastValuable = this.inventory.reduce((min, current) => 
                current.value < min.value ? current : min
            );
            if (item.value > leastValuable.value) {
                this.removeItem(leastValuable);
            } else {
                return false;
            }
        }
        
        // Handle stackable items
        if (item.stackable) {
            const existingItem = this.inventory.find(i => 
                i.name === item.name && i.type === item.type
            );
            if (existingItem) {
                existingItem.quantity += item.quantity || 1;
                return true;
            }
        }
        
        this.inventory.push(item);
        return true;
    }
    
    removeItem(item) {
        const index = this.inventory.indexOf(item);
        if (index > -1) {
            this.inventory.splice(index, 1);
            return true;
        }
        return false;
    }
    
    findItemsByType(type) {
        return this.inventory.filter(item => item.type === type);
    }
    
    useItem(item) {
        if (item.durability !== undefined) {
            item.use();
        }
    }
    
    sortInventory(sortBy) {
        switch (sortBy) {
            case 'name':
                this.inventory.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'type':
                this.inventory.sort((a, b) => a.type.localeCompare(b.type));
                break;
            case 'value':
                this.inventory.sort((a, b) => b.value - a.value);
                break;
        }
    }
    
    equip(item) {
        if (!item.equipable) return false;
        
        this.equipment[item.slot] = item;
        if (item.damage) this.damageModifier += item.damage;
        if (item.defense) this.defenseModifier += item.defense;
        return true;
    }
    
    applyStatus(status, duration) {
        const existingStatus = this.statusEffects.find(s => s.name === status);
        if (existingStatus) {
            existingStatus.duration = Math.max(existingStatus.duration, duration);
        } else {
            this.statusEffects.push({ name: status, duration });
        }
    }
    
    getStatusDuration(status) {
        const statusEffect = this.statusEffects.find(s => s.name === status);
        return statusEffect ? statusEffect.duration : 0;
    }
    
    updateStatusEffects() {
        for (let i = this.statusEffects.length - 1; i >= 0; i--) {
            const status = this.statusEffects[i];
            
            // Apply status effect
            switch (status.name) {
                case 'poison':
                case 'burn':
                    this.takeDamage(5);
                    break;
            }
            
            status.duration--;
            if (status.duration <= 0) {
                this.statusEffects.splice(i, 1);
            }
        }
    }
    
    castSpell(spellName, manaCost) {
        if (this.mana >= manaCost) {
            this.mana -= manaCost;
            return true;
        }
        return false;
    }
    
    sleep(hours) {
        this.fatigue = Math.max(0, this.fatigue - (hours * 12.5));
        this.isWellRested = this.fatigue === 0;
    }
    
    passTime(minutes) {
        this.hunger += minutes / 10;
        this.fatigue += minutes / 60;
    }
    
    characterHungerPenalty() {
        return Math.min(this.hunger / 10, 50);
    }
    
    resurrect() {
        this.health = this.maxHealth * 0.1;
        this.hasResurrectionSickness = true;
    }
    
    adjustFactionReputation(faction, amount) {
        this.factionReputation[faction] = (this.factionReputation[faction] || 0) + amount;
    }
    
    getFactionReputation(faction) {
        return this.factionReputation[faction] || 0;
    }
    
    addToParty(character) {
        // Check for circular references
        let current = this;
        while (current.partyLeader) {
            current = current.partyLeader;
            if (current === character) {
                return false; // Circular reference
            }
        }
        
        this.party.members.push(character);
        character.partyLeader = this;
        return true;
    }
    
    purchaseFrom(merchant, item) {
        if (this.gold >= item.value && merchant.inventory.includes(item)) {
            this.gold -= item.value;
            merchant.gold = (merchant.gold || 0) + item.value;
            merchant.removeItem(item);
            this.addItem(item);
            return true;
        }
        return false;
    }
    
    serialize() {
        return {
            id: this.id,
            name: this.name,
            level: this.level,
            experience: this.experience,
            health: this.health,
            stats: { ...this.stats },
            inventory: this.inventory.map(item => ({ ...item }))
        };
    }
    
    static deserialize(data) {
        if (!data) return null;
        
        try {
            const character = new Character(data.name, new Stats(
                data.stats.strength,
                data.stats.defense,
                data.stats.agility,
                data.stats.intelligence
            ));
            
            character.id = data.id;
            character.level = data.level;
            character.experience = data.experience;
            character.health = data.health;
            character.inventory = data.inventory || [];
            
            return character;
        } catch (error) {
            return null;
        }
    }
}