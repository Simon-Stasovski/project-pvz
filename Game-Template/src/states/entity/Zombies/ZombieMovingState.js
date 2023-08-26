import State from "../../../../lib/State.js";

export default class ZombieMovingState extends State {
    constructor(zombie) {
        super();
        this.zombie = zombie;
    }

    enter() {
        this.zombie.move()
    }

    update(dt) {
        this.move(dt)
    }

    move(dt) {
        this.zombie.position.x -= this.zombie.speed * dt;

        // if hits the edge of the grid, player loses? loses health? etc
    }
}