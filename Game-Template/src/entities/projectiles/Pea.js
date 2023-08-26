import Projectile from "./Projectile.js";
import Sprite from "../../../lib/Sprite.js"
import ImageName from "../../enums/ImageNames.js";
import { images } from "../../globals.js";
import Hitbox from "../../../lib/Hitbox.js";
import ProjectileType from "../../enums/ProjectileType.js";

export default class Pea extends Projectile{
    constructor(position){
        super(position)
        this.hitboxOffsets = new Hitbox(-3, -2)
        this.type = ProjectileType.Pea
    }
    generateStaticPeaSprite() {
        return new Sprite(images.get(ImageName.Peashooter), 78, 43, 10, 10)
    }

    generatePeaSprites() {
        const sprites = []

        sprites.push(new Sprite(images.get(ImageName.Peashooter), 78, 40, 11, 15))
        sprites.push(new Sprite(images.get(ImageName.Peashooter), 89, 40, 11, 15))
        sprites.push(new Sprite(images.get(ImageName.Peashooter), 100, 40, 13, 15))

        return sprites
    }
}