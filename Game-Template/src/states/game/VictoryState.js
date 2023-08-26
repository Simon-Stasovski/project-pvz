import State from "../../../lib/State.js";
import Sprite from "../../../lib/Sprite.js";
import {images, context, stateMachine, CANVAS_HEIGHT, CANVAS_WIDTH, keys, sounds, localStorageKey} from "../../globals.js"
import ImageName from "../../enums/ImageNames.js";
import GameStateName from "../../enums/GameStateName.js"
import SoundName from "../../enums/SoundName.js";

export default class VictoryState extends State {
	constructor() {
		super();

		this.background = new Sprite(images.get(ImageName.VictoryScreen), 0, 0, 1920, 1080)

		this.starPlaceHolder = new Sprite(
			images.get(ImageName.StarPlaceHolder),
			0,
			0,
			558,
			210
		)
		this.stars = [];

		for (var i = 0; i < 3; i++){
			this.stars.push(new Sprite(images.get(ImageName.Star),
			0,
			0,
			130,
			120))
		}
	}

	enter(parameters) {
		sounds.play(SoundName.FinalFanfare)
		this.numberOfPlantsRemovedOrEaten = parameters.numberOfPlantsRemovedOrEaten;
		this.level = parameters.level;
		this.saveData = () => {
			localStorage.setItem(localStorageKey, JSON.stringify({ level: this.level + 1 }))
		}
		window.addEventListener('beforeunload', this.saveData)
	}

	exit() {
		window.removeEventListener('beforeunload', this.saveData)
	}

	update() {
		if (keys.Enter) {
			keys.Enter = false;

			stateMachine.change(GameStateName.Play, {
				level: this.level + 1,
			});
		}
	}

	render() {
		this.background.render(0, 0);

		context.save();
		context.font = '200px plantsvszombiesWinLoss';
		context.fillStyle = 'black';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText('Victory!', CANVAS_WIDTH / 2 - 7, CANVAS_HEIGHT / 2 - 207);

		context.font = '200px plantsvszombiesWinLoss';
		context.fillStyle = 'lightgrey';		
		context.fillText('Victory!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 200);


		context.font = '50px plantsvszombiesWinLoss';
		context.fillStyle = 'black';
		context.fillText('You live today but will you survive tomorrow?', CANVAS_WIDTH / 2 + 6, CANVAS_HEIGHT / 2 - 24);

		context.font = '50px plantsvszombiesWinLoss';
		context.fillStyle = 'lightgrey';
		context.fillText('You live today but will you survive tomorrow?', CANVAS_WIDTH / 2 + 10, CANVAS_HEIGHT / 2 - 20);
		this.starPlaceHolder.render(CANVAS_WIDTH / 2 - 279, CANVAS_HEIGHT / 2 + 10);
		
		this.stars[0].render(CANVAS_WIDTH / 2 - 275, CANVAS_HEIGHT / 2 + 65, {x: 1.25, y: 1.25});

		if(this.numberOfPlantsRemovedOrEaten < 5){
			this.stars[1].render(CANVAS_WIDTH / 2 - 95, CANVAS_HEIGHT / 2 + 15, {x: 1.4, y: 1.4});
			if(this.numberOfPlantsRemovedOrEaten < 3){
				this.stars[2].render(CANVAS_WIDTH / 2 + 115, CANVAS_HEIGHT / 2 + 65, {x: 1.25, y: 1.25});
			}
		}

		context.fillStyle = 'black';
		context.fillText('Press Enter to Continue to the next day', CANVAS_WIDTH / 2 - 4, CANVAS_HEIGHT - 44);
		
		context.fillStyle = 'lightgrey';
		context.fillText('Press Enter to Continue to the next day', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 40);
		context.restore();
	}
}
