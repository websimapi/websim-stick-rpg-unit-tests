import { describe, it, expect } from 'vitest';
import { Quest } from './src/quest.js';
import { QuestManager } from './src/quest-manager.js';
import { Character } from './src/character.js';

describe('Quest System - Detailed', () => {
    describe('Quest Creation', () => {
        it('should create basic quest with all properties', () => {
            const quest = new Quest('Dragon Slayer', 'Defeat the ancient dragon');
            
            expect(quest.title).toBe('Dragon Slayer');
            expect(quest.description).toBe('Defeat the ancient dragon');
            expect(quest.status).toBe('available');
            expect(quest.objectives).toEqual([]);
            expect(quest.rewards).toEqual({});
            expect(quest.requirements).toEqual({});
            expect(quest.id).toBeDefined();
            expect(quest.difficulty).toBe('normal');
        });

        it('should create quest with custom settings', () => {
            const quest = new Quest('Secret Mission', 'Find the artifact', {
                difficulty: 'hard',
                timeLimit: 3600,
                repeatable: false,
                minLevel: 10
            });
            
            expect(quest.difficulty).toBe('hard');
            expect(quest.timeLimit).toBe(3600);
            expect(quest.repeatable).toBe(false);
            expect(quest.requirements.minLevel).toBe(10);
        });

        it('should generate unique quest IDs', () => {
            const quest1 = new Quest('Quest 1', 'Description');
            const quest2 = new Quest('Quest 2', 'Description');
            
            expect(quest1.id).not.toBe(quest2.id);
            expect(quest1.id).toMatch(/quest_\w+/);
        });
    });

    describe('Objectives', () => {
        it('should add kill objectives', () => {
            const quest = new Quest('Goblin Slayer', 'Defeat goblins');
            quest.addObjective('kill', 'goblin', 10);
            
            expect(quest.objectives).toHaveLength(1);
            const objective = quest.objectives[0];
            expect(objective.type).toBe('kill');
            expect(objective.target).toBe('goblin');
            expect(objective.required).toBe(10);
            expect(objective.current).toBe(0);
            expect(objective.completed).toBe(false);
        });

        it('should add collect objectives', () => {
            const quest = new Quest('Herb Collection', 'Gather herbs');
            quest.addObjective('collect', 'herb', 5);
            
            const objective = quest.objectives[0];
            expect(objective.type).toBe('collect');
            expect(objective.target).toBe('herb');
        });

        it('should add explore objectives', () => {
            const quest = new Quest('Explorer', 'Discover locations');
            quest.addObjective('explore', 'cave', 3);
            
            const objective = quest.objectives[0];
            expect(objective.type).toBe('explore');
        });

        it('should add delivery objectives', () => {
            const quest = new Quest('Courier', 'Deliver packages');
            quest.addObjective('deliver', 'package', 1);
            
            const objective = quest.objectives[0];
            expect(objective.type).toBe('deliver');
        });

        it('should add escort objectives', () => {
            const quest = new Quest('Bodyguard', 'Protect NPC');
            quest.addObjective('escort', 'merchant', 1);
            
            const objective = quest.objectives[0];
            expect(objective.type).toBe('escort');
        });

        it('should support optional objectives', () => {
            const quest = new Quest('Optional Tasks', 'Optional objectives');
            quest.addObjective('collect', 'gem', 5, { optional: true });
            
            const objective = quest.objectives[0];
            expect(objective.optional).toBe(true);
        });

        it('should handle complex multi-objective quests', () => {
            const quest = new Quest('Epic Quest', 'Complete the epic journey');
            quest.addObjective('kill', 'dragon', 1);
            quest.addObjective('collect', 'artifact', 1);
            quest.addObjective('deliver', 'artifact', 1);
            quest.addObjective('explore', 'castle', 1);
            
            expect(quest.objectives).toHaveLength(4);
            expect(quest.getObjective('kill', 'dragon')).toBeDefined();
            expect(quest.getObjective('collect', 'artifact')).toBeDefined();
        });
    });

    describe('Quest Progress', () => {
        it('should track kill progress', () => {
            const quest = new Quest('Hunter', 'Hunt monsters');
            quest.addObjective('kill', 'wolf', 3);
            
            quest.updateProgress('kill', 'wolf');
            quest.updateProgress('kill', 'wolf');
            
            const objective = quest.getObjective('kill', 'wolf');
            expect(objective.current).toBe(2);
            expect(objective.completed).toBe(false);
        });

        it('should complete objective when target reached', () => {
            const quest = new Quest('Simple', 'Simple task');
            quest.addObjective('kill', 'rat', 1);
            
            quest.updateProgress('kill', 'rat');
            
            const objective = quest.getObjective('kill', 'rat');
            expect(objective.current).toBe(1);
            expect(objective.completed).toBe(true);
        });

        it('should handle partial collect progress', () => {
            const quest = new Quest('Gatherer', 'Gather items');
            quest.addObjective('collect', 'wood', 10);
            
            quest.updateProgress('collect', 'wood', 3);
            
            const objective = quest.getObjective('collect', 'wood');
            expect(objective.current).toBe(3);
            expect(objective.completed).toBe(false);
        });

        it('should complete quest when all objectives done', () => {
            const quest = new Quest('Completion Test', 'Complete all');
            quest.addObjective('kill', 'goblin', 2);
            quest.addObjective('collect', 'coin', 5);
            
            quest.updateProgress('kill', 'goblin', 2);
            quest.updateProgress('collect', 'coin', 5);
            
            expect(quest.isComplete()).toBe(true);
            expect(quest.status).toBe('completed');
        });

        it('should handle optional objectives in completion', () => {
            const quest = new Quest('Optional Test', 'Test optional');
            quest.addObjective('kill', 'goblin', 1, { optional: true });
            quest.addObjective('collect', 'coin', 1);
            
            quest.updateProgress('collect', 'coin', 1);
            
            expect(quest.isComplete()).toBe(true);
            expect(quest.objectives[0].completed).toBe(false);
        });

        it('should reset quest progress', () => {
            const quest = new Quest('Reset Test', 'Resettable');
            quest.addObjective('kill', 'goblin', 1);
            
            quest.updateProgress('kill', 'goblin', 1);
            expect(quest.objectives[0].completed).toBe(true);
            
            quest.resetProgress();
            expect(quest.objectives[0].current).toBe(0);
            expect(quest.objectives[0].completed).toBe(false);
        });
    });

    describe('Quest Rewards', () => {
        it('should set basic rewards', () => {
            const quest = new Quest('Reward Test', 'Test rewards');
            quest.setRewards({
                experience: 1000,
                gold: 500
            });
            
            expect(quest.rewards.experience).toBe(1000);
            expect(quest.rewards.gold).toBe(500);
        });

        it('should set item rewards', () => {
            const quest = new Quest('Item Reward Test', 'Test item rewards');
            quest.setRewards({
                items: [
                    { name: 'Hero Sword', type: 'weapon', rarity: 'rare' },
                    { name: 'Gold Coin', type: 'currency', amount: 100 }
                ]
            });
            
            expect(quest.rewards.items).toHaveLength(2);
            expect(quest.rewards.items[0].name).toBe('Hero Sword');
        });

        it('should set reputation rewards', () => {
            const quest = new Quest('Reputation Test', 'Test reputation');
            quest.setRewards({
                reputation: {
                    faction: 'town',
                    amount: 50
                }
            });
            
            expect(quest.rewards.reputation.faction).toBe('town');
            expect(quest.rewards.reputation.amount).toBe(50);
        });

        it('should set skill rewards', () => {
            const quest = new Quest('Skill Test', 'Test skill rewards');
            quest.setRewards({
                skills: {
                    swordsmanship: 10,
                    archery: 5
                }
            });
            
            expect(quest.rewards.skills.swordsmanship).toBe(10);
            expect(quest.rewards.skills.archery).toBe(5);
        });

        it('should calculate reward scaling', () => {
            const quest = new Quest('Scaled Reward', 'Scaled');
            quest.setRewards({
                experience: 1000,
                gold: 500,
                scaling: 1.5
            });
            
            const scaled = quest.getScaledRewards();
            expect(scaled.experience).toBe(1500);
            expect(scaled.gold).toBe(750);
        });
    });

    describe('Quest Manager', () => {
        it('should create quest manager', () => {
            const manager = new QuestManager();
            expect(manager.quests).toEqual([]);
            expect(manager.activeQuests).toEqual([]);
            expect(manager.completedQuests).toEqual([]);
        });

        it('should add quests', () => {
            const manager = new QuestManager();
            const quest = new Quest('Test Quest', 'Test');
            
            manager.addQuest(quest);
            
            expect(manager.quests).toHaveLength(1);
            expect(manager.getAvailableQuests()).toContain(quest);
        });

        it('should assign quest to character', () => {
            const manager = new QuestManager();
            const character = new Character('Hero');
            const quest = new Quest('Assigned', 'Assigned quest');
            
            manager.addQuest(quest);
            const result = manager.assignQuest(quest.id, character);
            
            expect(result).toBe(true);
            expect(character.activeQuests).toContain(quest);
            expect(quest.status).toBe('active');
        });

        it('should prevent duplicate quest assignment', () => {
            const manager = new QuestManager();
            const character = new Character('Hero');
            const quest = new Quest('Unique', 'Unique quest');
            
            manager.addQuest(quest);
            manager.assignQuest(quest.id, character);
            const result = manager.assignQuest(quest.id, character);
            
            expect(result).toBe(false);
            expect(character.activeQuests).toHaveLength(1);
        });

        it('should check level requirements', () => {
            const manager = new QuestManager();
            const character = new Character('Hero', null, 5);
            const quest = new Quest('High Level', 'High level quest');
            quest.requirements = { minLevel: 10 };
            
            manager.addQuest(quest);
            const result = manager.canAcceptQuest(quest, character);
            
            expect(result).toBe(false);
        });

        it('should check class requirements', () => {
            const manager = new QuestManager();
            const character = new Character('Hero', { class: 'warrior' });
            const quest = new Quest('Mage Quest', 'Mage only');
            quest.requirements = { class: 'mage' };
            
            manager.addQuest(quest);
            const result = manager.canAcceptQuest(quest, character);
            
            expect(result).toBe(false);
        });

        it('should check reputation requirements', () => {
            const manager = new QuestManager();
            const character = new Character('Hero');
            character.reputation = { town: 20 };
            const quest = new Quest('Respected Quest', 'Need reputation');
            quest.requirements = { reputation: { town: 50 } };
            
            manager.addQuest(quest);
            const result = manager.canAcceptQuest(quest, character);
            
            expect(result).toBe(false);
        });

        it('should complete quest and give rewards', () => {
            const manager = new QuestManager();
            const character = new Character('Hero');
            const quest = new Quest('Reward Quest', 'Get rewards');
            quest.setRewards({ experience: 100, gold: 50 });
            
            manager.addQuest(quest);
            manager.assignQuest(quest.id, character);
            
            const initialExp = character.experience;
            const initialGold = character.gold;
            
            quest.complete();
            manager.giveRewards(quest, character);
            
            expect(character.experience).toBe(initialExp + 100);
            expect(character.gold).toBe(initialGold + 50);
            expect(manager.completedQuests).toContain(quest);
            expect(character.activeQuests).not.toContain(quest);
        });

        it('should handle quest chains', () => {
            const manager = new QuestManager();
            const quest1 = new Quest('Part 1', 'First part');
            const quest2 = new Quest('Part 2', 'Second part');
            
            quest1.nextQuest = quest2.id;
            
            manager.addQuest(quest1);
            manager.addQuest(quest2);
            
            expect(manager.getAvailableQuests()).toContain(quest1);
            expect(manager.getAvailableQuests()).not.toContain(quest2);
        });
    });

    describe('Quest Types - Advanced', () => {
        it('should handle daily quests', () => {
            const quest = new Quest('Daily Hunt', 'Daily hunting', {
                type: 'daily',
                resetTime: 24 * 60 * 60 * 1000
            });
            
            expect(quest.type).toBe('daily');
            expect(quest.resetTime).toBe(86400000);
        });

        it('should handle repeatable quests', () => {
            const quest = new Quest('Repeatable', 'Can repeat', {
                repeatable: true,
                maxRepeats: 5
            });
            
            expect(quest.repeatable).toBe(true);
            expect(quest.maxRepeats).toBe(5);
            expect(quest.repeatCount).toBe(0);
        });

        it('should handle timed quests', () => {
            const quest = new Quest('Timed', 'Must complete in time', {
                timeLimit: 3600
            });
            
            expect(quest.timeLimit).toBe(3600);
            expect(quest.isExpired()).toBe(false);
        });

        it('should handle faction quests', () => {
            const quest = new Quest('Faction Quest', 'For the guild', {
                faction: 'merchants',
                reputation: 25
            });
            
            expect(quest.faction).toBe('merchants');
            expect(quest.reputation).toBe(25);
        });
    });
});