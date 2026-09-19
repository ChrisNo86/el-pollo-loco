/**
 * @module "world.class.js"
 */

import { Character } from "./character.class.js";
import { level1 } from "../Levels/level1.js";
import { StatusBarHealth } from "./status-bar-health.class.js";
import { SalsaBottlesBar } from "./salsa-bottles-bar.class.js";
import { CoinsBar } from "./coins-bar.class.js";
import { StatusBarEndbossHealth } from "./status-bar-endboss-health.class.js";
import { VendingMachine } from "./vending-machine.class.js";
import { DangerShield } from "./danger-shield.class.js";
import { ThrowableObject, setEndBossHit } from "./throwable-object.class.js";
import { setStoppableInterval, stopGame, playSound } from "../game.js";
import { checkCharacterCollision } from "./endboss.class.js";
import { coinSound, winSound, gameOverSound, bottleLootingSound, bottleBreakSound } from "../sounds.js";
import { playKillSounds, dominating } from "./world-kill-sounds.js";

/**
 * Represents the game world.
 */
export class World {
  character = new Character();
  level = level1;
  ctx;
  canvas;
  keyboard;
  cameraX = 0;
  statusBarHealth = new StatusBarHealth();
  salsaBottlesBar = new SalsaBottlesBar();
  coinsBar = new CoinsBar();
  statusBarEndbossHealth = new StatusBarEndbossHealth();
  vendingMachine = new VendingMachine();
  dangerShield = new DangerShield();
  throwableObjects = [];
  salsaBottles = [];
  coins = [];
  currentBottles = 0;
  currentCoins = 0;
  deadEnemyCount = 0;
  rampageCount = 0;
  isGameOver = false;
  playOnlyOnce = true;
  ENDBOSS_CONTACT_DAMAGE = 30;
  ENEMY_CONTACT_DAMAGE = 15;
  isRunning = true;

  /**
   * Creates an instance of the World class.
   * @param {HTMLCanvasElement} canvas - The canvas element to draw on.
   * @param {Object} keyboard - The keyboard input handler.
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
  }

  /** Sets the world reference for the character. */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Starts the game loop: collision/throwable checks run every frame (~60fps), the rest every 250ms.
   */
  run() {
    setStoppableInterval(() => this.checkCollisions(), 1000 / 60);
    setStoppableInterval(() => this.checkThrowableObjects(), 1000 / 60);
    setStoppableInterval(() => this.checkCharacterIsDead(), 250);
    setStoppableInterval(() => this.checkEndbossIsDead(), 250);
    setStoppableInterval(() => this.deleteEnemy(), 250);
  }

  /**
   * Checks for collisions between the character and vending machines in the level.
   * If a collision is detected, it triggers the spawning of salsa bottles.
   */
  checkCollisionsVendingMachine() {
    this.level.vendingMachine.forEach((machine) => {
      if (this.character.isColliding(machine)) this.checkAndSpawnSalsaBottles();
    });
  }

  /**
   * Trades one coin for one salsa bottle if the player has coins left and isn't full on bottles.
   */
  checkAndSpawnSalsaBottles() {
    if (this.currentCoins >= 1 && this.currentBottles <= 4) {
      this.currentBottles += 1;
      this.currentCoins -= 1;
      playSound(bottleLootingSound, 0.1);
      this.coinsBar.setPercentage(this.currentCoins * 10);
      this.salsaBottlesBar.setPercentage(this.currentBottles * 20);
    }
  }

  /**
   * Checks if the character is dead and triggers the game over sequence if true.
   */
  checkCharacterIsDead() {
    if (this.character.isDead()) this.gameOver(true);
  }

  /**
   * Checks all enemies in the level and handles any that are dead.
   */
  checkEndbossIsDead() {
    this.level.enemies.forEach((enemy) => {
      if (enemy.isDead()) this.handleDeadEnemy(enemy);
    });
  }

  /**
   * Handles a single dead enemy, removing it and playing kill/win sounds as needed.
   * @param {Object} enemy - The enemy that died.
   */
  handleDeadEnemy(enemy) {
    enemy.speed = 0;
    this.removeDeadEnemies();
    playKillSounds(this);
    if (enemy.constructor.name === "Endboss") {
      setTimeout(() => this.level.enemies.splice(this.level.enemies.indexOf(enemy), 1), 2000);
      setTimeout(() => this.gameOver(), 3000);
    }
  }

