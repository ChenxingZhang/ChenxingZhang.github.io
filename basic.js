 "use strict"

//initialize the variables
const S_DIVISOR = [160, 40];
const M_DIVISOR = [120, 30];
const L_DIVISOR = [80, 20];
const STROKE = {"S":S_DIVISOR, "M":M_DIVISOR, "L":L_DIVISOR};
const MODE = {"B":"B","O":"O","F":"F","H":"H"};
const SAT_SEP = 128;
const SAT_TH = 215;
const SAT_MULT = 0.88;
const MSG = document.getElementById("MSG");

const SLIDERX = document.getElementById('sliderx');
SLIDERX.value = 0;
const SLIDERY = document.getElementById('slidery');
SLIDERY.value = 0;
const SLIDERR = document.getElementById('sliderr');
SLIDERR.value = 50;
const XS = document.getElementById('xs');
XS.value = 0;
const XE = document.getElementById('xe');
XE.value = 100;
const YS = document.getElementById('ys');
YS.value = 0;
const YE = document.getElementById('ye');
YE.value = 100;
const XSI = document.getElementById('xsi');
const XEI = document.getElementById('xei');
const YSI = document.getElementById('ysi');
const YEI = document.getElementById('yei');

let canvas = document.createElement("canvas");
let context = canvas.getContext("2d");
canvas.id = "canvas2";
canvas.class = "canvas";
canvas.style.position = "absolute";

let sampler = document.createElement("canvas");
let samcontext = sampler.getContext("2d");
sampler.id = "canvas3";
sampler.class = "canvas";

let newcanvas = document.createElement('canvas');
newcanvas.style.position = "absolute";
newcanvas.id = "canvas1";
newcanvas.class = "canvas";
let newcontext = newcanvas.getContext("2d");

let hiddencanvas = document.createElement('canvas');
hiddencanvas.style.position = "absolute";
hiddencanvas.id = "canvas4";
hiddencanvas.class = "canvas";
let hiddencontext = hiddencanvas.getContext("2d");

let img = new Image();
img.src = "";
img.crossOrigin = "Anonymous";
let root = document.getElementById("canvasRoot");
let timg = new Image();
timg.crossOrigin = "Anonymous";

let ready = false;
let rerender = false;
let brushsize = "L";
let mode = "H";
let highquality = false;
let opacity = 0.8;

timg.onerror = ()=>{
    MSG.innerHTML = "URL not working. Might because of wrong URL or CORS policies "
        + "(server might deny cross-origin requests.) If you don't know "
        + "where to find CORS-enabled server, go to <a href='http://www.imgur.com'>imgur.com</a>";
    MSG.style.backgroundColor = "#FBB";
}

timg.onload = ()=>{
    MSG.innerHTML = "READY."
    MSG.style.backgroundColor = "#BFB";
    console.log("img Okay, READY. (from tester)");
    img.src = timg.src;
    ready = true;
}

img.onload = ()=>{
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    console.log("img Okay, READY. (from img)");
    ready = true;
}

window.onload = ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    hiddencanvas.width = canvas.width;
    hiddencanvas.height = canvas.height;
    sampler.width = 1;
    sampler.height = 1;
    root.appendChild(canvas);
    root.insertBefore(newcanvas, canvas);
    //root.appendChild(sampler, newcanvas);
    sampler.style.float = "right";
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    console.log("img Okay, READY. (from window)");
    //Intro
    console.log("This is intended to be an online js image processor, pretty simple right now.");
    console.log("You should first put a valid image URL into the first text field. (Be cautious to CORS)");
    console.log("After putting the URL and hit the arrows, you could select the style and stroke size,");
    console.log("They will have different effect on the out put image.");
    console.log("The 'transform' section is only a playground to try out the translate funcs.");
    console.log("For hierarchical moves, there are two lines of texts on the top left corner of the image after applying any of the effects."
               + " One of them will follow the movements of the effect canvas.");
    console.log("Might take a while to process, depending on window size and hardwares");
    console.log("Estimated run time is between 1 sec and 25 secs (Low,L,B/H will be the fastest, H,S,F will be the slowest.)");
}
function setNotReady(){
    ready = false;
    MSG.innerHTML = "Remember to hit the '->' button to check the img availability! ";
    MSG.style.backgroundColor = "#FBB";
    ready = false;
    
}

