import Background from "./Background.js";
import Cell from "./Cell.js";
import Vector from "../../lib/Vector.js"
import { canvas, keys, localStorageKey, stateMachine, timer } from "../globals.js";
import PlantFactory from "../services/PlantFactory.js"
import ZombieFactory from "../services/ZombieFactory.js"
import PlantType from "../enums/PlantType.js"
import GameStateName from "../enums/GameStateName.js"
import ZombieType from "../enums/ZombieType.js"
import Plant from "./plants/Plant.js";
import Zombie from "../entities/zombies/Zombie.js"
import Projectile from "../entities/projectiles/Projectile.js";
import SunDroplet from "../objects/SunDroplet.js"
import {getRandomPositiveInteger} from "../../lib/RandomNumberHelpers.js"
import ProjectileFactory from "../services/ProjectileFactory.js";

export default class Level {
	static NUM_OF_CELLS_WIDTH = 9
	static NUM_OF_CELLS_HEIGHT = 5
	static BEFORE_CELLS = 176

	static SUNFLOWER_COST = 50
	static PEASHOOTER_COST = 100
	static ICESHOOTER_COST = 175
	static RETURNED_ON_DIG = 25
	static GRACE_PERIOD = 20
	static STARTING_SUN = 100
	static SUN_TIME = 10
	static SKY_SUN_VALUE = 50
	static SKY_SUN_CELLS_PER_SECOND = 0.75

	constructor(parameters) {
		this.numberOfPlantsRemovedOrEaten = parameters.numberOfPlantsRemovedOrEaten ?? 0;
		this.gracePeriod = parameters.gracePeriod ?? Level.GRACE_PERIOD;
		this.currentGrace = {}
		this.level = parameters.level ?? 1;
		this.spawnZombie = true;
		this.spawnSun = true
		this.background = new Background(this.level);
		this.gameGrid = []
		this.numberOfZombiesToSpawn = parameters.numberOfZombiesToSpawn ?? this.level * 5 + getRandomPositiveInteger(0, 5)
		this.numberOfZombiesToKill = parameters.numberOfZombiesToKill ?? this.numberOfZombiesToSpawn
		this.sunAmount = parameters.sunAmount ?? Level.STARTING_SUN
		this.mouse = {
			x: 10,
			y: 10,
			width: 0.1,
			height: 0.1
		}
		
		this.entities = []
		this.objects = []

		for(let i = 0; i < Level.NUM_OF_CELLS_WIDTH; i++){
			this.gameGrid[i] = [];
			for(let j = 0; j < Level.NUM_OF_CELLS_HEIGHT; j++){
				this.gameGrid[i].push(new Cell(new Vector((i + 1) * Cell.CELL_WIDTH + Level.BEFORE_CELLS, (j + 1) * Cell.CELL_HEIGHT)));
				if (parameters.plants && parameters.plants[i][j]) {
					let plant = PlantFactory.createInstance(parameters.plants[i][j].type, this.gameGrid[i][j])
					plant.health = parameters.plants[i][j].health
					plant.level = this
					plant.overrideAction = true
					this.gameGrid[i][j].plant = plant
					this.addObject(plant)
				}
			}
		}

		if (parameters.zombies) parameters.zombies.forEach(z => {
					let zombie = ZombieFactory.createInstanceByPos(z.type, z.x, z.y)
					zombie.health = z.health
					this.addEntity(zombie)
		})

		if (parameters.projectiles) parameters.projectiles.forEach(p => this.addEntity(ProjectileFactory.createInstanceByPos(p.type, p.x, p.y)))

		if (parameters.sundrops) parameters.sundrops.forEach(s => this.addObject(new SunDroplet(s.amount, new Vector(s.x, s.y))))

		this.canvasPosition = canvas.getBoundingClientRect();

		this.renderQueue = this.buildRenderQueue()
		
		canvas.addEventListener('mousemove', (e) => {
			this.mouse.x = e.x - this.canvasPosition.left;
			this.mouse.y = e.y - this.canvasPosition.top;
		})
		canvas.addEventListener('mouseleave', (e) => {
			this.mouse.x = 0;
			this.mouse.y = 0; 
		})

		this.saveData = () => {
			const levelData = {}

			levelData.sunAmount = this.sunAmount
			levelData.numberOfZombiesToSpawn = this.numberOfZombiesToSpawn
			levelData.numberOfZombiesToKill = this.numberOfZombiesToKill
			levelData.level = this.level
			levelData.numberOfPlantsRemovedOrEaten = this.numberOfPlantsRemovedOrEaten
			levelData.gracePeriod = this.gracePeriod - (this.currentGrace.totalTime ?? 0)

			levelData.plants = []
			for (let i = 0; i < this.gameGrid.length; i++) {
				levelData.plants[i] = []
				for (let j = 0; j < this.gameGrid[i].length; j++) {
					levelData.plants[i][j] = this.gameGrid[i][j].plant ? {
						"type": this.gameGrid[i][j].plant?.type,
						"health": this.gameGrid[i][j].plant?.health,
						"currentFrame": this.gameGrid[i][j].plant?.currentAnimation.currentFrame
					} : null
				}
			}

			levelData.sundrops = []
			this.objects.filter(s => s instanceof SunDroplet).forEach(s =>
				levelData.sundrops.push({
					"x": s.position.x,
					"y": s.position.y,
					"amount": s.amount
			}))

			levelData.zombies = []
			this.entities.filter(z => z instanceof Zombie).forEach(z =>
				levelData.zombies.push({
					"type": z.type,
					"x": z.position.x,
					"y": z.position.y,
					"health": z.health
			}))

			levelData.projectiles = []
			this.entities.filter(p => p instanceof Projectile).forEach(p =>
				levelData.projectiles.push({
					"type": p.type,
					"x": p.position.x,
					"y": p.position.y,
			}))

			localStorage.setItem(localStorageKey, JSON.stringify(levelData))
		}
		
		// when user closes/refreshes tab, save level
		window.addEventListener('beforeunload', this.saveData)
	}

