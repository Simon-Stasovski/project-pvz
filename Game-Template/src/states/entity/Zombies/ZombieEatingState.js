import State from "../../../../lib/State.js";
import Zombie from "../../../entities/zombies/Zombie.js";
import SoundName from "../../../enums/SoundName.js";
import ZombieStateName from "../../../enums/ZombieStateName.js";
import { sounds } from "../../../globals.js";
import { getRandomPositiveInteger } from "../../../../lib/RandomNumberHelpers.js";

export default class ZombieEatingState extends State {
    constructor(zombie) {
        super();
        this.zombie = zombie;
    }

    enter(params) {
        this.zombie.eat()
        this.plant = params?.plant
    }

    update(dt) {
        if (this.plant) {
            this.plant.health -= this.zombie.damage * dt
            sounds.play(SoundName.BaseChomp + getRandomPositiveInteger(1, Zombie.CHOMP_SOUNDS))
            if (this.plant.toBeRemoved) this.move()
        }
    }

    move() {
        this.zombie.changeState(ZombieStateName.Moving)
    }
}