function checkImage(){
    ready = false;
    let URL = document.getElementById("URL").value;
    timg.src = URL;
}

function setQuality(q){
    if (q){
        document.getElementById("HQS").innerHTML = "  X";
        document.getElementById("LQS").innerHTML = "";
    }else{
        document.getElementById("HQS").innerHTML = "";
        document.getElementById("LQS").innerHTML = "  X";
    }
    highquality = q;
}

function getStrokeSize(){
    let strokesize = [Math.floor(canvas.width/STROKE[brushsize][0]), 
        Math.floor(canvas.height/STROKE[brushsize][1])];
    return strokesize;
}

//set brush size.
function setBrushSize(size){
    document.getElementById(brushsize).innerHTML = brushsize;
    document.getElementById(size).innerHTML += "  X";
    brushsize = size;
}

//set Area of Effect
function setAOE(){
    document.getElementById("xsi").innerHTML = XS.value;
    document.getElementById("xei").innerHTML = XE.value;
    document.getElementById("ysi").innerHTML = YS.value;
    document.getElementById("yei").innerHTML = YE.value;
}

//set style.
function setStyle(style){
    document.getElementById(mode).innerHTML = mode;
    document.getElementById(style).innerHTML += "  X";
    mode = style;
}

function moveNewCanvas(){
    newcanvas.width = newcanvas.width;
    newcontext.save();
    newcontext.font = "150px, Arial";
    newcontext.fillText("For CS559", 0, 20);
    newcontext.translate(SLIDERX.value/100 * canvas.width, SLIDERY.value/100 * canvas.height);
    newcontext.rotate((SLIDERR.value - 50) * 0.01 * Math.PI);
    newcontext.drawImage(hiddencanvas, 0, 0);
    newcontext.fillText("Spring, 2018", 0, 50);
    newcontext.restore();
}

//Specifically, sampler will get rgb info from canvas and 
//generate a single cell at its position.
function getSample(x, y, even){
    let cellsize = getStrokeSize();
    if (mode == MODE.H){
        cellsize[0] *= 4;
        cellsize[1] *= 3;
    }
    let p = 0;
    let r = 0;
    let g = 0;
    let b = 0;
    sampler.width = cellsize[0];
    sampler.height = cellsize[1];
    //take avg of nine pixels per cell in highquality mode.
    if (highquality){
        //Take 9 pixels in the cell and take avg.
        let stepsize = Math.ceil(cellsize[0]/2);
        for (let i = 0; i <= cellsize[1]; i += stepsize) {
            for (let j = 0; j <= cellsize[0]; j += stepsize) {
                let celldata = context.getImageData(x + j, y + i, 1, 1);
                r += celldata.data[0];
                g += celldata.data[1];
                b += celldata.data[2];
                p ++;
            }
        }

        r = Math.floor(r/p);
        g = Math.floor(g/p);
        b = Math.floor(b/p);
    }else{
        let data = context.getImageData(x + Math.ceil(cellsize[0]/2), y + Math.ceil(cellsize[1]/2), 1, 1);
        r = data.data[0];
        g = data.data[1];
        b = data.data[2];
    }
    //Now, rgb has the avgs. Adjust values to make the img better.
    let res = getValues(r, g, b);
    r = res[0];
    g = res[1];
    b = res[2];

    if (mode == MODE.H){
        cellsize[0] /= 4;
        cellsize[1] /= 3;
    }

    //Hexagons
    if (mode == MODE.H){
        samcontext.beginPath();
        samcontext.rect(0,0,cellsize[0],cellsize[1]);
        samcontext.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        samcontext.fill();
    }

    //Simply fill it;
    if (mode == MODE.B){
        samcontext.beginPath();
        samcontext.rect(0,0,cellsize[0],cellsize[1]);
        samcontext.fillStyle = "rgba(" + r + "," + g + "," + b + "," + opacity + ")";
        samcontext.fill();
    }
    //Or, mimic the brush strokes;
    if (mode == MODE.O){
        let brushhair = 3;
        if (even){
            for (let k = 0; k < cellsize[0]; k += brushhair){
                samcontext.beginPath();
	        samcontext.rect(k, 0, brushhair, cellsize[1]);
                samcontext.fillStyle = "rgba(" + Math.floor(r * (Math.random()*0.3 + 0.925)) + 
                    "," + Math.floor(g * (Math.random()*0.3 + 0.925)) +
                    "," + Math.floor(b * (Math.random()*0.3 + 0.925)) +
                    "," + opacity + ")";
	        samcontext.fill();
            }
        }
    }
    //Or, create Fabric effects;
    if (mode == MODE.F){
       let brushhair = 3;
       if (even){
           for (let k = 0; k < cellsize[0]; k += brushhair){
                samcontext.beginPath();
	        samcontext.rect(k, 0, brushhair - 2, cellsize[1]);
                samcontext.fillStyle = "rgba(" + Math.floor(r * (Math.random()*0.3 + 0.925)) + 
                    "," + Math.floor(g * (Math.random()*0.3 + 0.925)) + 
                    "," + Math.floor(b * (Math.random()*0.3 + 0.925)) +
                    "," + opacity + ")";
	        samcontext.fill();
           }
       } else {
           for (let l = 0; l < cellsize[1]; l += brushhair){
               samcontext.beginPath();
	       samcontext.rect(0, l, cellsize[0], brushhair - 1);
               samcontext.fillStyle = "rgba(" + Math.floor(r * (Math.random()*0.3 + 0.925)) + 
                   "," + Math.floor(g * (Math.random()*0.3 + 0.925)) + 
                   "," + Math.floor(b * (Math.random()*0.3 + 0.925)) +
                   "," + opacity + ")";
	       samcontext.fill();
            }
        }
    }
}

