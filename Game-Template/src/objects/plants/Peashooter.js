import { images } from "../../globals.js";
import Plant from "./Plant.js";
import ImageNames from "../../enums/ImageNames.js"
import Sprite from "../../../lib/Sprite.js"
import Animation from "../../../lib/Animation.js";
import ProjectileFactory from "../../services/ProjectileFactory.js";
import ProjectileType from "../../enums/ProjectileType.js";
import PlantType from "../../enums/PlantType.js";

export default class Peashooter extends Plant {
    static PEA_OFFSET = 6

    constructor(dimensions, position) {
        super(dimensions, position)
        this.projectileType = ProjectileType.Pea
        this.actionTime = 3
        this.type = PlantType.Peashooter
    }

    actionAnimate(cycles = 0) {
        frames = [0, 1, 2]
        this.sprites = this.actionSprites;
        this.currentAnimation = new Animation(frames, 0.1, cycles);
    }

    doAction() {
        this.level.addEntity(ProjectileFactory.createInstanceByPos(
            this.projectileType,
            this.position.x + this.dimensions.x + Peashooter.PEA_OFFSET,
            this.position.y + Peashooter.PEA_OFFSET
        ))
    }

    update(dt) {
        super.update(dt)
    }

    render() {
        super.render()
    }

    generateActionSprites() {
        const sprites = []

        sprites.push(new Sprite(images.get(ImageNames.Peashooter), 0, 32, 26, 30))
        sprites.push(new Sprite(images.get(ImageNames.Peashooter), 26, 32, 24, 30))
        sprites.push(new Sprite(images.get(ImageNames.Peashooter), 50, 32, 26, 30))

        return sprites
    }

    generateIdleSprites(){
        const sprites = []
        
        for(let i = 0; i < 8; i++){
            sprites.push(new Sprite(images.get(ImageNames.Peashooter), i * 27, 2, 26, 30))
        }
        return sprites
    }
}