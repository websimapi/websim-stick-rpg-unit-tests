export class Stats {
    constructor(strength = 1, defense = 1, agility = 1, intelligence = 1) {
        this.strength = Math.max(0, strength);
        this.defense = Math.max(0, defense);
        this.agility = Math.max(0, agility);
        this.intelligence = Math.max(0, intelligence);
    }
    
    clone() {
        return new Stats(this.strength, this.defense, this.agility, this.intelligence);
    }
    
    add(otherStats) {
        this.strength += otherStats.strength || 0;
        this.defense += otherStats.defense || 0;
        this.agility += otherStats.agility || 0;
        this.intelligence += otherStats.intelligence || 0;
    }
}

