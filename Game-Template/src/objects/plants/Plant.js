import GameObject from '../GameObject.js'
import StateMachine from "../../../lib/StateMachine.js"
import PlantStateName from "../../enums/PlantStateName.js";
import PlantIdleState from "../../states/entity/Plant/PlantIdleState.js"
import PlantActionState from "../../states/entity/Plant/PlantActionState.js"
import Animation from "../../../lib/Animation.js"
import Vector from '../../../lib/Vector.js';
import { sounds } from '../../globals.js';
import SoundName from '../../enums/SoundName.js';

export default class Plant extends GameObject {
    static WIDTH = 64;
    static HEIGHT = 80;
    static OFFSET = 8

    constructor(position){
        super(new Vector(Plant.WIDTH, Plant.HEIGHT), position)
        this.health = 100;
        this.actionSprites = this.generateActionSprites();
        this.idleSprites = this.generateIdleSprites();
        this.sprites = this.idleSprites;
        this.isCollidable = true;

        this.stateMachine = this.initializeStateMachine();
        this.changeState(PlantStateName.Idle)
        this.renderPriority = 1
        this.actionTime = 5
        this.overrideFrame = -1

        this.beenDug = false
        sounds.play(SoundName.Fertilizer)
    }

    // perform action (spawn pea, sundrop, etc) - empty for generic Plant class
    doAction() { }

    goIdle(cycles = 0) {
        if (this.stateMachine.currentState instanceof PlantActionState && !this.overrideAction) {
            sounds.play(SoundName.PlantAction)
            this.doAction()
        } else this.overrideAction = false  // if overrideAction is true, it means the action should be skipped once
        this.sprites = this.idleSprites;
        this.currentAnimation = new Animation([0, 1, 2, 3, 4, 6, 7], 0.1, cycles);
    }

    update(dt) {
        super.update(dt)
        this.stateMachine.update()
        this.currentAnimation?.update(dt);
        if (this.health <= 0) {
            this.toBeRemoved = true
            this.level.numberOfPlantsRemovedOrEaten++
        }
    }
    
    render() {
        super.render()
        if(this.sprites != undefined){
			this.sprites[this.currentAnimation.getCurrentFrame()].render(this.position.x, this.position.y, {x: 2.4, y: 2.4});
		}
    }

    initializeStateMachine() {
        const stateMachine = new StateMachine();

        stateMachine.add(PlantStateName.Idle, new PlantIdleState(this));
        stateMachine.add(PlantStateName.Action, new PlantActionState(this));

        return stateMachine
    }

    onCollision(collider) {
        super.onCollision(collider)
        collider.onPlantCollision(this)
    }

	changeState(state) {
		this.stateMachine.change(state);
	}

    facingZombie(lvl) {
        this.level = lvl
        if (!(this.stateMachine.currentState instanceof PlantActionState)) this.changeState(PlantStateName.Action)
    }

    noZombie() {
        if (!(this.stateMachine.currentState instanceof PlantIdleState)) this.changeState(PlantStateName.Idle)
    }

    // checks if the entity is on the same row, in front of the plant
    // uses hitbox since it's already adjusted to the grid, while pos + dimen will sometimes overflow
    detectFacing(entity) {
        return this.hitbox.position.y + this.hitbox.dimensions.y >= entity.hitbox.position.y
        && this.hitbox.position.y <= entity.hitbox.position.y + entity.hitbox.dimensions.y
        && entity.hitbox.position.x >= this.hitbox.position.x
    }

    dig() {
        sounds.play(SoundName.Dig)
        this.beenDug = true
    }

    removed() {
        super.removed()
        if (!this.beenDug) sounds.play(SoundName.PlantDie)
    }
}