/**
 * @module "world-kill-sounds.js"
 */

/**
 * Import kill-streak related sound effects and the sound player.
 */
import { firstBloodSound, doubleKillSound, tripleKillSound, rampageSound, dominatingSound, killStreakSound, chickenDeathSound } from "../sounds.js";
import { playSound } from "../game.js";

/**
 * Plays the appropriate kill-streak sound(s) for the current world state
 * and resets the rampage count after a delay.
 * @param {Object} world - The game world instance.
 */
export function playKillSounds(world) {
  setTimeout(() => (world.rampageCount = 0), 2000);
  rampage(world);
  firstBlood(world);
  doubleKill(world);
  tripleKill(world);
  killStreak(world);
  dominating(world);
  if (world.playOnlyOnce) world.playOnlyOnce = false;
}

/**
 * Triggers a rampage sound if the rampage count is 6 or more.
 * @param {Object} world - The game world instance.
 */
function rampage(world) {
  if (world.rampageCount >= 6) playSound(rampageSound);
}

/**
 * Plays a sound when the first enemy is killed.
 * Resets the dead enemy count after playing the sound.
 * @param {Object} world - The game world instance.
 */
function firstBlood(world) {
  if (world.deadEnemyCount === 1 || world.playOnlyOnce) {
    if (world.playOnlyOnce) playSound(firstBloodSound);
    else playSound(chickenDeathSound);
    world.deadEnemyCount = 0;
  }
}

/**
 * Plays a sound when exactly two enemies have been killed.
 * Resets the dead enemy count after playing the sound.
 * @param {Object} world - The game world instance.
 */
function doubleKill(world) {
  if (world.deadEnemyCount === 2 && !world.playOnlyOnce) {
    playSound(doubleKillSound);
    world.deadEnemyCount = 0;
  }
}

/**
 * Plays a sound when exactly three enemies have been killed.
 * Resets the dead enemy count after playing the sound.
 * @param {Object} world - The game world instance.
 */
function tripleKill(world) {
  if (world.deadEnemyCount === 3 && !world.playOnlyOnce) {
    playSound(tripleKillSound);
    world.deadEnemyCount = 0;
  }
}

/**
 * Plays a sound when 4 to 5 enemies have been killed.
 * Resets the dead enemy count after playing the sound.
 * @param {Object} world - The game world instance.
 */
function killStreak(world) {
  if (world.deadEnemyCount >= 4 && world.deadEnemyCount < 6 && !world.playOnlyOnce) {
    playSound(killStreakSound);
    world.deadEnemyCount = 0;
  }
}

/**
 * Plays a sound if only the Endboss remains in the level and is still alive.
 * @param {Object} world - The game world instance.
 */
export function dominating(world) {
  if (world.level.enemies.length === 1 && world.level.enemies[0].constructor.name === "Endboss" && world.level.enemies[0].energy > 0) {
    playSound(dominatingSound);
  }
}
