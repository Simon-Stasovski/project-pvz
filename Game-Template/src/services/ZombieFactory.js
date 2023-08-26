import Vector from "../../lib/Vector.js";
import AthleteZombie from "../entities/zombies/AthleteZombie.js";
import ConeheadZombie from "../entities/zombies/ConeheadZombie.js";
import RegularZombie from "../entities/zombies/RegularZombie.js";
import ZombieType from "../enums/ZombieType.js";
import Factory from "./Factory.js"

export default class ZombieFactory extends Factory{
    static createInstance(type, gridPosition){
        switch(type){
            case ZombieType.Regular:
                return new RegularZombie(new Vector(gridPosition.position.x, gridPosition.position.y - 36));
            case ZombieType.Conehead:
                return new ConeheadZombie(new Vector(gridPosition.position.x, gridPosition.position.y - 48));
            case ZombieType.Athlete:
                return new AthleteZombie(new Vector(gridPosition.position.x, gridPosition.position.y - 48));
        }
    }
    
    static createInstanceByPos(type, x, y) {
        switch(type) {
            case ZombieType.Regular:
                return new RegularZombie(new Vector(x, y));
            case ZombieType.Conehead:
                return new ConeheadZombie(new Vector(x, y));
            case ZombieType.Athlete:
                return new AthleteZombie(new Vector(x, y));
        }
    }
}