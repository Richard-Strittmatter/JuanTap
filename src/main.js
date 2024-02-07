import { startScene } from './start.js';
import { gameScene } from './gameScene.js';
import { loseScene } from './lose.js';
import kaboom from "kaboom";

kaboom()

startScene()

gameScene();

loseScene();


go("start")
