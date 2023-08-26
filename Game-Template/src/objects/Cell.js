import {context} from '../../src/globals.js'
import Vector from "../../lib/Vector.js"

export default class Cell {
	static CELL_WIDTH = 78
	static CELL_HEIGHT= 92
    constructor(position, plant = null) {
        this.position = position;
        this.dimensions = new Vector(Cell.CELL_WIDTH, Cell.CELL_HEIGHT);
        this.plant = plant;
    }
    render() {
		context.save();
		context.strokeStyle = 'black';
		context.beginPath();
		context.strokeRect(this.position.x, this.position.y , Cell.CELL_WIDTH, Cell.CELL_HEIGHT);
		context.stroke();
		context.closePath();
		context.restore();
    }
    isMouseHovering(mouse) {
        if(!(this.position.x > mouse.x + mouse.width ||
            this.position.x + this.dimensions.x < mouse.x ||
            this.position.y > mouse.y + mouse.height ||
            this.position.y + this.dimensions.y < mouse.y )){
                return true;
            }
    }
}