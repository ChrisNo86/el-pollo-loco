/**
 * @module "status-bar.class.js"
 */

/**
 * Import the DrawableObject class from the drawable-object.class.js module.
 */
import { DrawableObject } from "./drawable-object.class.js";

/**
 * Class representing a status bar.
 * @extends DrawableObject
 */
export class StatusBar extends DrawableObject {
  /**
   * Array of image paths for different status levels.
   * @type {string[]}
   */
  IMAGES = [];

  percentage = 100;

  /**
   * Creates an instance of the StatusBar class.
   * Initializes the status bar with default properties and sets the initial percentage to 100%.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 20;
    this.y = 0;
    this.width = 200;
    this.height = 60;
    this.setPercentage(100);
  }

  /**
   * Sets the percentage and updates the image based on the resolved image index.
   *
   * @param {number} percentage - The percentage to set.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Determines the image index based on the current percentage.
   * Counts how many of the 20/40/60/80/100 thresholds are reached.
   *
   * @returns {number} The image index corresponding to the percentage.
   */
  resolveImageIndex() {
    const thresholds = [20, 40, 60, 80, 100];
    return thresholds.filter((threshold) => this.percentage >= threshold).length;
  }
}
