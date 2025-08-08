import { describe, it, expect } from 'vitest';
import { World } from './src/world.js';
import { Location } from './src/location.js';
import { NPC } from './src/npc.js';

describe('World System', () => {
    describe('World Creation', () => {
        it('should create a world with default locations', () => {
            const world = new World();
            expect(world.locations.length).toBeGreaterThan(0);
            expect(world.currentTime).toBe(0);
            expect(world.dayNightCycle).toBe(true);
        });

        it('should add locations to world', () => {
            const world = new World();
            const location = new Location('Town', 'A peaceful town');
            world.addLocation(location);
            
            expect(world.getLocation('Town')).toBe(location);
        });

        it('should not allow duplicate location names', () => {
            const world = new World();
            const location1 = new Location('Town', 'Description');
            const location2 = new Location('Town', 'Different description');
            
            world.addLocation(location1);
            expect(() => world.addLocation(location2)).toThrow('Location name already exists');
        });
    });

    describe('Day/Night Cycle', () => {
        it('should advance time correctly', () => {
            const world = new World();
            world.advanceTime(30);
            expect(world.currentTime).toBe(30);
        });

        it('should determine if it is day or night', () => {
            const world = new World();
            world.currentTime = 12 * 60; // Noon
            expect(world.isDaytime()).toBe(true);
            
            world.currentTime = 2 * 60; // 2 AM
            expect(world.isDaytime()).toBe(false);
        });

        it('should cycle day to night and back', () => {
            const world = new World();
            world.currentTime = 23 * 60 + 59; // 11:59 PM
            world.advanceTime(2); // 12:01 AM next day
            expect(world.currentDay).toBe(2);
        });
    });

    describe('Location Management', () => {
        it('should find location by name', () => {
            const world = new World();
            const location = new Location('Forest', 'A dark forest');
            world.addLocation(location);
            
            expect(world.findLocation('Forest')).toBe(location);
        });

        it('should handle location connections', () => {
            const world = new World();
            const town = new Location('Town', 'Safe town');
            const forest = new Location('Forest', 'Dangerous forest');
            
            town.addConnection(forest, 'north');
            world.addLocation(town);
            world.addLocation(forest);
            
            expect(town.getConnection('north')).toBe(forest);
        });

        it('should spawn NPCs in locations', () => {
            const world = new World();
            const town = new Location('Town', 'Town');
            const merchant = new NPC('Merchant', 'shopkeeper');
            
            town.addNPC(merchant);
            world.addLocation(town);
            
            expect(world.getNPCsAt('Town')).toContain(merchant);
        });
    });

    describe('Weather System', () => {
        it('should generate weather based on location', () => {
            const world = new World();
            const desert = new Location('Desert', 'Hot desert');
            world.addLocation(desert);
            
            world.setCurrentLocation(desert);
            const weather = world.getCurrentWeather();
            
            expect(weather.type).toMatch(/clear|sandstorm/);
        });

        it('should affect visibility', () => {
            const world = new World();
            world.setWeather('fog');
            expect(world.getVisibility()).toBeLessThan(100);
        });

        it('should change weather over time', () => {
            const world = new World();
            const initialWeather = world.getCurrentWeather();
            
            world.advanceTime(120); // 2 hours
            const newWeather = world.getCurrentWeather();
            
            expect(newWeather).not.toEqual(initialWeather);
        });
    });
});

