import State from "../../../lib/State.js";
import SoundName from "../../enums/SoundName.js";
import { sounds } from "../../globals.js";
import Level from "../../objects/Level.js";

export default class PlayState extends State {
	constructor() {
		super();
	}

	enter(parameters = {}) {
		sounds.play(SoundName.Grasswalk)
		this.level =  new Level(parameters ?? { level: 1 })
	}

	exit() {
		sounds.stop(SoundName.Grasswalk)
	}

	update(dt) {
		this.level.update(dt);
	}

	render() {
		this.level.render();
	}
}
