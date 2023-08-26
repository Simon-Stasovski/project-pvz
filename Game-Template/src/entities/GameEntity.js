import { context, DEBUG } from "../globals.js";
import Level from "../objects/Level.js";
import Vector from "../../lib/Vector.js";
import { isAABBCollision } from "../../lib/CollisionHelpers.js";
import Hitbox from "../../lib/Hitbox.js"

export default class GameEntity {
	/**
	 * The base class to be extended by all entities in the game.
	 *
	 * @param {Vector} dimensions The height and width of the entity.
	 * @param {Vector} position The x and y coordinates of the entity.
	 */
	constructor(dimensions, position) {
		this.dimensions = dimensions;
		this.position = position;
		this.velocity = new Vector(0, 0);
		this.sprites = [];
		this.currentAnimation = null;
		this.stateMachine = null;
		this.isDead = false;
		this.cleanUp = false;
		this.hasDeathAnimation = false;
		this.hitboxOffsets = new Hitbox();
		this.hitbox = new Hitbox(
			this.position.x + this.hitboxOffsets.position.x,
			this.position.y + this.hitboxOffsets.position.y,
			this.dimensions.x + this.hitboxOffsets.dimensions.x,
			this.dimensions.y + this.hitboxOffsets.dimensions.y,
		);
	}

	changeState(state, params) {
		this.stateMachine.change(state, params);
	}

	update(dt) {
		this.stateMachine?.update(dt);
		this.currentAnimation?.update(dt);
		this.hitbox?.set(
			this.position.x + this.hitboxOffsets.position.x,
			this.position.y + this.hitboxOffsets.position.y,
			this.dimensions.x + this.hitboxOffsets.dimensions.x,
			this.dimensions.y + this.hitboxOffsets.dimensions.y,
		);
	}

	render() {
		this.stateMachine?.render();

		if (this.isDead && !this.hasDeathAnimation) return;

		if (DEBUG) this.hitbox.render(context)
	}

	/**
	 * @param {Hitbox} hitbox
	 * @returns Whether this entity collided with another using AABB collision detection.
	 */
	didCollideWithEntity(hitbox) {
		return this.hitbox.didCollide(hitbox)
	}

	/**
	 * @param {Entity} entity
	 * @returns The horizontal distance between this entity and the specified entity.
	 */
	getDistanceBetween(entity) {
		return Math.abs(this.position.x - entity.position.x);
	}

	// called on entity death for any needed cleanup
	die() {

	}
}