	addEntity(entity) {
		this.entities.push(entity)
	}

	addObject(object) {
		this.objects.push(object)
	}

	update(dt) {
		this.renderQueue = this.buildRenderQueue()
		this.addZombie()
		this.dropSun()
		this.cleanUpEntities()
		this.cleanUpObjects()
		this.cleanCells()
		this.updateEntities(dt)
		this.updateObjects(dt)
		this.background.update(this.sunAmount, this.numberOfZombiesToKill)
		this.plant()
		this.checkWin()
		this.checkLoss()
		this.sunDropletPickup()
		timer.update(dt);
	}

	addZombie() {
		if(this.numberOfZombiesToSpawn > 0 && this.spawnZombie) {
			this.spawnZombie = false
			this.currentGrace = timer.wait(this.gracePeriod, () => {
				this.gracePeriod = getRandomPositiveInteger(8, 12);
				let zombieType;
				let zombieTypeProbability = getRandomPositiveInteger(1, 10)

				if(zombieTypeProbability <= 6){
					zombieType = ZombieType.Regular
				}
				else if(zombieTypeProbability <= 8){
					zombieType = ZombieType.Conehead
				}
				else{
					zombieType = ZombieType.Athlete
				}

				this.entities.push(ZombieFactory.createInstance(zombieType, this.gameGrid[8][getRandomPositiveInteger(0, 4)]))
				this.spawnZombie = true
				this.numberOfZombiesToSpawn--
			})
		}
	}

	dropSun() {
		if (this.spawnSun) {
			this.spawnSun = false
			timer.wait(Level.SUN_TIME, () => {
				let x = getRandomPositiveInteger(1, Level.NUM_OF_CELLS_WIDTH)
				let y = getRandomPositiveInteger(1, Level.NUM_OF_CELLS_HEIGHT)
				let sundrop = new SunDroplet(Level.SKY_SUN_VALUE, new Vector((x * Cell.CELL_WIDTH) + Level.BEFORE_CELLS, 0), false)
				timer.tween(sundrop.position, ['y'], [y * Cell.CELL_HEIGHT], Level.SKY_SUN_CELLS_PER_SECOND * y, () => sundrop.canBePickedUp = true)
				this.objects.push(sundrop)
				this.spawnSun = true
			})

		}
	}

	sunDropletPickup(){
		this.objects.forEach(object => { 
			if(object instanceof SunDroplet){
				if(this.mouse.x > object.position.x && this.mouse.x < object.position.x + object.dimensions.x
					&& this.mouse.y > object.position.y && this.mouse.y < object.position.y + object.dimensions.y && object.canBePickedUp){
						object.toBeRemoved = true
						this.sunAmount += object.amount
					}
			}			
		})
	}

