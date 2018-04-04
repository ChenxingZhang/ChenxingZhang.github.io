/**
 * Create by Chenxing Zhang.
 * Humanoid.js
 * This is a class representing a humanoid, runnig.
 */

class Humanoid {
  /**
   * constructor
   * @param {* height? not sure if its neccessary} height 
   * @param {* position x} x 
   * @param {* position y} y 
   * @param {* position z} z 
   */
  constructor(height, x, y, z){
    this.height = height || DEFAULT_HEIGHT;
    this.positionX = x || 0;
    this.positionY = y || 0; //y position is constant right now -> no jump.
    this.positionZ = z || 0;
    //Related fields for animation.
    this.orientation = 0; //0 to 2PI.
    this.frame = 0; //Used to keep track of animation frames.
  }

  //draw a cube for head.
  drawHead(){
    let transform = M4.identity();
    SHAPES.cube(HEAD_LENGTH, HEAD_LENGTH, HEAD_LENGTH, transform,M4.identity());
  }

  //draw body of the humanoid.
  drawBody(){
    let transform = M4.identity();
    transform = M4.multiply(transform, M4.translation([-0.25 * HEAD_LENGTH, 
                HEAD_LENGTH, 0]));
    SHAPES.cube(1.5 * HEAD_LENGTH, 3 * HEAD_LENGTH, HEAD_LENGTH,transform,M4.identity());
  }

  //draw two arms.
  drawArms(){
    //TODO: draw arms.
  }

  //draw legs for it.
  drawLegs(){
    //calculating the turning angle for lap.
    let axis = [1,0,0];
    let lapA = 0;
    let lapB = 0;
    let shankA = -90;
    let shankB = -20;
    let sframe = this.frame < LOOP_FRAME / 2 ? this.frame : this.frame - LOOP_FRAME / 2;
    if (sframe < LOOP_FRAME / 8){
      lapA = sframe * 40 * 8 / LOOP_FRAME;
      lapB = -1 * sframe * 40 * 4 / LOOP_FRAME;
      shankA = -90;
      shankB = -20;
    } else if (sframe < LOOP_FRAME / 4){
      lapA = 40 + (sframe - LOOP_FRAME / 8) * 20 * 8 / LOOP_FRAME;
      lapB = -1 * sframe * 40 * 4 / LOOP_FRAME;
      shankA = -90 + (sframe - LOOP_FRAME / 8) * 70 * 8 / LOOP_FRAME;
      shankB = -90 - (LOOP_FRAME / 4 - sframe) * -70 * 8 / LOOP_FRAME;
    } else if (sframe < 3 * LOOP_FRAME / 8){
      lapA = 40 + (3 * LOOP_FRAME / 8 - sframe) * 20 * 8 / LOOP_FRAME;
      lapB = (4 * LOOP_FRAME / 8 - sframe) * -40 * 4 / LOOP_FRAME;
      shankA = -20;
      shankB = -90;
    } else {
      lapA = (LOOP_FRAME / 2 - sframe) * 40 * 8 / LOOP_FRAME;
      lapB = (LOOP_FRAME / 2 - sframe) * -40 * 4 / LOOP_FRAME;
      shankA = -20;
      shankB = -90;
    } 
    if (this.frame >= LOOP_FRAME / 2){
      let temp = lapA;
      lapA = lapB;
      lapB = temp;
      temp = shankA;
      shankA = shankB;
      shankB = temp;
    }

    let transform = M4.identity();

    //lapA
    let ta = transform, tb = transform;
    ta = M4.multiply(ta, M4.axisRotation(axis, lapA * DEGREE_TO_RADIAN));
    let rx = ta;
    ta = M4.multiply(ta, M4.translation([0.55 * HEAD_LENGTH, 4 * HEAD_LENGTH, 0]));
    SHAPES.cube(0.8 * HEAD_LENGTH, 1.5 * HEAD_LENGTH, 0.8 * HEAD_LENGTH,ta,rx);

    //shankA
    ta = transform;
    let t = [1.5 * HEAD_LENGTH * Math.cos(lapA * DEGREE_TO_RADIAN),
             1.5 * HEAD_LENGTH * Math.sin(lapA * DEGREE_TO_RADIAN)];
    ta = M4.multiply(ta, M4.axisRotation(axis, lapA * DEGREE_TO_RADIAN));
    ta = M4.multiply(ta, M4.axisRotation(axis, shankA * DEGREE_TO_RADIAN));
    rx = ta;
    ta = M4.multiply(ta, M4.translation([0.55 * HEAD_LENGTH, 4 * HEAD_LENGTH, 0]));
    ta = M4.multiply(ta, M4.translation([0, t[0], t[1]]));
    SHAPES.cube(0.8 * HEAD_LENGTH, 1.5 * HEAD_LENGTH, 0.8 * HEAD_LENGTH,ta,rx);
    
    //lapB
    tb = M4.multiply(tb, M4.axisRotation(axis, lapB * DEGREE_TO_RADIAN));
    rx = tb;
    tb = M4.multiply(tb, M4.translation([-0.25 * HEAD_LENGTH, 4 * HEAD_LENGTH, 0]));
    SHAPES.cube(0.8 * HEAD_LENGTH, 1.5 * HEAD_LENGTH, 0.8 * HEAD_LENGTH,tb,rx);

    //shankB
    tb = transform;
    t = [1.5 * HEAD_LENGTH * Math.cos(lapB * DEGREE_TO_RADIAN),
             1.5 * HEAD_LENGTH * Math.sin(lapB * DEGREE_TO_RADIAN)];
    tb = M4.multiply(tb, M4.axisRotation(axis, lapB * DEGREE_TO_RADIAN));
    tb = M4.multiply(tb, M4.axisRotation(axis, shankB * DEGREE_TO_RADIAN));
    rx = tb;
    tb = M4.multiply(tb, M4.translation([-0.25 * HEAD_LENGTH, 4 * HEAD_LENGTH, 0]));
    tb = M4.multiply(tb, M4.translation([0, t[0], t[1]]));
    SHAPES.cube(0.8 * HEAD_LENGTH, 1.5 * HEAD_LENGTH, 0.8 * HEAD_LENGTH,tb,rx);
  }

  //Update all the changing fields.
  update(destX, destY){
    this.frame ++;
    if (this.frame > LOOP_FRAME){
      this.frame = 0;
    }
    this.draw();
  }

  //note that all the movements of the humanoid are hard coded.
  draw(){
    this.drawLegs();
    this.drawBody();
    this.drawHead();
  }
}