import { canvasAnimator, canvas } from "./main.js";
export function setListeners() {
    setButtonOnClick("growLine", growLine);
    setButtonOnClick("growCircle", growCircle);
    setButtonOnClick("growText", growText);
    setButtonOnClick("growRect", growRect);
    setButtonOnClick("foldLine", foldLine);
    setButtonOnClick("foldCircle", foldCircle);
    setButtonOnClick("foldText", foldText);
    setButtonOnClick("foldRect", foldRect);
    setButtonOnClick("dash", dash);
    setButtonOnClick("moveLine", moveLine);
    setButtonOnClick("moveLine2", moveLine2);
    setButtonOnClick("moveCircle", moveCircle);
    setButtonOnClick("moveText", moveText);
    setButtonOnClick("moveRect", moveRect);
    setButtonOnClick("growFoldLine", growFoldLine);
    setButtonOnClick("growFoldCircle", growFoldCircle);
    setButtonOnClick("growFoldRect", growFoldRect);
    setButtonOnClick("growMoveCircle", growMoveCircle);
    setButtonOnClick("growMoveCircle2", growMoveCircle2);
    setButtonOnClick("growMoveRect", growMoveRect);
    setButtonOnClick("growMoveFoldCircle", growMoveFoldCircle);
    setButtonOnClick("growMoveFoldRect", growMoveFoldRect);
}
const styles = {
    fill: (ctx) => { ctx.fillStyle = "aquamarine"; },
    stroke: (ctx) => { ctx.strokeStyle = "darkblue"; },
    stroke2: (ctx) => { ctx.strokeStyle = "darkblue"; ctx.lineWidth = 2; },
    text: (ctx) => { ctx.font = "30px Arial"; },
    shadow: [
        (ctx) => {
            ctx.strokeStyle = "blue";
            ctx.lineWidth = 2;
            ctx.shadowBlur = 5;
            ctx.shadowColor = "black";
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
        },
        (ctx) => {
            ctx.strokeStyle = "lightblue";
            ctx.lineWidth = 2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = "black";
            ctx.shadowOffsetX = 10;
            ctx.shadowOffsetY = 10;
        },
        (ctx) => {
            ctx.strokeStyle = "darkblue";
            ctx.lineWidth = 2;
            ctx.shadowBlur = 3;
            ctx.shadowColor = "black";
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;
        },
    ],
};
function growLine() {
    canvasAnimator.drawLine(50, 50, 200, 200, false, [
        canvasAnimator.createLineAnimation.grow(0, 1000),
        canvasAnimator.createLineAnimation.draw(0, 200),
    ], styles.shadow[0]);
}
function growCircle() {
    canvasAnimator.drawCircle(100, 100, 80, false, false, [
        canvasAnimator.createCircleAnimation.grow(0, 1000, 0),
        canvasAnimator.createCircleAnimation.draw(0, 200),
    ], styles.shadow[0]);
    canvasAnimator.drawCircle(300, 100, 80, true, false, [
        canvasAnimator.createCircleAnimation.grow(0, 1000, 45),
        canvasAnimator.createCircleAnimation.draw(0, 200),
    ], styles.fill);
    canvasAnimator.drawCircle(100, 300, 80, true, false, [
        canvasAnimator.createCircleAnimation.grow(0, 1000, -135),
        canvasAnimator.createCircleAnimation.draw(0, 200),
    ], styles.fill);
    canvasAnimator.drawCircle(100, 300, 80, false, false, [
        canvasAnimator.createCircleAnimation.grow(0, 1000, -135),
        canvasAnimator.createCircleAnimation.draw(0, 200),
    ], styles.stroke2);
}
function growText() {
    canvasAnimator.drawText(50, 50, "Hello world", false, [
        canvasAnimator.createTextAnimation.grow(0, 1000),
        canvasAnimator.createTextAnimation.draw(0, 500),
    ], styles.text);
}
function growRect() {
    canvasAnimator.drawRect(50, 100, 200, 150, true, [
        canvasAnimator.createRectAnimation.growXY(0, 2000, true, true),
        canvasAnimator.createRectAnimation.draw(0 + 2000, 250),
    ]);
    canvasAnimator.drawRect(300, 100, 200, 150, true, [
        canvasAnimator.createRectAnimation.growY(500, 2000, false),
        canvasAnimator.createRectAnimation.draw(500 + 2000, 250),
    ]);
    canvasAnimator.drawRect(50, 300, 200, 150, true, [
        canvasAnimator.createRectAnimation.growX(1000, 2000, false),
        canvasAnimator.createRectAnimation.draw(1000 + 2000, 250),
    ], styles.fill);
    canvasAnimator.drawRect(300, 300, 200, 150, true, [
        canvasAnimator.createRectAnimation.growXY(1500, 2000, false, false),
        canvasAnimator.createRectAnimation.draw(1500 + 2000, 250),
    ], styles.stroke);
}
function foldLine() {
    canvasAnimator.drawLine(50, 80, 200, 230, false, [
        canvasAnimator.createLineAnimation.draw(0, 200),
        canvasAnimator.createLineAnimation.fold(0, 1000),
    ], styles.shadow[0]);
}
function foldCircle() {
    canvasAnimator.drawCircle(100, 100, 80, false, false, [
        canvasAnimator.createCircleAnimation.draw(0, 200),
        canvasAnimator.createCircleAnimation.fold(0, 1000, 0),
    ], styles.shadow[0]);
    canvasAnimator.drawCircle(300, 100, 80, true, false, [
        canvasAnimator.createCircleAnimation.draw(0, 200),
        canvasAnimator.createCircleAnimation.fold(0, 1000, 45),
    ], styles.fill);
    canvasAnimator.drawCircle(100, 300, 80, true, false, [
        canvasAnimator.createCircleAnimation.draw(0, 200),
        canvasAnimator.createCircleAnimation.fold(0, 1000, -135),
    ], styles.fill);
    canvasAnimator.drawCircle(100, 300, 80, false, false, [
        canvasAnimator.createCircleAnimation.draw(0, 200),
        canvasAnimator.createCircleAnimation.fold(0, 1000, -135),
    ], styles.stroke2);
}
function foldText() {
    canvasAnimator.drawText(50, 80, "Hello world", false, [
        canvasAnimator.createTextAnimation.draw(0, 500),
        canvasAnimator.createTextAnimation.fold(0, 1000),
    ], styles.text);
}
function foldRect() {
    canvasAnimator.drawRect(50, 100, 200, 150, true, [
        canvasAnimator.createRectAnimation.draw(0, 250),
        canvasAnimator.createRectAnimation.foldX(0 + 250, 2000, true),
    ]);
    canvasAnimator.drawRect(300, 100, 200, 150, true, [
        canvasAnimator.createRectAnimation.draw(500, 250),
        canvasAnimator.createRectAnimation.foldXY(500 + 250, 2000, true, false),
    ]);
    canvasAnimator.drawRect(50, 300, 200, 150, true, [
        canvasAnimator.createRectAnimation.draw(1000, 250),
        canvasAnimator.createRectAnimation.foldY(1000 + 250, 2000, true),
    ], styles.fill);
    canvasAnimator.drawRect(300, 300, 200, 150, true, [
        canvasAnimator.createRectAnimation.draw(1500, 250),
        canvasAnimator.createRectAnimation.foldXY(1500 + 250, 2000, false, false),
    ], styles.stroke);
}
function dash() {
    canvasAnimator.drawLine(50, 50, 250, 200, false, [
        canvasAnimator.createLineAnimation.dash(0, 20, [10, 10]),
        canvasAnimator.createLineAnimation.grow(0, 1000),
        canvasAnimator.createLineAnimation.draw(0, 1000),
        canvasAnimator.createLineAnimation.fold(0, 1000),
    ], styles.shadow[0]);
    canvasAnimator.drawCircle(380, 125, 80, false, true, [
        canvasAnimator.createCircleAnimation.dash(0, 20, [10, 10]),
        canvasAnimator.createCircleAnimation.grow(0, 1000, 90),
        canvasAnimator.createCircleAnimation.draw(0, 1000),
        canvasAnimator.createCircleAnimation.fold(0, 1000, 90, true),
    ], styles.shadow[0]);
    canvasAnimator.drawRect(50, 250, 200, 150, false, [
        canvasAnimator.createRectAnimation.dash(0, 20, [10, 10]),
        canvasAnimator.createRectAnimation.growX(0, 1000, true),
        canvasAnimator.createRectAnimation.draw(0, 1000),
        canvasAnimator.createRectAnimation.foldY(0, 1000, true),
    ], styles.shadow[0]);
}
function moveLine() {
    canvasAnimator.drawLine(0, 0, 500, 500, false, [
        canvasAnimator.createLineAnimation.draw(0, 250),
        canvasAnimator.createLineAnimation.moveTo(0, 1000, 200, 200, 700, 400),
        canvasAnimator.createLineAnimation.draw(0, 500),
    ], styles.shadow[0]);
    canvasAnimator.drawLine(50, 100, 300, 300, false, [
        canvasAnimator.createLineAnimation.dash(500, 20, [20, 40]),
        canvasAnimator.createLineAnimation.draw(0, 250),
        canvasAnimator.createLineAnimation.moveTo(0, 1000, 300, 50, 100, 300),
        canvasAnimator.createLineAnimation.draw(0, 500),
    ], styles.shadow[0]);
}
function moveLine2() {
    canvasAnimator.drawLine(50, 50, 300, 300, false, [
        canvasAnimator.createLineAnimation.draw(0, 250),
        canvasAnimator.createLineAnimation.moveTo(0, 1000, 50, 50, 400, 400),
        canvasAnimator.createLineAnimation.draw(0, 500),
    ], styles.shadow[0]);
    canvasAnimator.drawLine(50, 100, 300, 350, false, [
        canvasAnimator.createLineAnimation.draw(0, 250),
        canvasAnimator.createLineAnimation.moveTo(0, 1000, 50, 100, 200, 250),
        canvasAnimator.createLineAnimation.draw(0, 500),
    ], styles.shadow[0]);
    canvasAnimator.drawLine(50, 150, 300, 400, false, [
        canvasAnimator.createLineAnimation.draw(0, 250),
        canvasAnimator.createLineAnimation.moveTo(0, 1000, 10, 110, 300, 400),
        canvasAnimator.createLineAnimation.draw(0, 500),
    ], styles.shadow[0]);
    canvasAnimator.drawLine(50, 200, 300, 450, false, [
        canvasAnimator.createLineAnimation.draw(0, 250),
        canvasAnimator.createLineAnimation.moveTo(0, 1000, 100, 250, 300, 450),
        canvasAnimator.createLineAnimation.draw(0, 500),
    ], styles.shadow[0]);
    canvasAnimator.drawLine(50, 250, 300, 500, false, [
        canvasAnimator.createLineAnimation.draw(0, 250),
        canvasAnimator.createLineAnimation.moveTo(0, 1000, 10, 210, 350, 550),
        canvasAnimator.createLineAnimation.draw(0, 500),
    ], styles.shadow[0]);
    canvasAnimator.drawLine(50, 300, 300, 550, false, [
        canvasAnimator.createLineAnimation.draw(0, 250),
        canvasAnimator.createLineAnimation.moveTo(0, 1000, 130, 380, 200, 450),
        canvasAnimator.createLineAnimation.draw(0, 500),
    ], styles.shadow[0]);
}
function moveCircle() {
    canvasAnimator.drawCircle(100, 100, 50, false, false, [
        canvasAnimator.createCircleAnimation.draw(0, 250),
        canvasAnimator.createCircleAnimation.moveTo(0, 1000, 100, 100, 95),
        canvasAnimator.createCircleAnimation.draw(0, 250),
    ], styles.shadow[0]);
    canvasAnimator.drawCircle(250, 100, 50, false, false, [
        canvasAnimator.createCircleAnimation.draw(0, 250),
        canvasAnimator.createCircleAnimation.moveTo(0, 1000, 250, 100, 25),
        canvasAnimator.createCircleAnimation.draw(0, 250),
    ], styles.shadow[0]);
    canvasAnimator.drawCircle(100, 250, 50, false, false, [
        canvasAnimator.createCircleAnimation.draw(0, 250),
        canvasAnimator.createCircleAnimation.moveTo(0, 500, 175, 250, 25),
        canvasAnimator.createCircleAnimation.moveTo(0, 500, 250, 250, 50),
        canvasAnimator.createCircleAnimation.draw(0, 250),
    ], styles.shadow[0]);
}
function moveText() {
    canvasAnimator.drawText(50, 100, "Hello world", false, [
        canvasAnimator.createTextAnimation.draw(0, 250),
        canvasAnimator.createTextAnimation.moveTo(0, 1000, 50, 250),
        canvasAnimator.createTextAnimation.draw(0, 250),
    ], styles.text);
    canvasAnimator.drawText(250, 100, "Hello world", false, [
        canvasAnimator.createTextAnimation.draw(0, 250),
        canvasAnimator.createTextAnimation.moveTo(0, 1000, 50, 100),
        canvasAnimator.createTextAnimation.draw(0, 250),
    ], styles.text);
    canvasAnimator.drawText(50, 250, "Hello world", false, [
        canvasAnimator.createTextAnimation.draw(0, 250),
        canvasAnimator.createTextAnimation.moveTo(0, 1000, 250, 250),
        canvasAnimator.createTextAnimation.draw(0, 250),
    ], styles.text);
    canvasAnimator.drawText(250, 250, "Hello world", false, [
        canvasAnimator.createTextAnimation.draw(0, 250),
        canvasAnimator.createTextAnimation.moveTo(0, 1000, 250, 100),
        canvasAnimator.createTextAnimation.draw(0, 250),
    ], styles.text);
}
function moveRect() {
    canvasAnimator.drawRect(50, 50, 150, 150, false, [
        canvasAnimator.createRectAnimation.draw(0, 250),
        canvasAnimator.createRectAnimation.moveTo(0, 1000, 50, 50, 75, 150),
        canvasAnimator.createRectAnimation.moveTo(0, 500, 50, 112.5, 75, 150),
        canvasAnimator.createRectAnimation.moveTo(0, 500, 112.5, 112.5, 75, 150),
        canvasAnimator.createRectAnimation.draw(0, 500),
    ], styles.shadow[0]);
    canvasAnimator.drawRect(250, 50, 150, 150, false, [
        canvasAnimator.createRectAnimation.draw(0, 250),
        canvasAnimator.createRectAnimation.moveTo(0, 1000, 250, 50, 150, 75),
        canvasAnimator.createRectAnimation.moveTo(0, 500, 250, 112.5, 150, 75),
        canvasAnimator.createRectAnimation.moveTo(0, 500, 187.5, 112.5, 150, 75),
        canvasAnimator.createRectAnimation.draw(0, 500),
    ], styles.shadow[0]);
    canvasAnimator.drawRect(50, 250, 150, 150, false, [
        canvasAnimator.createRectAnimation.draw(0, 250),
        canvasAnimator.createRectAnimation.moveTo(0, 1000, 50, 325, 150, 75),
        canvasAnimator.createRectAnimation.moveTo(0, 500, 50, 262.5, 150, 75),
        canvasAnimator.createRectAnimation.moveTo(0, 500, 112.5, 262.5, 150, 75),
        canvasAnimator.createRectAnimation.draw(0, 500),
    ], styles.shadow[0]);
    canvasAnimator.drawRect(250, 250, 150, 150, false, [
        canvasAnimator.createRectAnimation.draw(0, 250),
        canvasAnimator.createRectAnimation.moveTo(0, 1000, 325, 250, 75, 150),
        canvasAnimator.createRectAnimation.moveTo(0, 500, 325, 187.5, 75, 150),
        canvasAnimator.createRectAnimation.moveTo(0, 500, 262.5, 187.5, 75, 150),
        canvasAnimator.createRectAnimation.draw(0, 500),
    ], styles.shadow[0]);
}
function growFoldLine() {
    for (let i = 0; i < 100; i++) {
        canvasAnimator.drawLine(rndInt(canvas.width), rndInt(canvas.height), rndInt(canvas.width), rndInt(canvas.height), true, [
            canvasAnimator.createLineAnimation.grow(0, rndInt(800) + 200),
            canvasAnimator.createLineAnimation.draw(0, rndInt(800) + 200),
            canvasAnimator.createLineAnimation.fold(0, rndInt(800) + 200),
        ], styles.shadow[rndInt(styles.shadow.length)]);
    }
}
function growFoldCircle() {
    for (let i = 0; i < 100; i++) {
        canvasAnimator.drawCircle(rndInt(canvas.width), rndInt(canvas.height), rndInt(100) + 10, false, true, [
            canvasAnimator.createCircleAnimation.grow(0, rndInt(800) + 200, -90, true),
            canvasAnimator.createCircleAnimation.draw(0, rndInt(800) + 200),
            canvasAnimator.createCircleAnimation.fold(0, rndInt(800) + 200, -90),
        ], styles.shadow[rndInt(styles.shadow.length)]);
    }
}
function growFoldRect() {
    canvasAnimator.drawRect(50, 100, 200, 150, false, [
        canvasAnimator.createRectAnimation.growFullControls(0, 1000, true, false, true, true, true, false),
        canvasAnimator.createRectAnimation.growFullControls(0, 1000, true, true, false, true, true, true),
        canvasAnimator.createRectAnimation.growFullControls(0, 1000, true, true, true, true, false, false),
        canvasAnimator.createRectAnimation.growFullControls(0, 1000, true, false, false, true, false, true),
    ]);
}
function growMoveCircle() {
    canvasAnimator.drawCircle(100, 150, 0, true, false, [
        canvasAnimator.createCircleAnimation.moveTo(0, 300, 100, 150, 40),
        canvasAnimator.createCircleAnimation.moveTo(0, 300, 170, 400, 40),
        canvasAnimator.createCircleAnimation.moveTo(0, 300, 300, 300, 40),
        canvasAnimator.createCircleAnimation.moveTo(0, 90, 340, 280, 40),
        canvasAnimator.createCircleAnimation.moveTo(0, 300, 460, 400, 40),
        canvasAnimator.createCircleAnimation.moveTo(0, 250, 460 + 100, 400 + 120, 40),
        canvasAnimator.createCircleAnimation.moveTo(0, 200, 460 + 180, 400 + 240, 0),
        canvasAnimator.createCircleAnimation.fold(0, 1500, 180),
    ]);
}
function growMoveCircle2() {
    canvasAnimator.drawCircle(100, 150, 50, true, false, [
        canvasAnimator.createCircleAnimation.grow(0, 500, -180, true),
        canvasAnimator.createCircleAnimation.moveTo(0, 300, 100, 150, 30),
        canvasAnimator.createCircleAnimation.moveTo(0, 400, 100, 150, 60),
        canvasAnimator.createCircleAnimation.moveTo(0, 300, 100, 150, 20),
        canvasAnimator.createCircleAnimation.moveTo(0, 300, 100, 150, 30),
        canvasAnimator.createCircleAnimation.moveTo(0, 300, 100, 150, 10),
        canvasAnimator.createCircleAnimation.moveTo(0, 300, 100, 150, 15),
        canvasAnimator.createCircleAnimation.moveTo(0, 300, 100, 150, 0),
    ]);
}
function growMoveRect() {
    canvasAnimator.drawRect(150, 150, 0, 0, true, [
        canvasAnimator.createRectAnimation.moveTo(0, 1000, 100, 100, 100, 100),
        canvasAnimator.createRectAnimation.moveTo(0, 1000, 50, 100, 150, 100),
        canvasAnimator.createRectAnimation.moveTo(0, 1000, 50, 100, 200, 100),
        canvasAnimator.createRectAnimation.moveTo(0, 1000, 50, 50, 200, 150),
        canvasAnimator.createRectAnimation.moveTo(0, 1000, 50, 50, 200, 200),
        canvasAnimator.createRectAnimation.moveTo(0, 1000, 150, 150, 0, 0),
    ]);
}
function growMoveFoldCircle() {
    for (let i = 0; i < 100; i++) {
        canvasAnimator.drawCircle(rndInt(canvas.width), rndInt(canvas.height), rndInt(100) + 10, false, true, [
            canvasAnimator.createCircleAnimation.grow(0, rndInt(800) + 200, -90, true),
            canvasAnimator.createCircleAnimation.moveTo(0, rndInt(1600) + 400, rndInt(canvas.width), rndInt(canvas.height), rndInt(100) + 10),
            canvasAnimator.createCircleAnimation.fold(0, rndInt(800) + 200, -90),
        ], styles.shadow[rndInt(styles.shadow.length)]);
    }
}
function growMoveFoldRect() {
    canvasAnimator.drawRect(50, 50, 150, 150, false, [
        canvasAnimator.createRectAnimation.growXY(0, 1000, true, true),
        canvasAnimator.createRectAnimation.moveTo(0, 1000, 50, 50, 75, 150),
        canvasAnimator.createRectAnimation.moveTo(0, 700, 50, 112.5, 75, 150),
        canvasAnimator.createRectAnimation.moveTo(0, 700, 112.5, 112.5, 75, 150),
        canvasAnimator.createRectAnimation.moveTo(0, 700, 112.5, 187.5, 75, 75),
        canvasAnimator.createRectAnimation.moveTo(0, 800, 187.5, 187.5, 75, 75),
        canvasAnimator.createRectAnimation.foldXY(0, 2000, false, false),
    ], styles.shadow[0]);
    canvasAnimator.drawRect(250, 50, 150, 150, false, [
        canvasAnimator.createRectAnimation.growXY(0, 1000, false, true),
        canvasAnimator.createRectAnimation.moveTo(0, 1000, 250, 50, 150, 75),
        canvasAnimator.createRectAnimation.moveTo(0, 700, 250, 112.5, 150, 75),
        canvasAnimator.createRectAnimation.moveTo(0, 700, 187.5, 112.5, 150, 75),
        canvasAnimator.createRectAnimation.moveTo(0, 700, 187.5, 112.5, 75, 75),
        canvasAnimator.createRectAnimation.moveTo(0, 800, 187.5, 187.5, 75, 75),
        canvasAnimator.createRectAnimation.foldXY(0, 2000, true, false),
    ], styles.shadow[0]);
    canvasAnimator.drawRect(50, 250, 150, 150, false, [
        canvasAnimator.createRectAnimation.growXY(0, 1000, true, false),
        canvasAnimator.createRectAnimation.moveTo(0, 1000, 50, 325, 150, 75),
        canvasAnimator.createRectAnimation.moveTo(0, 700, 50, 262.5, 150, 75),
        canvasAnimator.createRectAnimation.moveTo(0, 700, 112.5, 262.5, 150, 75),
        canvasAnimator.createRectAnimation.moveTo(0, 700, 187.5, 262.5, 75, 75),
        canvasAnimator.createRectAnimation.moveTo(0, 800, 187.5, 187.5, 75, 75),
        canvasAnimator.createRectAnimation.foldXY(0, 2000, false, true),
    ], styles.shadow[0]);
    canvasAnimator.drawRect(250, 250, 150, 150, false, [
        canvasAnimator.createRectAnimation.growXY(0, 1000, false, false),
        canvasAnimator.createRectAnimation.moveTo(0, 1000, 325, 250, 75, 150),
        canvasAnimator.createRectAnimation.moveTo(0, 700, 325, 187.5, 75, 150),
        canvasAnimator.createRectAnimation.moveTo(0, 700, 262.5, 187.5, 75, 150),
        canvasAnimator.createRectAnimation.moveTo(0, 700, 262.5, 187.5, 75, 75),
        canvasAnimator.createRectAnimation.moveTo(0, 800, 187.5, 187.5, 75, 75),
        canvasAnimator.createRectAnimation.foldXY(0, 2000, true, true),
    ], styles.shadow[0]);
}
function setButtonOnClick(id, f) {
    const el = document.getElementById(id);
    if (el == null)
        throw new Error(`${id} not found`);
    if (!(el instanceof HTMLButtonElement))
        throw new Error(`${id} element not Button`);
    el.addEventListener("click", f);
}
function rndInt(bound) {
    return Math.floor(Math.random() * bound);
}
