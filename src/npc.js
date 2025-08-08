export class NPC {
    constructor(name, type) {
        this.name = name;
        this.type = type;
        this.inventory = [];
        this.gold = 0;
        this.dialogue = [];
        this.quests = [];
    }
    
    addItem(item) {
        this.inventory.push(item);
    }
    
    removeItem(item) {
        const index = this.inventory.indexOf(item);
        if (index > -1) {
            this.inventory.splice(index, 1);
            return true;
        }
        return false;
    }
}

