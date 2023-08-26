import Zombie from "./Zombie.js";
import ImageNames from "../../enums/ImageNames.js"
import { images } from "../../globals.js";
import Sprite from "../../../lib/Sprite.js"
import ZombieType from "../../enums/ZombieType.js";

export default class ConeheadZombie extends Zombie{
    constructor(dimensions, position) {
        super(dimensions, position);
        this.health = 150;
        this.type = ZombieType.Conehead
    }

    generateMovingSprites() {
        const sprites = []
        for(let i = 0; i < 7; i++) sprites.push(new Sprite(images.get(ImageNames.ConeheadZombie), i * 27 + 112, 2, 25, 53))
        return sprites
    }

    generateEatingSprites() {
        const sprites = []
        for(let i = 0; i < 7; i++) sprites.push(new Sprite(images.get(ImageNames.ConeheadZombie), i * 31 + 304, 2, 29, 53))
        return sprites
    }

    generateFrozenMovingSprites() {
        const sprites = []
        for(let i = 0; i < 7; i++) sprites.push(new Sprite(images.get(ImageNames.FrozenConeheadZombie), i * 27 + 112, 2, 25, 53))
        return sprites
    }

    generateFrozenEatingSprites() {
        const sprites = []
        for(let i = 0; i < 7; i++) sprites.push(new Sprite(images.get(ImageNames.FrozenConeheadZombie), i * 31 + 304, 2, 29, 53))
        return sprites
    }
}