import State from "../../../lib/State.js";
import Sprite from "../../../lib/Sprite.js";
import {images, context, stateMachine, CANVAS_HEIGHT, CANVAS_WIDTH, keys, sounds, localStorageKey} from "../../globals.js"
import ImageName from "../../enums/ImageNames.js";
import GameStateName from "../../enums/GameStateName.js"
import SoundName from "../../enums/SoundName.js";

export default class TitleScreenState extends State {
	constructor() {
		super();
	
		this.background = new Sprite(images.get(ImageName.TitleScreen), 0, 0, 900, 506)
	}

	enter() {
		if (!this.checkLocalStorage()) sounds.play(SoundName.TitleTheme)
	}

	exit() {
		sounds.stop(SoundName.TitleTheme)
	}

	render() {
		this.background.render(0, 0, {x: 1.5, y: 1.2})

		context.save();
		context.font = '50px plantsvszombies';
		context.fillStyle = 'black';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText('Press Enter to Play', CANVAS_WIDTH / 2 - 3, CANVAS_HEIGHT - 40 - 3);
		context.font = '50px plantsvszombies';
		context.fillStyle = 'lightgrey';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText('Press Enter to Play', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 40);

		context.restore();
	}

	update(dt) {
		if (keys.Enter) {
			keys.Enter = false;

			stateMachine.change(GameStateName.Play, {
				level: 1
			});
		}
	}

	checkLocalStorage() {
		const levelData = JSON.parse(localStorage.getItem(localStorageKey)) ?? {};
		//console.log(levelData)	// to verify levelData without worrying about manipulation, just uncomment
		localStorage.setItem(localStorageKey, JSON.stringify({}))
		if (levelData.level) stateMachine.change(GameStateName.Play, levelData)
		return levelData.level
	}
}
