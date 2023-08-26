import Iceshooter from "../objects/plants/Iceshooter.js";
import Peashooter from "../objects/plants/Peashooter.js";
import Sunflower from "../objects/plants/Sunflower.js";
import PlantType from "../enums/PlantType.js";
import Factory from "./Factory.js";
import Vector from "../../lib/Vector.js";
import Plant from "../objects/plants/Plant.js";

export default class PlantFactory extends Factory{
    static createInstance(type, gridPosition) {
        switch(type){
            case PlantType.Peashooter:
                return new Peashooter(new Vector(gridPosition.position.x + Plant.OFFSET, gridPosition.position.y));
            case PlantType.Iceshooter:
                return new Iceshooter(new Vector(gridPosition.position.x + Plant.OFFSET, gridPosition.position.y));
            case PlantType.Sunflower:
                return new Sunflower(new Vector(gridPosition.position.x + Plant.OFFSET, gridPosition.position.y));
        }
    }
}