import Zombie from "./Zombie.js";
import ImageNames from "../../enums/ImageNames.js"
import { images } from "../../globals.js";
import Sprite from "../../../lib/Sprite.js"
import ZombieType from "../../enums/ZombieType.js";

export default class AthleteZombie extends Zombie{
    constructor(dimensions, position) {
        super(dimensions, position);
        this.speed = 35;
        this.type = ZombieType.Athlete
    }
    
    move() { super.move([0, 1, 2, 3, 4, 5, 6]) }

    eat() { super.eat([0, 1, 2, 3, 4]) }
    
    generateMovingSprites() {
        const sprites = []
        for(let i = 0; i < 7; i++) sprites.push(new Sprite(images.get(ImageNames.AthleteZombie), i * 29 + 333, 118, 27, 60))
        return sprites
    }

    generateEatingSprites() {
        const sprites = []
        for(let i = 0; i < 5; i++) sprites.push(new Sprite(images.get(ImageNames.AthleteZombie), i * 31 + 570, 118, 27, 60))
        return sprites
    }
    
    generateFrozenMovingSprites() {
        const sprites = []
        for(let i = 0; i < 7; i++) sprites.push(new Sprite(images.get(ImageNames.FrozenAthleteZombie), i * 29 + 333, 118, 27, 60))
        return sprites
    }

    generateFrozenEatingSprites() {
        const sprites = []
        for(let i = 0; i < 5; i++) sprites.push(new Sprite(images.get(ImageNames.FrozenAthleteZombie), i * 31 + 570, 118, 27, 60))
        return sprites
    }
}