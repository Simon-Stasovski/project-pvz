import GameObject from './GameObject.js'

export default class PlantSeedPacket extends GameObject {
    constructor(sprite, plantCost, previewSprite, dimensions, position){
        super(dimensions, position)

        this.sprite = sprite
        this.plantCost = plantCost
        this.previewSprite = previewSprite
    }
    update(){

    }
    render(){

    }
}