//Used to created rough cells depending on the original canvas.
function drawCells(){
    if(!ready){
        console.log("Not Ready! You might need to put the URL and click the arrow btn first!");
        return;
    }
    newcanvas.width = newcanvas.width;

    let cellsize = getStrokeSize();
    document.getElementById("canvasRoot").appendChild(newcanvas);
    let xoff = Math.floor(canvas.width * XS.value / 100);
    let yoff = Math.floor(canvas.height * YS.value / 100);
    newcanvas.width = canvas.width;
    newcanvas.height = canvas.height;

    //Creating cells for Hexagons.
    if (mode == MODE.H){
        let hexsize = [Math.floor(STROKE[brushsize][0] * (XE.value - XS.value) / 100),
                      Math.floor(STROKE[brushsize][1] * (YE.value - YS.value) / 100)];
        let row1 = [];
        let row2 = [];
        let row3 = [];
        //initialize the cells in the first three rows.
        for (let j = 0; j < hexsize[0] + 4; j += 4){ 
            row1.push([Math.random() * cellsize[0], Math.random() * cellsize[1]]);
            row1.push([Math.random() * cellsize[0], Math.random() * cellsize[1]]);
            row2.push([Math.random() * cellsize[0], Math.random() * cellsize[1]]);
            row2.push([Math.random() * cellsize[0], Math.random() * cellsize[1]]);
            row3.push([Math.random() * cellsize[0], Math.random() * cellsize[1]]);
            row3.push([Math.random() * cellsize[0], Math.random() * cellsize[1]]);
        }
        for (let i = 0; i < hexsize[1] - 1; i ++){ //rows - y
            for (let j = (1 - i % 2) * 2; j < hexsize[0] - 2; j += 4){ //columns - x
                //first connect and fill the hexagons
                newcontext.beginPath();
                //Estimate the values in the hexagon.
                getSample(j * cellsize[0] + xoff, i * cellsize[1] + yoff, true);
                let data = samcontext.getImageData(0,0,1,1).data;

                //fill the hexagon
                newcontext.fillStyle = "rgba(" + data[0] +"," +
                    data[1] +"," + data[2] +"," + opacity + ")";
                newcontext.strokeStyle = "rgba(0,0,0,0.5)";
                newcontext.lineWidth = 3;
                newcontext.moveTo(row2[j/2][0] + j * cellsize[0] + xoff,
                    row2[j/2][1] + i * cellsize[1] + cellsize[1] * 1 + yoff);
                newcontext.lineTo(row1[j/2][0] + j * cellsize[0] + cellsize[0] * 1 + xoff,
                    row1[j/2][1] + i * cellsize[1] + yoff);
                newcontext.lineTo(row1[j/2 + 1][0] + j * cellsize[0] + cellsize[0] * 2 + xoff,
                    row1[j/2 + 1][1] + i * cellsize[1] + yoff);
                newcontext.lineTo(row2[j/2 + 1][0] + j * cellsize[0] + cellsize[0] * 3 + xoff,
                    row2[j/2 + 1][1] + i * cellsize[1] + cellsize[1] * 1 + yoff);
                newcontext.lineTo(row3[j/2 + 1][0] + j * cellsize[0] + cellsize[0] * 2 + xoff,
                    row3[j/2 + 1][1] + i * cellsize[1] + cellsize[1] * 2 + yoff);
                newcontext.lineTo(row3[j/2][0] + j * cellsize[0] + cellsize[0] * 1 + xoff,
                    row3[j/2][1] + i * cellsize[1] + cellsize[1] * 2 + yoff);

                newcontext.closePath();
                newcontext.fill();
                newcontext.stroke();
            }
            //push the rows(a long window) down
            row1 = row2;
            row2 = row3;
            row3 = [];
            console.log("Processing cells, now at " + Math.floor(100 * i / STROKE[brushsize][1]) + "%...");
            for (let j = (1 - (i + 1) % 2) * 2; j < hexsize[0] + 4; j += 4){ 
                row3.push([Math.random() * cellsize[0], Math.random() * cellsize[1]]);
                row3.push([Math.random() * cellsize[0], Math.random() * cellsize[1]]);
            }
        }
    }else
    //Creating cells for regular effects (B,F,O).
    {
        let even = true;
        for (let y = yoff; y < newcanvas.height * (YE.value - YS.value) / 100; y += cellsize[1]){
            for (let x = xoff; x < newcanvas.width * (XE.value - XS.value) / 100; x += cellsize[0]){
                if(even)
                    even = false;
                else
                    even = true;
                let r = 0;
                let g = 0;
                let b = 0;
                getSample(x, y, even);
                newcontext.drawImage(sampler, x, y);
            }
            console.log("Processing cells, now at " + Math.floor(y * 100 / (newcanvas.height * ((YE.value - YS.value)/100))) + "%...");
        }
    }

    hiddencanvas.width = hiddencanvas.width;
    hiddencontext.drawImage(newcanvas, 0, 0);
    newcontext.fillText("For CS559", 0, 20);
    newcontext.fillText("Spring, 2018", 0, 50);
    console.log("Done!");
}

