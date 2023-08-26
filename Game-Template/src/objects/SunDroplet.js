import Sprite from '../../lib/Sprite.js';
import GameObject from './GameObject.js'
import ImageName from '../enums/ImageNames.js';
import { images } from "../globals.js";
import Vector from '../../lib/Vector.js';

export default class SunDroplet extends GameObject {
    static WIDTH = 52
    static HEIGHT = 52
    static X_OFFSET = 8
    static Y_OFFSET = 16

    constructor(amount, position, canBePickedUp = true) {
        position.x += SunDroplet.X_OFFSET
        position.y += SunDroplet.Y_OFFSET
        super(new Vector(SunDroplet.WIDTH, SunDroplet.HEIGHT), position)

        this.amount = amount

        this.sprites = this.generateSunDropletSprite();
        this.renderPriority = 200
        this.canBePickedUp = canBePickedUp
    }

    render() {
        super.render()
        this.sprites.render(this.position.x, this.position.y, {x: 2, y: 2})
    }
    
    generateSunDropletSprite(){
        return new Sprite(images.get(ImageName.SunDroplet), 27, 0, 26, 26)
    }
}