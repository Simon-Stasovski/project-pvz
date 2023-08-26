import State from "../../../../lib/State.js";

export default class PlantActionState extends State {
    constructor(plant) {
        super();
        this.plant = plant;
    }

    enter() {
        this.performingAction = false
        this.action()
    }

    update(dt) {
        if (this.plant.currentAnimation.isDone()) this.action()
    }

    action(dt) {
        if (this.plant.overrideAction) this.performingAction = true // if the action should be overriden, ie no action should be performed
        const IDLE_ANIMATION_LENGTH = .7
        let animationCycles = Math.floor(this.plant.actionTime / IDLE_ANIMATION_LENGTH)
        if (this.performingAction) this.plant.goIdle(animationCycles)
        else this.plant.actionAnimate(1)

        this.performingAction = !this.performingAction
    }
}