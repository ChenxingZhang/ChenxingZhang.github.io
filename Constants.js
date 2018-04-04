/**
 * Author: Chenxing Zhang
 * File: Constants.js
 * Description: Stores all the constants.
 */

const CANVAS = document.getElementById("Canvas");
const GL = CANVAS.getContext("webgl");
const M4 = twgl.m4;
const SHADER = GL.createProgram();
const LIGHT = new Light([1.0,0.88,0.94]);
const SHAPES = new Shapes();
const CAMERA = new Camera();


const VIDEO_FRAME = document.createElement("video");
const VIDEO_TEXTURE = GL.createTexture();

const X_OFF_SET = 250;
const Y_OFF_SET = 250;
const DEFAULT_HEIGHT = 240;
const HEAD_LENGTH = 40;
const DEGREE_TO_RADIAN = Math.PI / 180;
const HUM_ORIGIN = 100;
const LOOP_FRAME = 40;