  /**
   * Shows the game-over or win screen depending on the outcome.
   * @param {boolean} [isPlayerDead=false] - True if the player died, false if the Endboss died.
   */
  gameOver(isPlayerDead = false) {
    const gameOverScreenRef = document.getElementById("game_over_screen");
    const winScreenRef = document.getElementById("win_screen");
    if (!this.isGameOver) {
      isPlayerDead ? this.gameOverPlayerDead(gameOverScreenRef) : this.gameOverEndbossDead(winScreenRef);
    }
  }

  /**
   * Shows the game-over screen once the death animation finished.
   * @param {HTMLElement} gameOverScreenRef - Reference to the game over screen element.
   */
  gameOverPlayerDead(gameOverScreenRef) {
    this.isGameOver = true;
    setTimeout(() => {
      stopGame();
      gameOverScreenRef.style.display = "block";
      playSound(gameOverSound);
    }, 2000);
  }

  /**
   * Shows the win screen with its Restart/Home options.
   * @param {HTMLElement} winScreenRef - Reference to the win screen element.
   */
  gameOverEndbossDead(winScreenRef) {
    this.isGameOver = true;
    stopGame();
    playSound(winSound);
    winScreenRef.style.display = "block";
  }

  /**
   * Removes dead, non-Endboss enemies after a 500ms delay and tallies the kill counters.
   */
  removeDeadEnemies() {
    setTimeout(() => {
      this.level.enemies.forEach((enemy) => {
        if (enemy.isDead() && enemy.constructor.name !== "Endboss") {
          this.deadEnemyCount++;
          this.rampageCount++;
          this.level.enemies.splice(this.level.enemies.indexOf(enemy), 1);
        }
      });
    }, 500);
  }

  /**
   * Deletes enemies from the level if their x-coordinate is less than 0.
   * If only one enemy remains after deletion, calls the dominating method.
   */
  deleteEnemy() {
    this.level.enemies.forEach((enemy) => {
      if (enemy.x < 0) {
        this.level.enemies.splice(this.level.enemies.indexOf(enemy), 1);
        if (this.level.enemies.length === 1) dominating(this);
      }
    });
  }

  /**
   * Throws a salsa bottle when the throw key is pressed and bottles/cooldown allow it.
   */
  checkThrowableObjects() {
    const currentTime = new Date().getTime();
    if (currentTime - this.lastHit < 1000) return;
    if (this.keyboard.THRO && this.currentBottles > 0) {
      let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
      this.throwableObjects.push(bottle);
      this.currentBottles--;
      this.salsaBottlesBar.setPercentage(this.currentBottles * 20);
      this.lastHit = currentTime;
      setTimeout(() => playSound(bottleBreakSound, 0.1), 1100);
    }
  }

  /**
   * Checks all collision types: enemies, throwable objects, salsa bottles, coins, vending machine.
   */
  checkCollisions() {
    this.checkCollisionsEnemy();
    this.checkCollisionsThrowableObjects();
    this.checkCollisionsSalasBottles();
    this.checkCollisionsCoins();
    this.checkCollisionsVendingMachine();
  }

  /**
   * Checks collisions between the character and enemies, applying jump-kills or contact damage.
   */
  checkCollisionsEnemy() {
    this.level.enemies.forEach((enemy) => {
      if (!this.character.isColliding(enemy) || enemy.energy <= 0) {
        checkCharacterCollision(false, enemy.constructor.name);
        return;
      }
      if (this.character.isAbove(enemy)) enemy.hit(4);
      else this.applyEnemyContactDamage(enemy);
    });
  }

  /**
   * Applies contact damage to the character from a side/bottom hit by the given enemy.
   * @param {Object} enemy - The enemy that hit the character.
   */
  applyEnemyContactDamage(enemy) {
    const contactDamage = enemy.constructor.name === "Endboss" ? this.ENDBOSS_CONTACT_DAMAGE : this.ENEMY_CONTACT_DAMAGE;
    this.character.hit(contactDamage);
    checkCharacterCollision(true, enemy.constructor.name);
    this.statusBarHealth.setPercentage(this.character.energy);
  }

  /**
   * Checks for collisions between throwable objects and enemies in the game.
   * If a collision is detected, the enemy is hit. If the enemy is the Endboss,
   * its health is updated and a hit status is set.
   */
  checkCollisionsThrowableObjects() {
    this.throwableObjects.forEach((throwableObject) => {
      this.level.enemies.forEach((enemy) => {
        if (throwableObject.isColliding(enemy)) {
          if (enemy.constructor.name === "Endboss") {
            enemy.hit(1);
            this.statusBarEndbossHealth.setPercentage(enemy.energy * 10);
            setEndBossHit(true);
          } else enemy.hit();
        }
      });
    });
  }

