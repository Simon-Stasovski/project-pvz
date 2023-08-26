import GameEntity from "../GameEntity.js";
import Animation from "../../../lib/Animation.js"
import Vector from "../../../lib/Vector.js";

export default class Projectile extends GameEntity{
    static WIDTH = 32;
    static HEIGHT = 32;

    constructor(position){
        super(new Vector(Projectile.WIDTH, Projectile.HEIGHT), position)
        this.damage = 25
        this.speed = 100
        this.isBreaking = false
        this.staticSprite = this.generateStaticPeaSprite()
        this.breakingSprites = this.generatePeaSprites()
        this.sprites = this.staticSprite
        this.renderPriority = 100
    }

    update(dt) {
        super.update(dt)
        if(this.isBreaking) {
            if (this.currentAnimation.isDone()) this.isDead = true
            else this.currentAnimation?.update(dt);
        } else {
            this.position.x += this.speed * dt;
        }
    }

    render() {
        super.render()
        if(this.isBreaking && this.sprites != undefined){
			this.sprites[this.currentAnimation.getCurrentFrame()].render(this.position.x, this.position.y, {x: 2.4, y: 2.4});
            return;
        }
        this.sprites.render(this.position.x, this.position.y, {x: 2.4, y: 2.4});
    }

    onCollision(e) {
        if (this.isBreaking) return
        this.isBreaking = true
        this.sprites = this.breakingSprites;
        this.currentAnimation = new Animation([0, 1, 2], 0.2, 1);
        e.onProjectileCollision(this.damage)
    }
}