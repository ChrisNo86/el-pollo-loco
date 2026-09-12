/**
 * @module "status-bar-health.class.js"
 */

/**
 * Import the StatusBar class from the status-bar.class.js module.
 */
import { StatusBar } from "./status-bar.class.js";

/**
 * Class representing the health status bar.
 * @extends StatusBar
 */
export class StatusBarHealth extends StatusBar {
  IMAGES = [
    "./assets/images/ui/statusbars/1_statusbar/2_statusbar_health/green/0.png",
    "./assets/images/ui/statusbars/1_statusbar/2_statusbar_health/green/20.png",
    "./assets/images/ui/statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "./assets/images/ui/statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "./assets/images/ui/statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "./assets/images/ui/statusbars/1_statusbar/2_statusbar_health/green/100.png",
  ];

  /**
   * Creates an instance of the StatusBarHealth class.
   * Initializes the health status bar with default values.
   * Loads the images and sets the initial health percentage to 100%.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.y = 0;
    this.setPercentage(100);
  }

  /**
   * Determines the image index based on the current health percentage.
   * Health only needs to be above 0 (not 20) to reach the first step.
   *
   * @returns {number} The image index corresponding to the health percentage.
   */
  resolveImageIndex() {
    if (this.percentage <= 0) return 0;
    const thresholds = [1, 40, 60, 80, 100];
    return thresholds.filter((threshold) => this.percentage >= threshold).length;
  }
}
