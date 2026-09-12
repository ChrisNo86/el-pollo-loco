/**
 * @module "coins.class.js"
 */

/**
 * Import the MovableObject class from the movable-object.class.js module.
 * Import the setStoppableInterval function from the game.js module.
 */
import { MovableObject } from "./movable-object.class.js";
import { setStoppableInterval } from "../game.js";

const canvas = document.getElementById("canvas");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

/**
 * Represents a coin object that can be animated.
 * @extends MovableObject
 */
export class Coins extends MovableObject {
  height = 30;
  width = 30;

  IMAGES_ROTATE = ["./assets/images/items/coin/coin_1.png", "./assets/images/items/coin/coin_2.png"];

  /**
   * Initializes a new instance of the Coin class.
   * Loads the initial coin image and sets the position of the coin on the canvas.
   * Starts the coin animation.
   */
  constructor() {
    super().loadImage("./assets/images/items/coin/coin_1.png");
    this.loadImages(this.IMAGES_ROTATE);
    this.x = 200 + Math.random() * (canvasWidth * 1.5);
    this.y = canvasHeight / 2.3 + Math.random() * 100;
    this.animate();
  }

  /**
   * Triggers the coin animation.
   */
  animate() {
    this.coinAnimation();
  }

  /**
   * Animates the coin by alternating between its two coin images.
   * Uses a stoppable interval to update the animation every 250 milliseconds.
   */
  coinAnimation() {
    setStoppableInterval(() => {
      this.playAnimation(this.IMAGES_ROTATE);
    }, 250);
  }
}
