import { images } from "../../globals.js";
import Plant from "./Plant.js";
import ImageNames from "../../enums/ImageNames.js"
import Sprite from "../../../lib/Sprite.js"
import Animation from "../../../lib/Animation.js";
import SunDroplet from "../SunDroplet.js";
import Vector from "../../../lib/Vector.js";
import PlantType from "../../enums/PlantType.js";

export default class Sunflower extends Plant{
    constructor(dimensions, position) {
        super(dimensions, position);
        this.SUN_DROPLET_AMOUNT = 25;
        this.actionTime = 8
        this.type = PlantType.Sunflower
    }

    actionAnimate(cycles = 0) {
        frames = [0, 1, 0, 1]
        this.sprites = this.actionSprites;
        this.currentAnimation = new Animation(frames, 1 / frames.length, cycles);
    }

    doAction() {
        this.level.addObject(new SunDroplet(this.SUN_DROPLET_AMOUNT, new Vector(
            this.position.x - Plant.OFFSET, this.position.y
        )))
    }

    generateActionSprites() {
        const sprites = []

        sprites.push(new Sprite(images.get(ImageNames.Sunflower), 3, 5, 29, 31))
        sprites.push(new Sprite(images.get(ImageNames.Sunflower), 3, 36, 29, 31))

        return sprites
    }

    generateIdleSprites(){
        const sprites = []
        
        for(let i = 0; i < 8; i++){
            sprites.push(new Sprite(images.get(ImageNames.Sunflower), (i * 29) + 3, 5, 29, 31))
        }
        return sprites
    }

    detectFacing(entity) {
        return true // always in action mode
    }

    // even if theres no zombie, stay in action mode
    noZombie(level) { this.facingZombie(level) }
}