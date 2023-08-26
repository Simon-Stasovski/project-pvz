import Projectile from "./Projectile.js";
import Sprite from "../../../lib/Sprite.js"
import ImageName from "../../enums/ImageNames.js";
import { images } from "../../globals.js";
import Hitbox from "../../../lib/Hitbox.js";
import ProjectileType from "../../enums/ProjectileType.js";

export default class IcePea extends Projectile{
    constructor(position){
        super(position)
        this.FREEZE_SPEED_SCALAR = 0.5
        this.hitboxOffsets = new Hitbox(20)
        this.type = ProjectileType.Icepea
    }
    
    generateStaticPeaSprite() {
        return new Sprite(images.get(ImageName.Iceshooter), 91, 51, 21, 11)
    }

    generatePeaSprites() {
        const sprites = []

        sprites.push(new Sprite(images.get(ImageName.Iceshooter), 91, 44, 22, 18))
        sprites.push(new Sprite(images.get(ImageName.Iceshooter), 113, 44, 13, 18))
        sprites.push(new Sprite(images.get(ImageName.Iceshooter), 126, 44, 18, 18))
        sprites.push(new Sprite(images.get(ImageName.Iceshooter), 142, 44, 20, 18))

        return sprites
    }

    onCollision(e) {
        super.onCollision(e)
        e.freeze(this.FREEZE_SPEED_SCALAR)
    }
}