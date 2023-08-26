import Zombie from "./Zombie.js";
import ImageNames from "../../enums/ImageNames.js"
import { images } from "../../globals.js";
import Sprite from "../../../lib/Sprite.js"
import Hitbox from "../../../lib/Hitbox.js";
import ZombieType from "../../enums/ZombieType.js";

export default class RegularZombie extends Zombie{
    constructor(position) {
        super(position);
        this.hitboxOffsets = new Hitbox(0, 33, 0, -60)
        this.type = ZombieType.Regular
    }
    
    render() {
        super.render({x: 2.4, y: 2.4})
    }

    generateMovingSprites() {
        const sprites = []
        for(let i = 0; i < 7; i++) sprites.push(new Sprite(images.get(ImageNames.RegularZombie), i * 30 + 132, 4, 28, 52))
        return sprites
    }

    generateEatingSprites() {
        const sprites = []
        for(let i = 0; i < 7; i++) sprites.push(new Sprite(images.get(ImageNames.RegularZombie), i * 36 + 348, 4, 34, 52))
        return sprites
    }

    generateFrozenMovingSprites() {
        const sprites = []
        for(let i = 0; i < 7; i++) sprites.push(new Sprite(images.get(ImageNames.FrozenRegularZombie), i * 30 + 132, 4, 28, 52))
        return sprites
    }
    generateFrozenEatingSprites() {
        const sprites = []
        for(let i = 0; i < 7; i++) sprites.push(new Sprite(images.get(ImageNames.FrozenRegularZombie), i * 36 + 348, 4, 34, 52))
        return sprites
    }
}