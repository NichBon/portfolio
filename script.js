
const canvas = document.getElementById('tree-canvas');
const ctx = canvas.getContext('2d');
const branchQueue = [];
const btn = document.getElementById('redraw-btn');

function resizeCanvas() {
    canvas.width = Math.min(window.innerWidth * 0.8, 800);
    canvas.height = Math.min(window.innerHeight * 0.7, canvas.width);
    console.log("Canvas resized:", canvas.width, canvas.height);
}

function buildBranches(x, y, length, angle, depth) {
    if (depth === 0 || length < 2) return;

    const endX = x + length * Math.cos(angle);
    const endY = y + length * Math.sin(angle);

    branchQueue.push({ x, y, endX, endY, depth })

    var seed = Math.floor(Math.random() * 15)
    if (seed >= 11) {
        buildBranches(endX, endY, length * 0.7, angle - Math.PI / 6, depth - 1);
        buildBranches(endX, endY, length * 0.7, angle + Math.PI / 6, depth - 1);
        buildBranches(endX, endY, length * 0.7, angle, depth - 1);
    } else if (seed >= 6 || depth === 10) {
        buildBranches(endX, endY, length * 0.7, angle - Math.PI / 6, depth - 1);
        buildBranches(endX, endY, length * 0.7, angle + Math.PI / 6, depth - 1);
        if (depth > 3 && seed >= 9) {
            buildBranches(endX, endY, length * 0.7 ** 5, angle - Math.PI * 2 / 3, 4);
            buildBranches(endX, endY, length * 0.7 ** 5, angle + Math.PI * 2 / 3, 4);
        }
    } else if (seed >= 3) {
        buildBranches(endX, endY, length * 0.7, angle + Math.PI / 6, depth - 1);
        if (depth > 3) {
            buildBranches(endX, endY, length * 0.7 ** 5, angle - Math.PI / 6, 4);
            buildBranches(endX, endY, length * 0.7 ** 5, angle + Math.PI * 2 / 3, 4);
        }
    } else if (seed >= 0) {
        buildBranches(endX, endY, length * 0.7, angle - Math.PI / 6, depth - 1);
        if (depth > 3) {
            buildBranches(endX, endY, length * 0.7 ** 5, angle + Math.PI / 6, 4);
            buildBranches(endX, endY, length * 0.7 ** 5, angle - Math.PI * 2 / 3, 4);
        }
    }
}

function drawBranches(branches, delay = 100) {
    let i = 0;

    function drawNext() {
        if (i >= branches.length) {
            branchQueue.length = 0;
            btn.classList.add('visible');
            return;
        }

        const { x, y, endX, endY, depth } = branches[i];
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.lineWidth = depth === 1 ? 4 : depth;
        ctx.strokeStyle = depth < 2 ? "pink" : depth < 4 ? "green" : depth < 6 ? "#6d2002" : "#381000";
        ctx.stroke();

        i++;
        setTimeout(drawNext, depth ** 2 / 2);
    }

    drawNext();
}

function drawTree(startX, startY, initialLength, initialAngle, maxDepth, drawDelay) {
    buildBranches(startX, startY, initialLength, initialAngle, maxDepth);
    branchQueue.sort((a, b) => b.depth - a.depth);
    console.log(branchQueue);
    drawBranches(branchQueue, drawDelay);
}

document.getElementById('redraw-btn').addEventListener('click', () => {
    if (branchQueue.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        btn.classList.remove('visible');
        redrawTree();
    }
});

function redrawTree() {
    resizeCanvas();
    const startX = canvas.width / 2;
    const startY = canvas.height;
    const initialLength = canvas.height / 3.33;
    const initialAngle = -Math.PI / 2;
    const maxDepth = 10;
    const drawDelay = 25;

    console.log({
        width: canvas.width,
        height: canvas.height,
        startX,
        startY,
        initialLength
    });

    drawTree(startX, startY, initialLength, initialAngle, maxDepth, drawDelay);
}

redrawTree();


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

/// ROTATION BY SHIFTING CAMERA ANGLE

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