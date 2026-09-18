/**
 * @module "sounds.js"
 */

/**
 * Background music sound.
 * @type {Audio}
 */
export let bgSound = new Audio("./assets/sounds/music/bg-music.mp3");

/**
 * Sound effects for winning and game over events.
 * @type {Audio}
 */
export let winSound = new Audio("./assets/sounds/sfx/win.mp3");
export let gameOverSound = new Audio("./assets/sounds/sfx/game-over.mp3");

/**
 * Sound effects for the player character.
 * @type {Audio}
 */
export let walkingSound = new Audio("./assets/sounds/sfx/walking.mp3");
export let jumpSound = new Audio("./assets/sounds/sfx/jump.mp3");
export let hurtSound = new Audio("./assets/sounds/sfx/hurt.mp3");
export let snoringSound = new Audio("./assets/sounds/sfx/snoring.mp3");

/**
 * Sound effects for chicken actions.
 * @type {Audio}
 */
export let chickenAttackSound = new Audio("./assets/sounds/sfx/chicken-attack.mp3");
export let chickenDeathSound = new Audio("./assets/sounds/sfx/chicken-death.mp3");
export let chickenSound = new Audio("./assets/sounds/sfx/chicken.mp3");

/**
 * Sound effects for various item interactions.
 * @type {Audio}
 */
export let bottleBreakSound = new Audio("./assets/sounds/sfx/bottle-break.mp3");
export let bottleLootingSound = new Audio("./assets/sounds/sfx/bottle-looting.mp3");
export let coinSound = new Audio("./assets/sounds/sfx/coin.mp3");

/**
 * Sound effects for various killing streaks and fights.
 * @type {Audio}
 */
export let firstBloodSound = new Audio("./assets/sounds/sfx/killing_sounds/first-blood.mp3");
export let doubleKillSound = new Audio("./assets/sounds/sfx/killing_sounds/double-kill.mp3");
export let tripleKillSound = new Audio("./assets/sounds/sfx/killing_sounds/triple-kill.mp3");
export let dominatingSound = new Audio("./assets/sounds/sfx/killing_sounds/dominating.mp3");
export let killStreakSound = new Audio("./assets/sounds/sfx/killing_sounds/kill-streak.mp3");
export let rampageSound = new Audio("./assets/sounds/sfx/killing_sounds/rampage.mp3");
export let fightSound = new Audio("./assets/sounds/sfx/fight.mp3");
