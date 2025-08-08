import { describe, it, expect } from 'vitest';
import { Quest } from '../src/quest.js';

describe('Quest Core Tests', () => {
    describe('Basic Quest Creation', () => {
        it('should create quest with required fields', () => {
            const quest = new Quest('Rescue Mission', 'Save the princess');
            
            expect(quest.title).toBe('Rescue Mission');
            expect(quest.description).toBe('Save the princess');
            expect(quest.status).toBe('available');
            expect(quest.objectives).toEqual([]);
        });

        it('should create quest with optional properties', () => {
            const quest = new Quest('Epic Adventure', 'Defeat the dragon', {
                level: 50,
                experience: 5000,
                gold: 1000,
                type: 'main'
            });
            
            expect(quest.level).toBe(50);
            expect(quest.experience).toBe(5000);
            expect(quest.gold).toBe(1000);
            expect(quest.type).toBe('main');
        });
    });

    describe('Quest Objectives', () => {
        it('should add kill objectives', () => {
            const quest = new Quest('Goblin Hunt', 'Clear the goblin camp');
            quest.addObjective('kill', 'goblin', 5);
            
            expect(quest.objectives).toHaveLength(1);
            expect(quest.objectives[0].type).toBe('kill');
            expect(quest.objectives[0].target).toBe('goblin');
            expect(quest.objectives[0].required).toBe(5);
        });

        it('should add collection objectives', () => {
            const quest = new Quest('Herb Gathering', 'Collect medicinal herbs');
            quest.addObjective('collect', 'healing_herb', 10);
            
            expect(quest.objectives[0].type).toBe('collect');
            expect(quest.objectives[0].target).toBe('healing_herb');
            expect(quest.objectives[0].required).toBe(10);
        });

        it('should track objective progress', () => {
            const quest = new Quest('Wolf Hunt', 'Hunt wolves');
            quest.addObjective('kill', 'wolf', 3);
            
            quest.updateProgress('kill', 'wolf', 1);
            expect(quest.getObjectiveProgress('kill', 'wolf')).toBe(1);
            expect(quest.getObjectiveProgress('kill', 'wolf')).toBeLessThan(3);
        });
    });

    describe('Quest Completion', () => {
        it('should complete quest when all objectives done', () => {
            const quest = new Quest('Simple Task', 'Complete all objectives');
            quest.addObjective('collect', 'item', 1);
            
            quest.updateProgress('collect', 'item', 1);
            quest.checkCompletion();
            
            expect(quest.status).toBe('completed');
            expect(quest.isCompleted()).toBe(true);
        });

        it('should not complete quest with incomplete objectives', () => {
            const quest = new Quest('Incomplete', 'Missing objectives');
            quest.addObjective('kill', 'enemy', 5);
            
            quest.updateProgress('kill', 'enemy', 3);
            quest.checkCompletion();
            
            expect(quest.status).toBe('active');
            expect(quest.isCompleted()).toBe(false);
        });
    });
});