/**
 * Author: Chenxing Zhang
 * File: main.js
 * Description: Main entry of the program.
 * Other: The sample code is super clean, and so I might use the two
 *      basic func ".movToTx()" and ".lineToTx()".
 */



window.onload = this.main;

var videoready = false;
var man = new Humanoid();

function main(){
    this.setupVideo();
    this.initTexture();
    slider1.addEventListener("input",change);
    slider2.addEventListener("input",change);
    slider3.addEventListener("input",changeLight);
    //TODO: add normal map
    //TODO: add special textures
    // Read shader source
    let vertexSource = document.getElementById("vertexShader").text;
    let fragmentSource = document.getElementById("fragmentShader").text;

    // Compile vertex shader
    let vertexShader = GL.createShader(GL.VERTEX_SHADER);
    GL.shaderSource(vertexShader,vertexSource);
    GL.compileShader(vertexShader);
    if (!GL.getShaderParameter(vertexShader, GL.COMPILE_STATUS)) {
      alert(GL.getShaderInfoLog(vertexShader)); return null; }
    
    // Compile fragment shader
    let fragmentShader = GL.createShader(GL.FRAGMENT_SHADER);
    GL.shaderSource(fragmentShader,fragmentSource);
    GL.compileShader(fragmentShader);
    if (!GL.getShaderParameter(fragmentShader, GL.COMPILE_STATUS)) {
      alert(GL.getShaderInfoLog(fragmentShader)); return null; }
    
    // Attach the shaders and link
    GL.attachShader(SHADER, vertexShader);
    GL.attachShader(SHADER, fragmentShader);
    GL.linkProgram(SHADER);
    if (!GL.getProgramParameter(SHADER, GL.LINK_STATUS)) {
      alert("Could not initialize shaders"); }
    GL.useProgram(SHADER);

    SHADER.vPositionAttribute = GL.getAttribLocation(SHADER, "vPosition");
    GL.enableVertexAttribArray(SHADER.vPositionAttribute);
    SHADER.vColorAttribute = GL.getAttribLocation(SHADER, "vColor");
    GL.enableVertexAttribArray(SHADER.vColorAttribute);
    SHADER.vNormalAttribute = GL.getAttribLocation(SHADER, "vNormal");
    GL.enableVertexAttribArray(SHADER.vNormalAttribute);
    SHADER.vTextureUVAttribute = GL.getAttribLocation(SHADER, "vTextureUV");
    GL.enableVertexAttribArray(SHADER.vTextureUVAttribute);

    SHADER.Tmv = GL.getUniformLocation(SHADER,"uMV");
    SHADER.Tmvp = GL.getUniformLocation(SHADER,"uMVP");
    SHADER.Tmvn = GL.getUniformLocation(SHADER,"uMVN");
    SHADER.lightDir = GL.getUniformLocation(SHADER,"fLightDirection");
    SHADER.lightColor = GL.getUniformLocation(SHADER,"fLightColor");
    SHADER.specIntensity = GL.getUniformLocation(SHADER,"fSpecIntensity");
    SHADER.diffuseIntensity = GL.getUniformLocation(SHADER,"fDiffuseIntensity");
    SHADER.specExp = GL.getUniformLocation(SHADER,"fSpecExp");
    SHADER.uSampler = GL.getUniformLocation(SHADER, "uSampler");
    
    update();
}

function change() {
    CAMERA.changeAngle(slider1.value*0.01*Math.PI);
    CAMERA.changeRadius(slider2.value*2);
}

function changeLight() {
    LIGHT.changeLightAngle(slider3.value*0.01*Math.PI);
}

//The following block is heavily depend on MDN API
function setupVideo() {
    VIDEO_FRAME.autoplay = true;
    VIDEO_FRAME.muted = true;
    VIDEO_FRAME.loop = true;
    let playing = false;
    let timeupdate = false;
    
    VIDEO_FRAME.addEventListener('playing', function() {
       playing = true;
       checkReady();
    }, true);
  
    VIDEO_FRAME.addEventListener('timeupdate', function() {
       timeupdate = true;
       checkReady();
    }, true);
    VIDEO_FRAME.crossOrigin = "anonymous";
    VIDEO_FRAME.src = "http://chenxingzhang.com/fire.mp4";
    VIDEO_FRAME.play();
  
    function checkReady() {
      if (playing && timeupdate) {
        videoready = true;
      }
    }
    return VIDEO_FRAME;
}

//The following block is heavily depend on MDN API
function initTexture() {
    GL.bindTexture(GL.TEXTURE_2D, VIDEO_TEXTURE);
  
    // Because video has to be download over the internet
    // they might take a moment until it's ready so
    // put a single pixel in the texture so we can
    // use it immediately.
    const level = 0;
    const internalFormat = GL.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = GL.RGBA;
    const srcType = GL.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
    GL.texImage2D(GL.TEXTURE_2D, level, internalFormat,
                  width, height, border, srcFormat, srcType,
                  pixel);

    // Turn off mips and set  wrapping to clamp to edge so it
    // will work regardless of the dimensions of the video.
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
  
    return VIDEO_TEXTURE;
}

function updateTexture() {
    const level = 0;
    const internalFormat = GL.RGBA;
    const srcFormat = GL.RGBA;
    const srcType = GL.UNSIGNED_BYTE;
    GL.bindTexture(GL.TEXTURE_2D, VIDEO_TEXTURE);
    GL.texImage2D(GL.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, VIDEO_FRAME);
  }

function update() {
    if (videoready) {
        updateTexture();
    }
    SHAPES.clear();
    man.update();
    SHAPES.glglgl();
    window.requestAnimationFrame(update);
}