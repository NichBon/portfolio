
// create a collection of vectors to draw each time rendered from the camera perspective?
// How do I convert a 3d representation to a 2d one?
// How do I rotate the camera view? 
// Should this be done with a parametric representation instead of vectors?
// aim for 360 frames? 1 degree of rotation per frame
// line width should be based on depth from camera (z axis?)

// angle *2 and length
// provides x y and z

// problem is rotating around the trunk makes each frame relative to the trunk not the camera
// where is the camera? Offset from tree? Offset from middle of canvas?
// I need to generate the tree first anyway, then figure out the camera offsets
// 

// object {depth, [branches]}
// each iteration draw branch
// branch drawn is based on current depth up to depth limit
// limit of branches drawn at current depth = 2 (or branches per node)^depth
// this could be randomised and just iterate through previous branches
// do I randomise directions or have it fixed?
// drawing isn't smooth? do I care? future problem?
// 

const canvas = document.getElementById('tree-canvas');
const ctx = canvas.getContext('2d');

function drawBranch(x, y, length, angle, depth) {
    if (depth === 0 || length < 2) { // Base case
        return;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
    const endX = x + length * Math.cos(angle);
    const endY = y + length * Math.sin(angle);
    ctx.lineTo(endX, endY);
    ctx.lineWidth = depth;
    // create color depth object to reference (WON'T WORK FOR SIMPLE 3D DUE TO BACK SIDE DRAWING OVER FRONT SIDE)
    if(depth < 3) {
        ctx.strokeStyle = "green";
    } else if (depth < 5) {
        ctx.strokeStyle = "SaddleBrown";
    } else {
        ctx.strokeStyle = "black";
    }
    ctx.stroke();

    // Recursive calls for sub-branches
    drawBranch(endX, endY, length * 0.7, angle - Math.PI / 6, depth - 1); // Left branch
    drawBranch(endX, endY, length * 0.7, angle + Math.PI / 6, depth - 1); // Right branch
}

const startX = canvas.width / 2;
const startY = canvas.height;
const initialLength = 100;
const initialAngle = -Math.PI / 2; // Pointing upwards
const maxDepth = 10;

drawBranch(startX, startY, initialLength, initialAngle, maxDepth);

// var canvas = document.getElementById("tree-canvas");
// var dc     = canvas.getContext("2d");
// var angle = 0;
// window.setInterval(function(){
//     angle = (angle + 1) % 360;
//     dc.clearRect(0, 0, canvas.width, canvas.height);

//     dc.save();
//     dc.fillStyle = "#FF0000";

//     dc.translate(150,200); // First translate the context to the center you wish to rotate around.
//     dc.rotate( angle*Math.PI/180 ); // Then do the actual rotation.
//     dc.translate(-150,-200); // Then translate the context back.

//     dc.beginPath();
//     dc.moveTo(100, 100);
//     dc.lineTo(200, 100);
//     dc.lineTo(200,300);
//     dc.lineTo(100,300);
//     dc.closePath();
//     dc.fill();

//     dc.restore();
// }, 5);