import State from "../../../../lib/State.js";
import Animation from "../../../../lib/Animation.js"

export default class PlantIdleState extends State {
    constructor(plant) {
        super();
        this.plant = plant;
    }

    enter() {
        this.plant.goIdle()
    }
}