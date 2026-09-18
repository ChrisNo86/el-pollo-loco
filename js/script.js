/**
 * @module "script.js"
 */

/**
 * Import functions to load the game world and play sounds.
 * Import background music sound.
 */
import { loadGameWorld, playSound, stopGame } from "./game.js";
import { bgSound } from "./sounds.js";

/**
 * Plays the background sound with a slight delay.
 * The sound is played at a volume of 0.05 and loops indefinitely.
 */
function playBgSound() {
  setTimeout(() => playSound(bgSound, 0.05, true), 1);
}

/**
 * Add an event listener to play background sound on the first click.
 * The event listener is removed after the first click.
 */
document.addEventListener("click", function playOnFirstClick() {
  playBgSound();
  document.removeEventListener("click", playOnFirstClick);
});

/**
 * Starts the game by hiding the start, game over, and win screens,
 * and then loading the game world.
 */
function startGame() {
  const startScreenRef = document.getElementById("start_screen");
  const gameOverScreenRef = document.getElementById("game_over_screen");
  const winScreenRef = document.getElementById("win_screen");
  startScreenRef.style.display = "none";
  gameOverScreenRef.style.display = "none";
  winScreenRef.style.display = "none";
  loadGameWorld();
}
window.startGame = startGame;

/**
 * Returns to the start screen from the game-over or win screen.
 * Stops any remaining game intervals so nothing keeps running in the background.
 */
function goToHome() {
  stopGame();
  document.getElementById("game_over_screen").style.display = "none";
  document.getElementById("win_screen").style.display = "none";
  document.getElementById("start_screen").style.display = "block";
}
window.goToHome = goToHome;

/**
 * Adds event listeners to buttons for touchstart and touchend events,
 * dispatching corresponding keyboard events for game controls.
 */
document.addEventListener("DOMContentLoaded", () => {
  const buttons = [
    { id: "move_left", key: "ArrowLeft" },
    { id: "move_right", key: "ArrowRight" },
    { id: "jump", key: " " },
    { id: "throw", key: "f" },
  ];
  buttons.forEach(({ id, key }) => {
    const button = document.getElementById(id);
    button.addEventListener("touchstart", () => document.dispatchEvent(new KeyboardEvent("keydown", { key })));
    button.addEventListener("touchend", () => document.dispatchEvent(new KeyboardEvent("keyup", { key })));
    button.addEventListener("contextmenu", (e) => e.preventDefault());
  });
});

/**
 * Toggles fullscreen mode for the whole canvas container.
 * Uses the container (not the bare canvas) so overlays like the start,
 * game-over and win screens still show up while in fullscreen.
 */
function toggleFullscreen() {
  const canvasContainer = document.getElementById("canvas_container");
  canvasContainer.requestFullscreen();
}

window.toggleFullscreen = toggleFullscreen;
