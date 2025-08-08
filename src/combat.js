export class Combat {
    constructor(player, enemy) {
        if (!player.isAlive() || !enemy.isAlive()) {
            throw new Error('Cannot start combat with dead character');
        }
        
        this.player = player;
        this.enemy = enemy;
        this.turn = 0;
        this.isActive = true;
        this.winner = null;
    }
    
    getFirstTurn() {
        return this.player.stats.agility >= this.enemy.stats.agility ? this.player : this.enemy;
    }
    
    getCurrentTurn() {
        const first = this.getFirstTurn();
        return this.turn % 2 === 0 ? first : (first === this.player ? this.enemy : this.player);
    }
    
    nextTurn() {
        this.turn++;
    }
    
    attack(attacker, defender) {
        const damage = this.calculateDamage(attacker, defender);
        defender.takeDamage(damage);
        
        if (!defender.isAlive()) {
            this.endCombat(attacker);
        }
        
        this.nextTurn();
    }
    
    calculateDamage(attacker, defender, isCritical = false) {
        const baseDamage = attacker.calculateDamage(isCritical);
        const actualDamage = Math.max(baseDamage - defender.stats.defense, 1);
        return actualDamage;
    }
    
    calculateExperience(defeatedEnemy) {
        return defeatedEnemy.level * 30;
    }
    
    endCombat(winner) {
        this.isActive = false;
        this.winner = winner;
        
        const loser = winner === this.player ? this.enemy : this.player;
        
        // Award experience
        const exp = this.calculateExperience(loser);
        winner.gainExperience(exp);
        
        // Handle drops
        if (loser.drops && loser.drops.length > 0) {
            loser.drops.forEach(drop => {
                winner.addItem(drop);
            });
        }
    }
}

