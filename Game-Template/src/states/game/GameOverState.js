import State from "../../../lib/State.js";
import Sprite from "../../../lib/Sprite.js"
import ImageName from "../../enums/ImageNames.js";
import GameStateName from "../../enums/GameStateName.js"
import { images, keys, stateMachine, context, CANVAS_WIDTH, CANVAS_HEIGHT, sounds, localStorageKey } from "../../globals.js"
import SoundName from "../../enums/SoundName.js";

export default class GameOverState extends State {
	constructor() {
		super();
		this.gameOverSprite = new Sprite(images.get(ImageName.GameOverScreen), 0, 0, 1280, 720)
	}

	enter() {
		localStorage.setItem(localStorageKey, JSON.stringify({}))
		sounds.play(SoundName.LoseMusic)
	}

	update() {
		if(keys.Enter){
			keys.Enter = false;
			stateMachine.change(GameStateName.Play, { 
				level: 1
			})
		}
	}

	render() {
		this.gameOverSprite.render(0, 0, {x: 1350/1280, y: 1});
		context.save()

		context.font = '100px plantsvszombiesWinLoss'
		context.textAlign = 'center';
		context.fillStyle = 'white';
		context.fillText('Press Enter to Continue', CANVAS_WIDTH / 2 - 4, CANVAS_HEIGHT * 0.85 - 4);

		context.font = '100px plantsvszombiesWinLoss'
		context.textAlign = 'center';
		context.fillStyle = '#01E00F';
		context.fillText('Press Enter to Continue', CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.85);
		context.restore()
	}
}
