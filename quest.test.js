import { describe, it, expect } from 'vitest';
import { Quest } from './src/quest.js';
import { QuestManager } from './src/quest-manager.js';
import { Character } from './src/character.js';

describe('Quest System', () => {
    describe('Quest Creation', () => {
        it('should create a basic quest', () => {
            const quest = new Quest('Goblin Slayer', 'Defeat 5 goblins');
            
            expect(quest.title).toBe('Goblin Slayer');
            expect(quest.description).toBe('Defeat 5 goblins');
            expect(quest.status).toBe('available');
            expect(quest.objectives.length).toBe(0);
        });

        it('should add objectives to quest', () => {
            const quest = new Quest('Delivery', 'Deliver package');
            quest.addObjective('kill', 'goblin', 5);
            
            expect(quest.objectives.length).toBe(1);
            expect(quest.objectives[0].type).toBe('kill');
            expect(quest.objectives[0].target).toBe('goblin');
            expect(quest.objectives[0].required).toBe(5);
        });

        it('should set quest rewards', () => {
            const quest = new Quest('Hero Quest', 'Become a hero');
            quest.setRewards({
                experience: 1000,
                gold: 500,
                items: [{ name: 'Hero Sword', type: 'weapon' }]
            });
            
            expect(quest.rewards.experience).toBe(1000);
            expect(quest.rewards.gold).toBe(500);
            expect(quest.rewards.items.length).toBe(1);
        });
    });

    describe('Quest Progress', () => {
        it('should track objective progress', () => {
            const quest = new Quest('Hunter', 'Hunt monsters');
            quest.addObjective('kill', 'wolf', 3);
            
            quest.updateProgress('kill', 'wolf');
            quest.updateProgress('kill', 'wolf');
            
            const objective = quest.getObjective('kill', 'wolf');
            expect(objective.current).toBe(2);
            expect(objective.completed).toBe(false);
        });

        it('should complete quest when all objectives done', () => {
            const quest = new Quest('Simple Quest', 'Do something');
            quest.addObjective('collect', 'item', 1);
            
            quest.updateProgress('collect', 'item');
            
            expect(quest.status).toBe('completed');
            expect(quest.isComplete()).toBe(true);
        });

        it('should handle multiple objectives', () => {
            const quest = new Quest('Complex Quest', 'Multi-step quest');
            quest.addObjective('kill', 'goblin', 2);
            quest.addObjective('collect', 'herb', 5);
            
            quest.updateProgress('kill', 'goblin');
            quest.updateProgress('kill', 'goblin');
            quest.updateProgress('collect', 'herb');
            
            expect(quest.getObjective('kill', 'goblin').completed).toBe(true);
            expect(quest.getObjective('collect', 'herb').completed).toBe(false);
            expect(quest.isComplete()).toBe(false);
        });
    });

    describe('Quest Manager', () => {
        it('should add quests to manager', () => {
            const manager = new QuestManager();
            const quest = new Quest('Test Quest', 'Test');
            
            manager.addQuest(quest);
            expect(manager.getAvailableQuests().length).toBe(1);
        });

        it('should assign quests to characters', () => {
            const manager = new QuestManager();
            const character = new Character('Hero');
            const quest = new Quest('Assigned Quest', 'Assigned');
            
            manager.addQuest(quest);
            manager.assignQuest(quest.id, character);
            
            expect(character.activeQuests).toContain(quest);
            expect(quest.status).toBe('active');
        });

        it('should enforce quest requirements', () => {
            const manager = new QuestManager();
            const character = new Character('Hero', null, 1);
            const quest = new Quest('Hard Quest', 'Hard');
            quest.requirements = { level: 10 };
            
            const canAccept = manager.canAcceptQuest(quest, character);
            expect(canAccept).toBe(false);
        });

        it('should complete quests and give rewards', () => {
            const manager = new QuestManager();
            const character = new Character('Hero');
            const quest = new Quest('Reward Quest', 'Get reward');
            quest.setRewards({ experience: 100, gold: 50 });
            
            manager.addQuest(quest);
            manager.assignQuest(quest.id, character);
            
            const initialExp = character.experience;
            const initialGold = character.gold;
            
            quest.complete();
            manager.giveRewards(quest, character);
            
            expect(character.experience).toBe(initialExp + 100);
            expect(character.gold).toBe(initialGold + 50);
        });
    });

    describe('Quest Types', () => {
        it('should handle kill quests', () => {
            const quest = new Quest('Killer', 'Kill stuff');
            quest.addObjective('kill', 'zombie', 10);
            
            for (let i = 0; i < 10; i++) {
                quest.updateProgress('kill', 'zombie');
            }
            
            expect(quest.isComplete()).toBe(true);
        });

        it('should handle fetch quests', () => {
            const quest = new Quest('Fetcher', 'Fetch stuff');
            quest.addObjective('collect', 'gem', 3);
            
            quest.updateProgress('collect', 'gem', 3);
            expect(quest.isComplete()).toBe(true);
        });

        it('should handle escort quests', () => {
            const quest = new Quest('Bodyguard', 'Protect NPC');
            quest.addObjective('escort', 'merchant', 1);
            
            quest.updateProgress('escort', 'merchant');
            expect(quest.isComplete()).toBe(true);
        });

        it('should handle delivery quests', () => {
            const quest = new Quest('Courier', 'Deliver package');
            quest.addObjective('deliver', 'package', 1);
            
            quest.updateProgress('deliver', 'package');
            expect(quest.isComplete()).toBe(true);
        });
    });
});

