export class Item {
    constructor(name, type, slots, properties = {}) {
        if (!name || typeof name !== 'string') {
            throw new Error('Item name is required');
        }
        if (!type || typeof type !== 'string') {
            throw new Error('Item type is required');
        }
        if (typeof slots !== 'number' || slots < 0) {
            throw new Error('Invalid slots value');
        }
        
        this.name = name;
        this.type = type;
        this.slots = slots;
        this.quantity = properties.quantity || 1;
        this.stackable = properties.stackable || false;
        this.maxStack = properties.maxStack || 1;
        this.equipable = properties.equipable || false;
        this.slot = properties.slot || null;
        this.requirements = properties.requirements || {};
        this.stats = properties.stats || {};
        this.setBonus = properties.setBonus || {};
        this.value = properties.value || 1;
        this.durability = properties.durability || 100;
        this.condition = this.getCondition();
        this.damage = properties.damage || 0;
        this.defense = properties.defense || 0;
        this.id = Math.random().toString(36).substr(2, 9);
    }
    
    getCondition() {
        if (this.durability >= 90) return 'excellent';
        if (this.durability >= 70) return 'good';
        if (this.durability >= 50) return 'fair';
        if (this.durability >= 30) return 'poor';
        return 'broken';
    }
    
    use() {
        if (this.durability > 0) {
            this.durability -= 1;
            this.condition = this.getCondition();
        }
    }
}

