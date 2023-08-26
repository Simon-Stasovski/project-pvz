import Sprite from '../../lib/Sprite.js';
import ImageName from "../enums/ImageNames.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, images, context } from "../globals.js";

export default class Background {
	static WIDTH = 450;
	static HEIGHT = 196;
	constructor(level) {
		this.level = level;
		this.sprites = Background.generateSprites();
		this.sunAmount = 0
		this.numberOfZombiesToKill = 0
	}

	render() {
		this.sprites[0].render(0, 0, { x: 3, y: 3 });
		this.sprites[1].render(236, 56, { x: 3, y: 3 });
		this.sprites[2].render(32, 224, { x: 3, y: 3 })
		this.sprites[3].render(32, 128, { x: 3, y: 3 })
		this.sprites[4].render(32, 320, { x: 3, y: 3 })
		this.sprites[5].render(32, 32, { x: 3, y: 3 })
		this.sprites[6].render(32, 416, { x: 0.5, y: 0.5 })
		context.save()

		context.font = '20px plantsvszombiesPlayState'
		context.textAlign = 'center';
		context.fillStyle = 'black';
		context.fillText(this.sunAmount, 72, 78);
	
		context.font = '40px plantsvszombiesPlayState'
		context.textAlign = 'center';
		context.fillStyle = 'black';
		context.fillText('Q', 125, 176);
		
		context.font = '40px plantsvszombiesPlayState'
		context.textAlign = 'center';
		context.fillStyle = 'black';
		context.fillText('W', 125, 269);

		context.font = '40px plantsvszombiesPlayState'
		context.textAlign = 'center';
		context.fillStyle = 'black';
		context.fillText('E', 125, 365);

		context.font = '40px plantsvszombiesPlayState'
		context.textAlign = 'center';
		context.fillStyle = 'black';
		context.fillText('D', 125, 462);

		context.font = '24px plantsvszombiesPlayState'
		context.textAlign = 'center';
		context.fillStyle = 'black';
		context.fillText('Day: ' + this.level, 67, 521);

		context.font = '24px plantsvszombiesPlayState'
		context.textAlign = 'center';
		context.fillStyle = 'black';
		context.fillText('Zombies Left: ' + this.numberOfZombiesToKill, 120, 557);

		context.restore()
	}
	update(sunAmount, numberOfZombiesToKill) {
		this.sunAmount = sunAmount
		this.numberOfZombiesToKill = numberOfZombiesToKill
	}
	static generateSprites() {
		return [
			new Sprite(images.get(ImageName.FrontYard), 0, 0, Background.WIDTH, Background.HEIGHT),
			new Sprite(images.get(ImageName.FrontYard), 248, 240, 254, 196),
			new Sprite(images.get(ImageName.Peashooter), 114, 37, 24, 22),
			new Sprite(images.get(ImageName.Sunflower), 33, 38, 25, 24),
			new Sprite(images.get(ImageName.Iceshooter), 169, 41, 27, 21),
			new Sprite(images.get(ImageName.SunDroplet), 27, 0, 26, 26),
			new Sprite(images.get(ImageName.Shovel), 0, 0, 139, 141)	
		];
	}
}
