import GameEntity from "../GameEntity.js"
import ZombieStateName from "../../enums/ZombieStateName.js";
import ZombieEatingState from "../../states/entity/Zombies/ZombieEatingState.js";
import ZombieMovingState from "../../states/entity/Zombies/ZombieMovingState.js";
import StateMachine from "../../../lib/StateMachine.js"
import Animation from "../../../lib/Animation.js"
import Vector from "../../../lib/Vector.js";
import Hitbox from "../../../lib/Hitbox.js";
import { sounds, timer } from "../../globals.js"
import SoundName from "../../enums/SoundName.js";
import { getRandomPositiveInteger } from "../../../lib/RandomNumberHelpers.js";

export default class Zombie extends GameEntity{
    static WIDTH = 64;
    static HEIGHT = 136;
    static CHOMP_SOUNDS = 2;
    static GROAN_SOUNDS = 6;

    constructor(position) {
        super(new Vector(Zombie.WIDTH, Zombie.HEIGHT), position)

        this.health = 100;
        this.speed = 20;

        this.spriteIndex = 0

        this.normalSprites = [this.generateMovingSprites(), this.generateEatingSprites()]
        this.frozenSprites = [this.generateFrozenMovingSprites(), this.generateFrozenEatingSprites()]
        this.currentSpriteSet = this.normalSprites

        this.stateMachine = this.initializeStateMachine()
        this.changeState(ZombieStateName.Moving)

        this.hitboxOffsets = new Hitbox(0, 45, 0, -60)  // hitbox remains within the correct row
        this.damage = 10

        this.renderPriority = 10

        this.frozen = false
        this.currSpeedModifier = 1

        sounds.play(SoundName.BaseGroan + getRandomPositiveInteger(1, Zombie.GROAN_SOUNDS))
    }

    update(dt) {
        super.update(dt)
        this.freezeTimer?.update(dt)
    }

    move(frames = [0, 1, 2, 3, 5, 6]) {
        this.spriteIndex = 0
        this.sprites = this.currentSpriteSet[this.spriteIndex]
        this.currentAnimation = new Animation(frames, 0.25);
    }   
    
    eat(frames = [0, 1, 2, 3, 5, 6]) {
        this.spriteIndex = 1
        this.sprites = this.currentSpriteSet[this.spriteIndex]
        this.currentAnimation = new Animation(frames, 0.25);
    }

    render(offset = { x: 2.6, y: 2.6 }) {
        super.render()
        if(this.sprites != undefined)
            this.sprites[this.currentAnimation.getCurrentFrame()].render(this.position.x, this.position.y, {x: offset.x, y: offset.y});
    }
    
    initializeStateMachine() {
        const stateMachine = new StateMachine();

        stateMachine.add(ZombieStateName.Eating, new ZombieEatingState(this));
        stateMachine.add(ZombieStateName.Moving, new ZombieMovingState(this));

        return stateMachine
    }

    onProjectileCollision(damage) {
        sounds.play(SoundName.ZombieHit)
        this.health -= damage
    }

    onPlantCollision(plant) {
        if (!(this.stateMachine.currentState instanceof ZombieEatingState)) this.changeState(ZombieStateName.Eating, { plant: plant })
    }

    freeze(speedScalar) {
        const FREEZE_LENGTH = 3.5
        if (!this.frozen) {
            this.frozen = true
            this.currSpeedModifier = speedScalar
            this.speed *= this.currSpeedModifier
            
            this.currentSpriteSet = this.frozenSprites
            this.sprites = this.currentSpriteSet[this.spriteIndex]

            this.freezeTimer = timer.wait(FREEZE_LENGTH, () => {
                if (this.frozen) {
                    this.frozen = false
                    this.speed /= (this.currSpeedModifier ?? 1)
            
                    this.currentSpriteSet = this.normalSprites
                    this.sprites = this.currentSpriteSet[this.spriteIndex]
                }
            })
        } else {
            this.freezeTimer.duration = FREEZE_LENGTH
        }
    }

    die() {
        super.die()
        sounds.play(SoundName.ZombieDie)
    }
}