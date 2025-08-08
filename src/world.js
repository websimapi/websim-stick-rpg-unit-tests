import { Location } from './location.js';

export class World {
    constructor() {
        this.locations = [];
        this.currentTime = 0; // Time in minutes
        this.currentDay = 1;
        this.dayNightCycle = true;
        this.currentLocation = null;
        this.weather = { type: 'clear', visibility: 100 };
        
        // Add some default locations
        this.addLocation(new Location('Town', 'A peaceful town'));
        this.addLocation(new Location('Forest', 'A dark forest'));
    }
    
    addLocation(location) {
        const existingLocation = this.locations.find(loc => loc.name === location.name);
        if (existingLocation) {
            throw new Error('Location name already exists');
        }
        this.locations.push(location);
    }
    
    getLocation(name) {
        return this.locations.find(location => location.name === name);
    }
    
    findLocation(name) {
        return this.getLocation(name);
    }
    
    setCurrentLocation(location) {
        this.currentLocation = location;
    }
    
    advanceTime(minutes) {
        this.currentTime += minutes;
        
        // Handle day progression (24 hours = 1440 minutes)
        while (this.currentTime >= 1440) {
            this.currentTime -= 1440;
            this.currentDay++;
        }
        
        // Update weather periodically
        if (minutes >= 120) { // Every 2 hours
            this.updateWeather();
        }
    }
    
    isDaytime() {
        const hour = Math.floor(this.currentTime / 60);
        return hour >= 6 && hour < 18; // 6 AM to 6 PM
    }
    
    getNPCsAt(locationName) {
        const location = this.getLocation(locationName);
        return location ? location.npcs : [];
    }
    
    getCurrentWeather() {
        return this.weather;
    }
    
    setWeather(weatherType) {
        const weatherTypes = {
            'clear': { visibility: 100 },
            'fog': { visibility: 30 },
            'rain': { visibility: 70 },
            'sandstorm': { visibility: 20 }
        };
        
        this.weather = {
            type: weatherType,
            visibility: weatherTypes[weatherType]?.visibility || 100
        };
    }
    
    getVisibility() {
        return this.weather.visibility;
    }
    
    updateWeather() {
        const weatherTypes = ['clear', 'fog', 'rain'];
        if (this.currentLocation && this.currentLocation.name === 'Desert') {
            weatherTypes.push('sandstorm');
        }
        
        const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
        this.setWeather(randomWeather);
    }
}