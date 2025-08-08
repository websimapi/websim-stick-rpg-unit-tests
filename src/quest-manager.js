export class QuestManager {
    constructor() {
        this.quests = [];
    }
    
    addQuest(quest) {
        const existingQuest = this.quests.find(q => q.id === quest.id);
        if (existingQuest) {
            throw new Error('Quest ID already exists');
        }
        this.quests.push(quest);
    }
    
    getQuest(questId) {
        return this.quests.find(quest => quest.id === questId);
    }
    
    assignQuest(questId, character) {
        const quest = this.getQuest(questId);
        if (quest) {
            quest.assignedTo.push(character);
            quest.status = 'active';
            character.activeQuests.push(quest);
        }
    }
    
    completeQuest(questId, character) {
        const quest = this.getQuest(questId);
        if (quest && quest.isCompleted()) {
            character.completedQuests.push(quest);
            character.gainExperience(quest.experience);
            character.gold += quest.gold;
            
            // Remove from active quests
            const index = character.activeQuests.indexOf(quest);
            if (index > -1) {
                character.activeQuests.splice(index, 1);
            }
        }
    }
    
    getAvailableQuests(character, maxLevel = null) {
        return this.quests.filter(quest => {
            if (quest.status !== 'available') return false;
            if (maxLevel && quest.level > maxLevel) return false;
            if (character && quest.level > character.level) return false;
            if (character && quest.prerequisites && quest.prerequisites.quests) {
                const hasPrereqs = quest.prerequisites.quests.every(prereqId =>
                    character.completedQuests.some(q => q.id === prereqId)
                );
                if (!hasPrereqs) return false;
            }
            return true;
        });
    }
    
    getQuestsByType(type) {
        return this.quests.filter(quest => quest.type === type);
    }
}

