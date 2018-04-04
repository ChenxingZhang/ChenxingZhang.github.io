/**
 * Author: Chenxing Zhang
 * File: Camera.js
 * Description: Represents a Camera.
 * Note: Camera will always rotate around a humanoid, so no need
 *      to have a "center" field. Note that there's no type checking
 *      because of simplicity.
 */
let CameraRadius = 250;
class Camera{
    //position, radius
    constructor(){
        //attach
        this.attached = {"positionX":0, "positionY":0, "positionZ":0};
        this.angle1 = 2;
        this.eye = [CameraRadius*Math.sin(1.0), - CameraRadius, CameraRadius*Math.cos(1.0)];
        this.target = [0,0,0];
        this.up = [0,-1,0];
        this.Tcamera = M4.inverse(M4.lookAt(this.eye,this.target,this.up));
        this.Tprojection = M4.multiply( M4.perspective(1.5,1, 0.01, 100000), M4.scaling([1, 1, 1]));
    }

    /**
     * Attaching the camera to an obj so it can rotate relative to it.
     * @param {Need to have obj.position} object 
     */
    attach(object){
        //attach
    }

    /**
     * change the angle of camera relative to attached obj.
     * @param {Angle to} angle 
     */
    changeAngle(angle){
        this.angle1 = angle;
        this.eye=[CameraRadius*Math.sin(this.angle1),- CameraRadius,CameraRadius*Math.cos(this.angle1)];
        this.target=[0,0,0];
        this.up=[0,-1,0];
        this.Tcamera = M4.inverse(M4.lookAt(this.eye,this.target,this.up));
        this.Tprojection = M4.multiply( M4.perspective(1.5,1, 0.01, 100000), M4.scaling([1, 1, 1]));
    }

    /**
     * 
     * @param {change camera.radius to radius} radius 
     */
    changeRadius(radius){
        CameraRadius = radius;
        this.eye=[CameraRadius*Math.sin(this.angle1),-CameraRadius,CameraRadius*Math.cos(this.angle1)];
        this.target=[0,0,0];
        this.up=[0,-1,0];
        this.Tcamera = M4.inverse(M4.lookAt(this.eye,this.target,this.up));
        this.Tprojection = M4.multiply( M4.perspective(1.5,1, 0.01, 100000), M4.scaling([1, 1, 1]));
    }

    update(){

    }
}