import { gameScene } from './gameScene.js';
import { loseScene } from './lose.js';
import kaboom from "kaboom";

kaboom()

gameScene();

loseScene();


go("game")
