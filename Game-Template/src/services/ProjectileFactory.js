import Vector from "../../lib/Vector.js";
import IcePea from "../entities/projectiles/IcePea.js";
import Pea from "../entities/projectiles/Pea.js";
import ProjectileType from "../enums/ProjectileType.js";
import Factory from "./Factory.js";

export default class ProjectileFactory extends Factory{
    static createInstance(type, gridPosition){
        return ProjectileFactory.createInstanceByPos(type, gridPosition.position.x + 6, gridPosition.position.y + 6)
    }

    static createInstanceByPos(type, x, y) {
        switch(type){
            case ProjectileType.Pea:
                return new Pea(new Vector(x, y));
            case ProjectileType.Icepea:
                return new IcePea(new Vector(x, y));
        }
    }
}