//Increase the saturation value given max/min values (Also increase contrast).
function getValues(r, g, b){
    let m = [0, 0];
    let rgb = [0, 0, 0];

    if (b > g && b > r && g > r){
        m = getSaturation(b, r);
        b = m[0];
        r = m[1];
    }else if (b > g && b > r && g < r){
        m = getSaturation(b, g);
        b = m[0];
        g = m[1];
    }else if (g > r && r > b){
        m = getSaturation(g, b);
        g = m[0];
        b = m[1];
    }else if (g > r && r < b){
        m = getSaturation(g, r);
        g = m[0];
        r = m[1];
    }else if (g > b){
        m = getSaturation(r, b);
        r = m[0];
        b = m[1];
    }else{
        m = getSaturation(r, g);
        r = m[0];
        g = m[1];
    }
    return getContrast(r, g, b);
}

//Increase contract given rgb values.
function getContrast(r, g, b){
    let total = r + g + b;
    let multiplier = 
        -1 / 765 * (total - 383) / 765 * (total - 765) + 1;

    return [Math.floor(r * multiplier), 
            Math.floor(g * multiplier), 
            Math.floor(b * multiplier)];
}

//Adjust the saturation value given max/min values (Also increase contrast).
//Higher the sat when sat was high
//Lower the sat when sat was low
function getSaturation(max, min){
    if (max == min){
        return [max, min];
    }
    if (min > SAT_TH){
        return [max, min];
    }
    if ((max - min) > SAT_SEP){
        return [max, Math.floor(min * SAT_MULT)];
    }

    return [Math.floor(max * SAT_MULT), min];
}



















































