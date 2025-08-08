import { describe, it, expect, vi } from 'vitest';
import { Quest } from './src/quest.js';
import { QuestManager } from './src/quest-manager.js';
import { Character } from './src/character.js';

describe('Quest System - Comprehensive Master Suite', () => {
    describe('Quest Creation - Complete Property Coverage', () => {
        it('should create quests with all possible properties', () => {
            const quest = new Quest('Epic Campaign', 'The ultimate adventure', {
                id: 'campaign_1',
                type: 'main',
                difficulty: 'legendary',
                level: 50,
                category: 'campaign',
                prerequisites: ['complete_intro', 'reach_city'],
                faction: 'alliance',
                reputation: 1000,
                alignment: 'good',
                seasonal: false,
                timeLocked: false,
                prerequisites: { quests: ['starter_quest'], level: 10 },
                classRestrictions: ['mage', 'warrior'],
                skillRequirements: { lockpicking: 50 },
                statRequirements: { strength: 30, agility: 25 },
                professionRestrictions: ['armorsmith'],
                raceRestrictions: ['human', 'elf'],
                timed: true,
                timeLimit: 86400,
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-12-31'),
                repeatable: true,
                maxRepeats: 50,
                dailyLimit: 3,
                weeklyLimit: 20,
                monthlyLimit: 100,
                rewardScaling: 1.5,
                difficultyScaling: 1.2,
                failureConsequences: { experience: -100, reputation: -50 },
                partialRewards: true,
                autoStart: false,
                autoComplete: false,
                hiddenRewards: true,
                dynamicObjectives: true,
                randomRewards: true,
                groupQuest: true,
                minPlayers: 2,
                maxPlayers: 5,
                pvpAllowed: false
            });

            expect(quest.id).toBe('campaign_1');
            expect(quest.type).toBe('main');
            expect(quest.difficulty).toBe('legendary');
            expect(quest.timeLimit).toBe(86400);
            expect(quest.maxRepeats).toBe(50);
        });

        it('should handle quest creation with deeply nested conditions', () => {
            const quest = new Quest('Complex Conditions', 'Test', {
                conditions: {
                    weather: ['rainy', 'stormy'],
                    timeOfDay: ['night', 'midnight'],
                    dayOfWeek: [1, 3, 5],
                    phase: ['new_moon', 'full_moon'],
                    worldState: { war: false, plague: false },
                    npcState: { guards_asleep: true }
                },
                modifiers: {
                    experience: 2.5,
                    gold: 1.5,
                    reputation: 3.0
                }
            });

            expect(quest.conditions.weather).toContain('rainy');
            expect(quest.modifiers.experience).toBe(2.5);
        });

        it('should create branching quest structures', () => {
            const quest = new Quest('Branching Story', 'Multiple outcomes');
            quest.addBranch({
                id: 'peace_path',
                requirements: { diplomacy: 75, no_killings: true },
                rewards: { reputation: 100, peace_treaty: 1 }
            });
            quest.addBranch({
                id: 'war_path',
                requirements: { combat_victories: 10 },
                rewards: { experience: 1000, war_tokens: 5 }
            });

            expect(quest.branches).toHaveLength(2);
            expect(quest.branches[0].id).toBe('peace_path');
        });
    });

    describe('Objectives - Ultra Comprehensiveness', () => {
        it('should create kill objectives with detailed conditions', () => {
            const quest = new Quest('Extermination', 'Kill specific enemies');
            quest.addObjective('kill', 'goblin_shaman', 5, {
                conditions: {
                    location: 'dark_forest',
                    time: 'night',
                    weather: 'fog',
                    health_threshold: 0.3,
                    method: ['fire', 'ice', 'physical']
                },
                modifiers: {
                    experience: 2.0,
                    loot: 1.5,
                    reputation: -10
                },
                tracking: {
                    solo: true,
                    assists_allowed: 3,
                    group_bonus: 0.5
                }
            });

            const objective = quest.getObjective('kill', 'goblin_shaman');
            expect(objective.conditions.weather).toBe('fog');
            expect(objective.modifiers.experience).toBe(2.0);
        });

        it('should create collection objectives with discovery mechanics', () => {
            const quest = new Quest('Collectible Masterpiece', 'Gather rare items');
            quest.addObjective('collect', 'ancient_scroll', 7, {
                discovery: {
                    search_locations: ['library', 'archives', 'temple'],
                    search_methods: ['investigate', 'disarm_trap', 'unlock'],
                    rarity_weights: { common: 0.7, uncommon: 0.2, rare: 0.08, legendary: 0.02 }
                },
                crafting_integration: true,
                trade_allowed: true,
                loss_penalty: 2
            });

            const objective = quest.getObjective('collect', 'ancient_scroll');
            expect(objective.discovery.search_locations).toContain('library');
        });

        it('should create exploration objectives with discovery chains', () => {
            const quest = new Quest('World Explorer', 'Discover all lands');
            quest.addObjective('explore', 'hidden_caverns', 15, {
                discovery: {
                    sequential: true,
                    prerequisites: ['discover_map', 'hire_guide'],
                    time_gates: { hours: 24 },
                    weather_dependency: ['clear', 'sunny']
                },
                tracking: {
                    partial_discovery: 0.1,
                    bonus_locations: 2,
                    hidden_areas: 3
                }
            });
        });

        it('should create delivery objectives with risk mechanics', () => {
            const quest = new Quest('Courier Master', 'Transport valuable cargo');
            quest.addObjective('deliver', 'royal_documents', 3, {
                transport_challenges: {
                    caravan: { risk: 0.3, speed: 0.5, capacity: 50 },
                    horse: { risk: 0.6, speed: 0.8, capacity: 10 },
                    walking: { risk: 0.1, speed: 0.3, capacity: 5 }
                },
                weather_risks: {
                    rain: { damage: 5, speed: -0.2 },
                    storm: { risk: 0.8, damage: 20 },
                    fog: { speed: -0.3, evasion: 0.2 }
                },
                bandit_events: {
                    encounter_chance: 0.15,
                    combat_difficulty: 'hard',
                    negotiation_chance: 0.6
                }
            });
        });

        it('should create escort objectives with NPC AI', () => {
            const quest = new Quest('Royal Escort', 'Protect important NPC');
            quest.addObjective('escort', 'princess_ariel', 1, {
                npc_behavior: {
                    personality: 'timid',
                    decision_making: 'ai_driven',
                    relationships: { likes: ['friendly_npc'], fears: ['orcs'] }
                },
                escort_challenges: {
                    path_variants: 5,
                    ambush_zones: 3,
                    safe_zones: 7,
                    checkpoint_system: true
                },
                failure_conditions: {
                    death: { quest_fail: true },
                    injury: { reputation_loss: 100 },
                    abandonment: { experience_loss: 500 }
                }
            });
        });

        it('should handle complex composite objectives', () => {
            const quest = new Quest('Master Quest', 'Complete the impossible');
            quest.addCompositeObjective('master_objective', {
                phases: [
                    {
                        name: 'investigation',
                        objectives: [
                            { type: 'collect', target: 'clues', required: 10 },
                            { type: 'explore', target: 'crime_scene', required: 1 }
                        ]
                    },
                    {
                        name: 'confrontation',
                        objectives: [
                            { type: 'escort', target: 'witness', required: 1 },
                            { type: 'kill', target: 'assassin', required: 3 }
                        ]
                    },
                    {
                        name: 'resolution',
                        objectives: [
                            { type: 'deliver', target: 'report', required: 1 }
                        ]
                    }
                ],
                sequence: 'parallel_first',
                failure_handling: 'restart_phase'
            });
        });

        it('should create timed challenge objectives', () => {
            const quest = new Quest('Speed Challenge', 'Race against time');
            quest.addObjective('timed_challenge', 'ancient_relic', 1, {
                time_limit_phases: [
                    { phase: 'discovery', time: 300 },
                    { phase: 'preparation', time: 600 },
                    { phase: 'execution', time: 1800 }
                ],
                penalty_phases: [
                    { phase: 'overtime', penalty: 0.1, max: 0.5 },
                    { phase: 'rushing', penalty: 0.3 }
                ],
                speed_bonus: {
                    tiers: [
                        { time: 1500, multiplier: 3.0 },
                        { time: 1800, multiplier: 2.0 },
                        { time: 2100, multiplier: 1.5 }
                    ]
                }
            });
        });

        it('should handle escort objectives with NPC needs', () => {
            const quest = new Quest('Complex Escort', 'Guide demanding NPC');
            quest.addObjective('escort_npcs', 'noble_lord', 5, {
                npc_needs: {
                    meals: { times: 3, variety: 'luxury', locations: ['inn', 'castle'] },
                    rest: { locations: ['safe_houses'], frequency: 6, duration: 8 },
                    entertainment: { types: ['music', 'story'], requirements: { skill: 50 } }
                },
                escort_dynamics: {
                    npc_aggression: 0.3,
                    npc_intelligence: 'high',
                    cooperation_bonus: { experience: 500 },
                    stress_system: {
                        buildup: 0.1,
                        resolution: { camp_songs: -0.5, gifts: -0.3 }
                    }
                },
                multiple_escorts: {
                    simultaneous: 3,
                    shared_resources: true,
                    chain_reactions: ['anger', 'joy', 'fear'],
                    group_decisions: { democratic: true, leader: 'charismatic' }
                }
            });
        });
    });

    describe('Quest Management - Distributed Systems', () => {
        it('should handle quest chains spanning hundreds of quests', () => {
            const manager = new QuestManager();
            const questCount = 100;
            const quests = [];
            
            for (let i = 0; i < questCount; i++) {
                const quest = new Quest(`Chain Quest ${i}`, `Part ${i} of mega quest`);
                quest.setChainRelation(i > 0 ? `${i-1}` : null, i < questCount-1 ? `${i+1}` : null);
                quests.push(quest);
                manager.addQuest(quest);
            }

            expect(manager.getQuestChainLength('0')).toBe(questCount);
            
            const char = new Character('ChainRunner');
            for (let i = 0; i < 5; i++) {
                manager.assignQuest(quests[i].id, char);
                quests[i].complete();
            }

            const available = manager.getAvailableQuests();
            expect(available).toContain(quests[5]);
        });

        it('should handle time-synchronized global quests', () => {
            const manager = new QuestManager();
            const globalQuest = new Quest('World Event: Dragon War', 'Server-wide battle', {
                type: 'global',
                startTime: { world: '2024-12-25T00:00:00Z', character: 'immediate' },
                repeatCycle: { weekly: true, max_cycles: 13 },
                participation: 'server_wide',
                phasing: { synchronized: true, phases: ['stage_prep', 'war', 'cleanup'] }
            });

            manager.addQuest(globalQuest);
            
            expect(manager.getGlobalQuests()).toHaveLength(1);
            expect(globalQuest.phases).toHaveLength(3);
        });

        it('should handle AI-driven quest adaptation', () => {
            const manager = new QuestManager();
            const adaptiveQuest = new Quest('AI Adventure', 'Evolving story', {
                adaptive: true,
                aiParameters: {
                    player_level_scaling: 1.2,
                    difficulty_curve: 'dynamic',
                    story_branches: 15,
                    consequence_weighting: 0.7
                },
                dynamicContent: {
                    objectives: 'ai_generated',
                    rewards: 'scaled',
                    npc_reactions: 'behavioral'
                }
            });

            const char = new Character('AIPlayer', null, 25);
            manager.addQuest(adaptiveQuest);
            manager.assignQuest(adaptiveQuest.id, char);

            const adapted = manager.adaptQuestProgress(adaptiveQuest.id, char);
            expect(adapted.level).toBe(30); // 25 * 1.2
        });

        it('should handle quest delegation and subcontracting', () => {
            const manager = new QuestManager();
            const masterQuest = new Quest('Guild Master Directive', 'Delegate responsibilities', {
                delegatable: true,
                subcontract_rules: {
                    max_delegations: 5,
                    allowed_subcontractors: ['guild_members', 'allies'],
                    profit_sharing: { leader: 0.2, worker: 0.8 },
                    quality_requirements: { min_quality: 80, penalty: 0.1 }
                },
                delegation_tree: {
                    levels: 3,
                    branching_factor: 5,
                    verification_method: 'quality_check'
                }
            });

            manager.addQuest(masterQuest);
            
            const subquest1 = masterQuest.createSubcontract('guild_member_1', { share: 0.4 });
            const subquest2 = masterQuest.createSubcontract('guild_member_2', { share: 0.3 });
            
            expect(subquest1.parentId).toBe(masterQuest.id);
            expect(subquest1.profitShare).toBe(0.4);
        });

        it('should handle cross-server quest coordination', () => {
            const manager = new QuestManager();
            const crossServerQuest = new Quest('Multi-Realm Crisis', 'Coordinated world event', {
                crossServer: true,
                coordination: {
                    server_count: 50,
                    leader_server: 'main',
                    synchronization: 'epoch_based',
                    merge_strategies: ['average_progression', 'max_contribution', 'democratic_voting']
                },
                event_phases: {
                    preparation: { global_duration: 86400 },
                    execution: { dynamic_duration: true, max_duration: 604800 },
                    resolution: { vote_duration: 3600 }
                }
            });

            manager.addQuest(crossServerQuest);
            
            const serverMetrics = manager.getCrossServerMetrics(crossServerQuest.id);
            expect(serverMetrics.server_count).toBe(50);
            expect(serverMetrics.phases).toHaveLength(3);
            
            expect(manager.isCrossServerLeader()).toBe(true);
        });

        describe('Complex Quest States - Temporal', () => {
            it('should handle quest states with timezone awareness', () => {
                const quest = new Quest('Global Quest', 'Worldwide event', {
                    timezone: 'UTC',
                    daylight_saving: true,
                    regions: ['EST', 'PST', 'CET', 'JST'],
                    synchronization: { type: 'concurrent', tolerance: 300 }
                });

                const now = new Date('2024-07-15T12:00:00Z');
                quest.updateTimezones(now);
                
                expect(quest.getRegionalTime('EST')).toBe(8); // 08:00 EST
                expect(quest.getRegionalTime('PST')).toBe(5); // 05:00 PST
            });

            it('should handle quest failure cascades', () => {
                const quest = new Quest('Critical Mission', 'Must succeed or consequences', {
                    cascade_failure: true,
                    failure_effects: {
                        immediate: ['reputation_loss', 'faction_status_change'],
                        delayed: ['quest_lockout_24h', 'world_state_change'],
                        permanent: ['ending_modifier', 'achievement_revocation']
                    },
                    mitigation_strategies: {
                        retry_after_failure: 3,
                        partial_completion_rewards: true,
                        fallback_quests: ['recovery_mission_1', 'recovery_mission_2']
                    }
                });

                quest.fail();
                
                expect(quest.hasFailed).toBe(true);
                expect(quest.failureConsequences.length).toBeGreaterThan(0);
            });

            it('should handle quest persistence across long durations', () => {
                const quest = new Quest('Long Running', 'Campaign spanning years', {
                    persistence: {
                        save_state: { local: true, cloud: true },
                        sync_method: 'incremental',
                        conflict_resolution: 'merge_priority',
                        data_integrity: { checksum: true, verification: true }
                    },
                    versioning: {
                        version_control: true,
                    },
                    snapshot_creation: {
                        automatic: { days: 7 },
                        manual: { allow_user: true },
                        max_snapshots: 100
                    },
                    rollback_capabilities: {
                        automatic_rollback: { days: 1 },
                        manual_rollback: true,
                        rollback_validation: 'server_verified'
                    }
                });

                quest.updateProgress('long_progress', 1, { method: 'incremental' });
                
                expect(quest.getSnapshots().length).toBeGreaterThan(0);
                expect(quest.canRollback).toBe(true);
            });

            it('should handle quest states with machine learning adaptation', () => {
                const quest = new Quest('Learning Adventure', 'AI evolved quest');
                quest.aiFeatures({
                    machine_learning: true,
                    adaptation: {
                        player_behavior: {
                            tracking: ['completion_time', 'choice_frequency', 'failure_patterns'],
                            adaptation_rate: 0.1,
                            min_samples: 50
                        },
                        content_generation: {
                            objective_variation: 0.3,
                            reward_modification: 0.2,
                            difficulty_adjustment: 0.15
                        },
                        prediction_model: {
                            neural_network: 'simple_lstm',
                            training_data: 'player_history',
                            model_retention: '30_days'
                        }
                    }
                });

                // Simulate player behavior
                quest.recordPlayerAction('chose_diplomatic_solution', { attempts: 2 });
                quest.recordPlayerAction('failed_combat_attempt', { count: 3 });
                
                const adapted = quest.generateAdaptation();
                expect(adapted.usesML).toBe(true);
            });
        });

        describe('Integration Tests - Full Systems', () => {
            it('should handle a complete RPG quest lifecycle from simple to epic', async () => {
                const manager = new QuestManager();
                const farmer = new Character('Farmer Tom', null, 1);
                
                // Level 1: Simple Fetch
                const simpleQuest = new Quest('Fetch Water', 'Get water from well', {
                    level: 1,
                    experience: 50,
                    gold: 10,
                    timeLimit: 1800
                });
                simpleQuest.addObjective('collect', 'water', 1);
                manager.addQuest(simpleQuest);
                manager.assignQuest(simpleQuest.id, farmer);
                
                // Simulate completion
                simpleQuest.updateProgress('collect', 'water', 1);
                simpleQuest.complete();
                manager.giveRewards(simpleQuest, farmer);
                
                expect(farmer.level).toBe(2);
                expect(farmer.experience).toBe(50);
                
                // Level 10: Medium Adventure
                for (let l = 2; l < 10; l++) {
                    farmer.gainExperience(l * 100);
                }
                
                const mediumQuest = new Quest('Goblin Hunt', 'Clear goblin camp', {
                    level: 10,
                    experience: 500,
                    gold: 200,
                    faction: 'town'
                });
                mediumQuest.addObjective('kill', 'goblin_warriors', 8);
                mediumQuest.addObjective('collect', 'goblin_ears', 15);
                
                manager.addQuest(mediumQuest);
                manager.assignQuest(mediumQuest.id, farmer);
                
                // Simulate partial completion
                mediumQuest.updateProgress('kill', 'goblin_warriors', 5);
                mediumQuest.updateProgress('collect', 'goblin_ears', 10);
                
                expect(mediumQuest.completionPercent).toBeLessThan(100);
                
                // Level 50: Epic Raid
                farmer.level = 50;
                const epicQuest = new Quest('Dragon Slayer', 'Defeat the ancient black dragon', {
                    level: 50,
                    difficulty: 'legendary',
                    raid: true,
                    minPlayers: 20,
                    maxPlayers: 40,
                    phases: ['reconnaissance', 'bait_preparation', 'dragon_fight', 'epilogue']
                });
                
                epicQuest.addObjective('kill', 'dragon_kalariyx', 1);
                epicQuest.addObjective('save', 'hostage_prince', 1);
                epicQuest.addObjective('destroy', 'dragon_egg_cache', 12);
                epicQuest.addObjective('protect', 'ritual_casters', 5);
                
                manager.addQuest(epicQuest);
                expect(epicQuest.isAvailableTo(farmer)).toBe(true);
            });

            it('should simulate 1000 concurrent quests with performance metrics', () => {
                const manager = new QuestManager();
                const players = Array.from({ length: 100 }, (_, i) => 
                    new Character(`Player${i}`, null, 15 + Math.floor(Math.random() * 50))
                );

                // Create quest pool
                const questTemplates = [
                    { type: 'kill', baseLevel: 15 },
                    { type: 'collect', baseLevel: 20 },
                    { type: 'explore', baseLevel: 25 },
                    { type: 'escort', baseLevel: 30 }
                ];

                for (let i = 0; i < 1000; i++) {
                    const template = questTemplates[i % questTemplates.length];
                    const level = template.baseLevel + Math.floor(Math.random() * 20);
                    
                    const quest = new Quest(`${template.type}_${i}`, `Automated ${template.type} quest`, {
                        level,
                        experience: level * 10,
                        gold: level * 5,
                        timeLimit: 3600
                    });

                    if (template.type === 'kill') {
                        quest.addObjective('kill', 'enemy', level);
                    } else if (template.type === 'collect') {
                        quest.addObjective('collect', 'item', level);
                    } else if (template.type === 'explore') {
                        quest.addObjective('explore', 'location', Math.floor(level/3));
                    } else {
                        quest.addObjective('escort', 'npc', level);
                    }

                    manager.addQuest(quest);
                }

                // Assign quests to players
                const startTime = performance.now();
                players.forEach(player => {
                    const available = manager.getAvailableQuests(player.level);
                    if (available.length > 0) {
                        const randomQuest = available[Math.floor(Math.random() * available.length)];
                        manager.assignQuest(randomQuest.id, player);
                    }
                });

                const endTime = performance.now();
                const setupTime = endTime - startTime;

                expect(setupTime).toBeLessThan(1000); // Should complete setup within 1 second
                expect(manager.activeQuests.length).toBe(players.length);
            });
        });
    });
});