/**
 * Author: Chenxing Zhang
 * File: Graphic.js
 * Description: Feels uncomfortable about putting same graphic funcs
 *              in every class files. So I decided to put some helper funcs here.
 * Note: Keeping a sorted 
 */
class Shapes{
    constructor(){
        this.posbuffers = [];
        this.colorbuffers = [];
        this.indexbuffers = [];
        this.normalbuffers = [];
        this.textureuvbuffers = [];
        this.transformmatrices = [];
        this.rotationmatrices = [];
    }

    /**
     * draw a cube at origin.
     * @param {length on x axis} x 
     * @param {length on y axis} y 
     * @param {length on z axis} z 
     * @param {tranformation matrix} Tx 
     */
    cube(x,y,z,Tx,Rx){
        //TODO: change this rgb, get input from somewhere.
        let r = 1.0, g = 0.8, b = 0.6;
        //pos buffers
        let posbufferdata = new Float32Array(
            [  x, y, z,   0, y, z,   0, 0, z,   x, 0, z,
               x, y, z,   x, 0, z,   x, 0, 0,   x, y, 0,
               x, y, z,   x, y, 0,   0, y, 0,   0, y, z,
               0, y, z,   0, y, 0,   0, 0, 0,   0, 0, z,
               0, 0, 0,   x, 0, 0,   x, 0, z,   0, 0, z,
               x, 0, 0,   0, 0, 0,   0, y, 0,   x, y, 0 ]);
        let index = this.posbuffers.push(GL.createBuffer()) - 1;
        GL.bindBuffer(GL.ARRAY_BUFFER, this.posbuffers[index]);
        GL.bufferData(GL.ARRAY_BUFFER, posbufferdata, GL.STATIC_DRAW);
        this.posbuffers[index].itemSize = 3;
        this.posbuffers[index].numItems = 24;

        //color buffers
        let colorbufferdata = new Float32Array(
            [   r, g, b,   r, g, b,   r, g, b,   r, g, b,
                r, g, b,   r, g, b,   r, g, b,   r, g, b,
                r, g, b,   r, g, b,   r, g, b,   r, g, b,
                r, g, b,   r, g, b,   r, g, b,   r, g, b,
                r, g, b,   r, g, b,   r, g, b,   r, g, b,
                r, g, b,   r, g, b,   r, g, b,   r, g, b ]);
        index = this.colorbuffers.push(GL.createBuffer()) - 1;
        GL.bindBuffer(GL.ARRAY_BUFFER, this.colorbuffers[index]);
        GL.bufferData(GL.ARRAY_BUFFER, colorbufferdata, GL.STATIC_DRAW);
        this.colorbuffers[index].itemSize = 3;
        this.colorbuffers[index].numItems = 24;
        
        // vertex texture coordinates
        let textureuvdata = new Float32Array(
            [  0, 0,   1, 0,   1, 1,   0, 1,
                1, 0,   1, 1,   0, 1,   0, 0,
                0, 1,   0, 0,   1, 0,   1, 1,
                0, 0,   1, 0,   1, 1,   0, 1,
                1, 1,   0, 1,   0, 0,   1, 0,
                1, 1,   0, 1,   0, 0,   1, 0 ]);
        index = this.textureuvbuffers.push(GL.createBuffer()) - 1;
        GL.bindBuffer(GL.ARRAY_BUFFER, this.textureuvbuffers[index]);
        GL.bufferData(GL.ARRAY_BUFFER, textureuvdata, GL.STATIC_DRAW);
        this.textureuvbuffers[index].itemSize = 2;
        this.textureuvbuffers[index].numItems = 24;
        
        // vertex normals
        let normalbufferdata = new Float32Array(
            [  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1, 
                1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0, 
                0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0, 
                -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0, 
                0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0, 
                0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1  ]);
        index = this.normalbuffers.push(GL.createBuffer()) - 1;
        GL.bindBuffer(GL.ARRAY_BUFFER, this.normalbuffers[index]);
        GL.bufferData(GL.ARRAY_BUFFER, normalbufferdata, GL.STATIC_DRAW);
        this.normalbuffers[index].itemSize = 3;
        this.normalbuffers[index].numItems = 24;

        //index buffers.
        let indexbufferdata = new Uint8Array(
            [  0, 1, 2,   0, 2, 3,
               4, 5, 6,   4, 6, 7,
               8, 9,10,   8,10,11,
              12,13,14,  12,14,15,
              16,17,18,  16,18,19,
              20,21,22,  20,22,23 ]);
        index = this.indexbuffers.push(GL.createBuffer()) - 1;
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexbuffers[index]);
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, indexbufferdata, GL.STATIC_DRAW);

        //also put down the transform matrix
        this.transformmatrices.push(Tx);
        this.rotationmatrices.push(Rx);
    }

    glglgl(){

        //TODO: check if this work when other shapes were added; => will this scale? 
        //loop through buffer list and draw all the items.
        for (let i = this.posbuffers.length - 1; i >= 0; i --){
            //Uniforms and Attributes. => better to find a way manipulate the uniforms automatically.
            let Tmvp = M4.multiply(M4.multiply(this.transformmatrices[i],CAMERA.Tcamera),CAMERA.Tprojection);
            let Tmv = M4.multiply(this.transformmatrices[i],CAMERA.Tcamera);
            let Tmvn = this.rotationmatrices[i];
            //let Tmvn = M4.transpose(M4.inverse(Tmv));
            GL.uniformMatrix4fv(SHADER.Tmvp,false,Tmvp);
            GL.uniformMatrix4fv(SHADER.Tmvn,false,Tmvn);
            GL.uniformMatrix4fv(SHADER.Tmv,false,Tmv);
            GL.uniform3fv(SHADER.lightDir,LIGHT.direction);
            GL.uniform3fv(SHADER.lightColor,LIGHT.color);
            GL.uniform1f(SHADER.specExp,LIGHT.specExp);
            GL.uniform1f(SHADER.diffuseIntensity,LIGHT.diffuseIntensity);
            GL.uniform1f(SHADER.specIntensity,LIGHT.specIntensity);
            GL.activeTexture(GL.TEXTURE0);
            GL.bindTexture(GL.TEXTURE_2D, VIDEO_TEXTURE);
            GL.uniform1i(SHADER.uSampler, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, this.posbuffers[i]);
            GL.vertexAttribPointer(SHADER.vPositionAttribute, this.posbuffers[i].itemSize,
                GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, this.normalbuffers[i]);
            GL.vertexAttribPointer(SHADER.vNormalAttribute, this.normalbuffers[i].itemSize,
                GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, this.colorbuffers[i]);
            GL.vertexAttribPointer(SHADER.vColorAttribute, this.colorbuffers[i].itemSize,
                GL.FLOAT,false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, this.textureuvbuffers[i]);
            GL.vertexAttribPointer(SHADER.vTextureUVAttribute, this.textureuvbuffers[i].itemSize,
                GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexbuffers[i]);
            // Do the drawing
            GL.drawElements(GL.TRIANGLES, 36, GL.UNSIGNED_BYTE, 0);
        }
        
    }//end of Shapes.glglgl()

    clear(){
        this.posbuffers = [];
        this.colorbuffers = [];
        this.indexbuffers = [];
        this.normalbuffers = [];
        this.textureuvbuffers = [];
        this.transformmatrices = [];
        this.rotationmatrices = [];
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
        GL.clearColor(0.0, 0.0, 0.0, 1.0);
        GL.enable(GL.DEPTH_TEST);
    }
}