  /**
   * Checks for collisions between the character and salsa bottles in the level.
   * If a collision is detected and the character has fewer than 5 bottles,
   * increments the bottle count, plays a looting sound, removes the bottle
   * from the level, and updates the salsa bottles bar percentage.
   */
  checkCollisionsSalasBottles() {
    this.level.salsaBottles.forEach((salsaBottle) => {
      if (this.character.isColliding(salsaBottle) && this.currentBottles < 5) {
        this.currentBottles++;
        playSound(bottleLootingSound, 0.1);
        this.level.salsaBottles.splice(this.level.salsaBottles.indexOf(salsaBottle), 1);
        this.salsaBottlesBar.setPercentage(this.currentBottles * 20);
      }
    });
  }

  /**
   * Checks for collisions between the character and coins in the level.
   * If a collision is detected and the current coin count is less than 20,
   * plays a sound, increments the coin count, removes the coin from the level,
   * and updates the coin bar percentage.
   */
  checkCollisionsCoins() {
    this.level.coins.forEach((coin) => {
      if (this.character.isColliding(coin) && this.currentCoins < 20) {
        playSound(coinSound, 0.3);
        this.currentCoins++;
        this.level.coins.splice(this.level.coins.indexOf(coin), 1);
        this.coinsBar.setPercentage(this.currentCoins * 5);
      }
    });
  }

  /**
   * Draws the game world on the canvas.
   * Clears the canvas, translates the context for camera movement,
   * draws all layers, and continuously calls itself via requestAnimationFrame
   * until the world is stopped.
   */
  draw() {
    if (!this.isRunning) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.cameraX, 0);
    this.drawBackgroundLayer();
    this.ctx.translate(-this.cameraX, 0);
    this.drawStatusBars();
    this.ctx.translate(this.cameraX, 0);
    this.drawForegroundLayer();
    this.ctx.translate(-this.cameraX, 0);
    requestAnimationFrame(() => this.draw());
  }

  /**
   * Stops the draw loop so a replaced world no longer renders onto the canvas.
   */
  stopDrawing() {
    this.isRunning = false;
  }

  /**
   * Draws the background layer: background objects, vending machine, danger shield and clouds.
   * Drawn within the camera-translated context so it scrolls with the level.
   */
  drawBackgroundLayer() {
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addToMap(this.vendingMachine);
    this.addToMap(this.dangerShield);
    this.addObjectsToMap(this.level.clouds);
  }

  /**
   * Draws the fixed UI status bars (health, salsa bottles, coins, endboss health).
   * Drawn outside the camera translation so they stay fixed on screen.
   */
  drawStatusBars() {
    this.addToMap(this.statusBarHealth);
    this.addToMap(this.salsaBottlesBar);
    this.addToMap(this.coinsBar);
    this.addToMap(this.statusBarEndbossHealth);
  }

  /**
   * Draws the foreground layer: salsa bottles, coins, the character, enemies and throwable objects.
   * Drawn within the camera-translated context so it scrolls with the level.
   */
  drawForegroundLayer() {
    this.addObjectsToMap(this.level.salsaBottles);
    this.addObjectsToMap(this.level.coins);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
  }

  /**
   * Adds multiple objects to the map.
   * @param {Array} objects - The objects to be added to the map.
   */
  addObjectsToMap(objects) {
    objects.forEach((object) => this.addToMap(object));
  }

  /**
   * Adds a movable object to the map, drawing it on the canvas context.
   * Flips the image before drawing and back afterwards if it faces the other direction.
   * @param {Object} movableObject - The object to be added to the map.
   */
  addToMap(movableObject) {
    if (movableObject.otherDirection) this.flipImage(movableObject);
    movableObject.draw(this.ctx);
    movableObject.drawFrame(this.ctx);
    if (movableObject.otherDirection) this.flipImageBack(movableObject);
  }

  /**
   * Flips the image of a movable object horizontally.
   * @param {Object} movableObject - The object to be flipped.
   */
  flipImage(movableObject) {
    this.ctx.save();
    this.ctx.translate(movableObject.width, 0);
    this.ctx.scale(-1, 1);
    movableObject.x = movableObject.x * -1;
  }

  /**
   * Flips the image of the given movable object back to its original orientation.
   * @param {Object} movableObject - The object whose image is to be flipped.
   */
  flipImageBack(movableObject) {
    movableObject.x = movableObject.x * -1;
    this.ctx.restore();
  }
}