	plant(){
		const gridPositionX = this.mouse.x - ((this.mouse.x - 16) % Cell.CELL_WIDTH)
		const gridPositionY = this.mouse.y - (this.mouse.y % Cell.CELL_HEIGHT)

		if(gridPositionX < 176 || gridPositionX > 176 + Cell.CELL_WIDTH * 9
			|| gridPositionY < Cell.CELL_HEIGHT || gridPositionY > Cell.CELL_HEIGHT * 5){
				return
			}

		let cell = this.gameGrid[(Math.floor((gridPositionX - 176) / Cell.CELL_WIDTH))][(Math.floor(gridPositionY / Cell.CELL_HEIGHT) - 1)]


		if(keys.q && cell.plant == null && this.sunAmount >= Level.SUNFLOWER_COST){
			let plant = PlantFactory.createInstance(PlantType.Sunflower, cell)
			this.objects.push(plant)
			keys.q = false
			cell.plant = plant;
			this.sunAmount -= Level.SUNFLOWER_COST
		}
		if(keys.w && cell.plant == null && this.sunAmount >= Level.PEASHOOTER_COST){
			let plant = PlantFactory.createInstance(PlantType.Peashooter, cell)
			this.objects.push(plant)
			keys.q = false
			cell.plant = plant;
			this.sunAmount -= Level.PEASHOOTER_COST
		}
		if(keys.e && cell.plant == null && this.sunAmount >= Level.ICESHOOTER_COST){
			let plant = PlantFactory.createInstance(PlantType.Iceshooter, cell)
			this.objects.push(plant)
			keys.q = false
			cell.plant = plant;
			this.sunAmount -= Level.ICESHOOTER_COST
		}
		if(keys.d && cell.plant != null){
			cell.plant.dig()
			cell.plant.toBeRemoved = true
			cell.plant = null
			this.sunAmount += Level.RETURNED_ON_DIG
			this.numberOfPlantsRemovedOrEaten++
		}
	}

	cleanUpEntities() {
		this.entities.filter(e => e.isDead).forEach(e => e.die())
		this.entities = this.entities.filter(e => !e.isDead)
	}

	cleanUpObjects() {
		this.objects.filter(o => o.toBeRemoved).forEach(o => o.removed())
		this.objects = this.objects.filter(o => !o.toBeRemoved)
	}

	cleanCells() {
		this.gameGrid.forEach(cR => cR.forEach( c => c.plant = c.plant?.toBeRemoved ? null : c.plant ))
	}

	updateEntities(dt) {
		this.entities.forEach(e => {
			
			if(e.health <= 0) e.isDead = true
			
			e.update(dt)

			if (e instanceof Zombie) {
				if (e.isDead) this.numberOfZombiesToKill--
				// handle zombie -> plant collision
				this.objects.forEach(o => { if (o.didCollideWithEntity(e.hitbox) && o.isCollidable) o.onCollision(e); })
	
				// handle zombie -> projectile collision
				this.entities.filter(x => x instanceof Projectile).forEach(i => {
					if (e.didCollideWithEntity(i)) {
						i.onCollision(e)
					}
				})
			}
		})
	}

	updateObjects(dt) {
		this.objects.forEach(o => {
			o.update(dt)

			if (o instanceof Plant) {
				let action = false
				this.entities.filter(e => e instanceof Zombie).forEach(e => {
					if (o.detectFacing(e)) {
						action = true
						return
					}
				})
				// if zombie in row, enter action; else, idle
				if (action) o.facingZombie(this)
				else o.noZombie(this)
			}
		})
	}

	buildRenderQueue() {
		return [...this.entities, ...this.objects].sort((a, b) => {
			const bottomA = a.hitbox.position.y + a.hitbox.dimensions.y
			const bottomB = b.hitbox.position.y + b.hitbox.dimensions.y

			if (a.renderPriority < b.renderPriority) return -1
			else if (a.renderPriority > b.renderPriority) return 1
			else if (bottomA < bottomB) return -1
			else return 1
		})
	}

	checkWin(){
		if(this.numberOfZombiesToKill == 0){
			window.removeEventListener("beforeunload", this.saveData)
			stateMachine.change(GameStateName.Victory, {
				numberOfPlantsRemovedOrEaten: this.numberOfPlantsRemovedOrEaten,
				level: this.level,
			})
		}
	}

	checkLoss(){
		for(let i = 0; i < this.entities.length; i++){
			if(this.entities[i].position.x + this.entities[i].dimensions.x < 240){
				window.removeEventListener("beforeunload", this.saveData)
				stateMachine.change(GameStateName.GameOver);
			}
		}
	}

	render() {
		this.background.render();

		this.renderQueue.forEach(elementToRender => elementToRender.render())


		for(let i = 0; i < Level.NUM_OF_CELLS_WIDTH; i++){
			for(let j = 0; j < Level.NUM_OF_CELLS_HEIGHT; j++){
				if(this.gameGrid[i][j].isMouseHovering(this.mouse)){
					this.gameGrid[i][j].render();
				}
			}
		}
	}

	addCamera(camera) {
		this.background.addCamera(camera);
	}
}
