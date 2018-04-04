/**
 * Author: Chenxing Zhang
 * File: Light.js
 * Description: Represents the only directional light source.
 * Note: 
 */
class Light{
    constructor(color){
        this.color = color;
        this.direction = twgl.v3.normalize([-1, -0.3, -1]);
        this.specExp = 1024.0;
        this.diffuseIntensity = 1.0;
        this.specIntensity = 3.4;
    }

    /**
     * change the angle of light source.
     * @param {Angle to} angle 
     */
    changeLightAngle(angle){
        this.direction = twgl.v3.normalize([Math.cos(angle), 1, Math.sin(angle)]);
    }
}