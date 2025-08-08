// This file will be implemented later to make tests pass
export class Location {
    constructor(name, description) {
        this.name = name;
        this.description = description;
        this.connections = {};
        this.npcs = [];
    }
    
    addConnection(location, direction) {
        this.connections[direction] = location;
    }
    
    getConnection(direction) {
        return this.connections[direction] || null;
    }
    
    addNPC(npc) {
        this.npcs.push(npc);
    }
    
    removeNPC(npc) {
        const index = this.npcs.indexOf(npc);
        if (index > -1) {
            this.npcs.splice(index, 1);
        }
    }
}