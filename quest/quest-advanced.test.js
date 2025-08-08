import { describe, it, expect } from 'vitest';
import { Quest } from '../src/quest.js';

describe('Quest Advanced Tests', () => {
    describe('Complex Quest Configuration', () => {
        it('should create quest with prerequisites', () => {
            const quest = new Quest('Advanced Quest', 'Complex requirements', {
                prerequisites: {
                    level: 25,
                    quests: ['starter_quest', 'basic_training']
                },
                timeLimit: 3600
            });
            
            expect(quest.prerequisites.level).toBe(25);
            expect(quest.prerequisites.quests).toContain('starter_quest');
        });

        it('should create branching quest structure', () => {
            const quest = new Quest('Branching Story', 'Multiple paths');
            quest.addBranch({
                id: 'peaceful_path',
                requirements: { diplomacy: 75 },
                rewards: { reputation: 100 }
            });
            quest.addBranch({
                id: 'combat_path',
                requirements: { strength: 80 },
                rewards: { experience: 1000 }
            });
            
            expect(quest.branches).toHaveLength(2);
            expect(quest.branches[0].id).toBe('peaceful_path');
        });

        it('should handle timed quests', () => {
            const quest = new Quest('Urgent Mission', 'Time sensitive', {
                timeLimit: 1800
            });
            
            expect(quest.timeLimit).toBe(1800);
            expect(quest.hasTimeLimit).toBe(true);
        });

        it('should create repeatable quests', () => {
            const quest = new Quest('Daily Task', 'Repeatable quest', {
                repeatable: true,
                maxRepeats: 7,
                dailyLimit: 1
            });
            
            expect(quest.repeatable).toBe(true);
            expect(quest.maxRepeats).toBe(7);
            expect(quest.dailyLimit).toBe(1);
        });
    });

    describe('Quest Chains', () => {
        it('should create quest chains', () => {
            const quest1 = new Quest('Part 1', 'First in chain');
            const quest2 = new Quest('Part 2', 'Second in chain');
            const quest3 = new Quest('Part 3', 'Final in chain');
            
            quest1.setNext(quest2);
            quest2.setNext(quest3);
            
            expect(quest1.nextQuest).toBe(quest2);
            expect(quest2.nextQuest).toBe(quest3);
            expect(quest3.nextQuest).toBeNull();
        });

        it('should handle quest prerequisites', () => {
            const quest1 = new Quest('Preparation', 'Prepare for adventure');
            const quest2 = new Quest('Adventure', 'The main quest');
            
            quest2.setPrerequisites([quest1]);
            
            expect(quest2.prerequisites).toContain(quest1);
            expect(quest2.canStart([quest1])).toBe(true);
        });
    });

    describe('Special Quest Types', () => {
        it('should create escort quests', () => {
            const quest = new Quest('Royal Escort', 'Protect the princess', {
                type: 'escort',
                npc: 'princess_ariel',
                path: ['castle', 'forest', 'mountain', 'safe_haven']
            });
            
            expect(quest.type).toBe('escort');
            expect(quest.npc).toBe('princess_ariel');
            expect(quest.path).toHaveLength(4);
        });

        it('should create delivery quests', () => {
            const quest = new Quest('Special Delivery', 'Deliver important cargo', {
                type: 'delivery',
                item: 'royal_documents',
                from: 'castle',
                to: 'allied_kingdom',
                risk: 0.3
            });
            
            expect(quest.type).toBe('delivery');
            expect(quest.item).toBe('royal_documents');
            expect(quest.risk).toBe(0.3);
        });
    });
});