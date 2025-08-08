import { describe, it, expect } from 'vitest';
import { QuestManager } from '../src/quest-manager.js';
import { Quest } from '../src/quest.js';
import { Character } from '../src/character.js';

describe('Quest Manager Tests', () => {
    describe('Quest Registration', () => {
        it('should register new quests', () => {
            const manager = new QuestManager();
            const quest = new Quest('Test Quest', 'Description');
            
            manager.addQuest(quest);
            
            expect(manager.quests).toHaveLength(1);
            expect(manager.getQuest(quest.id)).toBe(quest);
        });

        it('should prevent duplicate quest IDs', () => {
            const manager = new QuestManager();
            const quest1 = new Quest('Quest 1', 'First');
            const quest2 = new Quest('Quest 2', 'Second');
            quest2.id = quest1.id; // Force duplicate ID
            
            manager.addQuest(quest1);
            expect(() => manager.addQuest(quest2)).toThrow('Quest ID already exists');
        });
    });

    describe('Quest Assignment', () => {
        it('should assign quests to characters', () => {
            const manager = new QuestManager();
            const quest = new Quest('Assigned Quest', 'Quest for character');
            const character = new Character('Hero');
            
            manager.addQuest(quest);
            manager.assignQuest(quest.id, character);
            
            expect(character.activeQuests).toContain(quest);
            expect(quest.assignedTo).toContain(character);
            expect(quest.status).toBe('active');
        });

        it('should check quest availability', () => {
            const manager = new QuestManager();
            const quest = new Quest('Level 10 Quest', 'High level quest', {
                level: 10,
                prerequisites: { quests: ['starter'] }
            });
            const character = new Character('Low Level', null, 5);
            
            manager.addQuest(quest);
            const available = manager.getAvailableQuests(character);
            
            expect(available).not.toContain(quest);
        });

        it('should handle quest completion', () => {
            const manager = new QuestManager();
            const quest = new Quest('Completable', 'Finish me');
            const character = new Character('Finisher');
            
            manager.addQuest(quest);
            manager.assignQuest(quest.id, character);
            quest.complete();
            manager.completeQuest(quest.id, character);
            
            expect(character.completedQuests).toContain(quest);
            expect(character.experience).toBeGreaterThan(0);
        });
    });

    describe('Quest Filtering', () => {
        it('should filter quests by level', () => {
            const manager = new QuestManager();
            const lowQuest = new Quest('Easy', 'Simple quest', { level: 5 });
            const highQuest = new Quest('Hard', 'Difficult quest', { level: 50 });
            
            manager.addQuest(lowQuest);
            manager.addQuest(highQuest);
            
            const lowLevel = manager.getAvailableQuests(null, 10);
            expect(lowLevel).toContain(lowQuest);
            expect(lowLevel).not.toContain(highQuest);
        });

        it('should filter quests by type', () => {
            const manager = new QuestManager();
            const mainQuest = new Quest('Main', 'Story quest', { type: 'main' });
            const sideQuest = new Quest('Side', 'Optional quest', { type: 'side' });
            
            manager.addQuest(mainQuest);
            manager.addQuest(sideQuest);
            
            const mainQuests = manager.getQuestsByType('main');
            expect(mainQuests).toContain(mainQuest);
            expect(mainQuests).not.toContain(sideQuest);
        });
    });

    describe('Quest Chains Management', () => {
        it('should manage quest chain progression', () => {
            const manager = new QuestManager();
            const quest1 = new Quest('Chain Step 1', 'First step');
            const quest2 = new Quest('Chain Step 2', 'Second step');
            
            quest2.setPrerequisites([quest1]);
            manager.addQuest(quest1);
            manager.addQuest(quest2);
            
            const character = new Character('ChainRunner');
            manager.assignQuest(quest1.id, character);
            quest1.complete();
            manager.completeQuest(quest1.id, character);
            
            const available = manager.getAvailableQuests(character);
            expect(available).toContain(quest2);
        });
    });
});