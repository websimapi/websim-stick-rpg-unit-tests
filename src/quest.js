// This file will be implemented later to make tests pass
export class Quest {
    constructor(title, description, properties = {}) {
        this.id = properties.id || Math.random().toString(36).substr(2, 9);
        this.title = title;
        this.description = description;
        this.status = 'available';
        this.objectives = [];
        this.level = properties.level || 1;
        this.experience = properties.experience || 100;
        this.gold = properties.gold || 0;
        this.type = properties.type || 'side';
        this.prerequisites = properties.prerequisites || {};
        this.branches = [];
        this.nextQuest = null;
        this.assignedTo = [];
        this.timeLimit = properties.timeLimit || null;
        this.hasTimeLimit = !!this.timeLimit;
        this.repeatable = properties.repeatable || false;
        this.maxRepeats = properties.maxRepeats || 1;
        this.dailyLimit = properties.dailyLimit || null;
        this.npc = properties.npc || null;
        this.path = properties.path || [];
        this.item = properties.item || null;
        this.from = properties.from || null;
        this.to = properties.to || null;
        this.risk = properties.risk || 0;
    }
    
    addObjective(type, target, required) {
        this.objectives.push({
            type,
            target,
            required,
            current: 0,
            completed: false
        });
    }
    
    updateProgress(type, target, amount = 1) {
        const objective = this.objectives.find(obj => 
            obj.type === type && obj.target === target
        );
        
        if (objective) {
            objective.current = Math.min(objective.current + amount, objective.required);
            objective.completed = objective.current >= objective.required;
        }
    }
    
    getObjectiveProgress(type, target) {
        const objective = this.objectives.find(obj => 
            obj.type === type && obj.target === target
        );
        return objective ? objective.current : 0;
    }
    
    checkCompletion() {
        const allCompleted = this.objectives.every(obj => obj.completed);
        if (allCompleted && this.objectives.length > 0) {
            this.status = 'completed';
        } else if (this.objectives.length > 0) {
            this.status = 'active';
        }
    }
    
    isCompleted() {
        return this.status === 'completed';
    }
    
    complete() {
        this.status = 'completed';
    }
    
    addBranch(branch) {
        this.branches.push(branch);
    }
    
    setNext(nextQuest) {
        this.nextQuest = nextQuest;
    }
    
    setPrerequisites(prerequisites) {
        this.prerequisites = Array.isArray(prerequisites) ? prerequisites : [prerequisites];
    }
    
    canStart(completedQuests = []) {
        if (Array.isArray(this.prerequisites)) {
            return this.prerequisites.every(prereq => completedQuests.includes(prereq));
        }
        return true;
    }
}