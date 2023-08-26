import Peashooter from "./Peashooter.js";
import { images } from "../../globals.js";
import ImageNames from "../../enums/ImageNames.js"
import Sprite from "../../../lib/Sprite.js"
import ProjectileType from "../../enums/ProjectileType.js";
import PlantType from "../../enums/PlantType.js";

export default class Iceshooter extends Peashooter{
    constructor(dimensions, position) {
        super(dimensions, position)
        this.projectileType = ProjectileType.Icepea
        this.type = PlantType.Iceshooter
    }

    generateActionSprites() {
        const sprites = []

        sprites.push(new Sprite(images.get(ImageNames.Iceshooter), 1, 32, 29, 32))
        sprites.push(new Sprite(images.get(ImageNames.Iceshooter), 30, 32, 27, 32))
        sprites.push(new Sprite(images.get(ImageNames.Iceshooter), 57, 32, 32, 32))

        return sprites
    }

    generateIdleSprites(){
        const sprites = []
        
        for(let i = 0; i < 8; i++){
            sprites.push(new Sprite(images.get(ImageNames.Iceshooter), i * 30, 1, 30, 30))
        }
        return sprites
    }
}