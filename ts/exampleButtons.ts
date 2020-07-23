import { canvasAnimator, canvas } from "./main.js";

export function setListeners()
{
	setButtonOnClick("example0", ex0);
	setButtonOnClick("example1", ex1);
	setButtonOnClick("example2", ex2);
	setButtonOnClick("example3", ex3);
	setButtonOnClick("example4", ex4);
	setButtonOnClick("example5", ex5);
	setButtonOnClick("example6", ex6);
	setButtonOnClick("example7", ex7);
	setButtonOnClick("example8", ex8);
	setButtonOnClick("example9", ex9);
	setButtonOnClick("example10", ex10);
	setButtonOnClick("example11", ex11);
	setButtonOnClick("example12", ex12);
}

function ex12()
{
	canvasAnimator.drawRect(150, 150, 0, 0, true, [
		canvasAnimator.createRectAnimation.moveTo(0, 1000, 100, 100, 100, 100),
		canvasAnimator.createRectAnimation.moveTo(0, 1000, 50, 100, 150, 100),
		canvasAnimator.createRectAnimation.moveTo(0, 1000, 50, 100, 200, 100),
		canvasAnimator.createRectAnimation.moveTo(0, 1000, 50, 50, 200, 150),
		canvasAnimator.createRectAnimation.moveTo(0, 1000, 50, 50, 200, 200),
		canvasAnimator.createRectAnimation.moveTo(0, 1000, 150, 150, 0, 0),
	]);
}

function ex9()
{
	canvasAnimator.drawRect(50, 100, 200, 150, true, [
		canvasAnimator.createRectAnimation.growXY(0, 2000, true, true),
		canvasAnimator.createRectAnimation.foldX(0, 2000, true),
	]);
	canvasAnimator.drawRect(300, 100, 200, 150, true, [
		canvasAnimator.createRectAnimation.dash(0, 10, [10, 5]),
		canvasAnimator.createRectAnimation.growY(500, 2000, false),
		canvasAnimator.createRectAnimation.foldXY(500, 2000, true, false),
	]);
	canvasAnimator.drawRect(50, 300, 200, 150, true, [
		canvasAnimator.createRectAnimation.growX(1000, 2000, false),
		canvasAnimator.createRectAnimation.foldY(1000, 2000, true),
	], setStyle_rect1);
	canvasAnimator.drawRect(300, 300, 200, 150, true, [
		canvasAnimator.createRectAnimation.growXY(1500, 2000, false, false),
		canvasAnimator.createRectAnimation.foldXY(1500, 2000, false, false),
	], setStyle_rect2);
}
function setStyle_rect1(ctx: CanvasRenderingContext2D)
{
	ctx.fillStyle = "lightblue";
}
function setStyle_rect2(ctx: CanvasRenderingContext2D)
{
	ctx.strokeStyle = "darkblue";
}


function ex8()
{
	canvasAnimator.drawRect(50, 100, 200, 150, false, [
		canvasAnimator.createRectAnimation.growFullControls(0, 1000, true, false, true, true, true, false),
		canvasAnimator.createRectAnimation.growFullControls(0, 1000, true, true, false, true, true, true),
		canvasAnimator.createRectAnimation.growFullControls(0, 1000, true, true, true, true, false, false),
		canvasAnimator.createRectAnimation.growFullControls(0, 1000, true, false, false, true, false, true),
	]);
}

function ex0()
{
	canvasAnimator.drawCircle(100, 150, 50, true, false, [
		canvasAnimator.createCircleAnimation.grow(0, 1500, -90, true),
		canvasAnimator.createCircleAnimation.draw(0, 500),
		canvasAnimator.createCircleAnimation.moveTo(0, 300, 100, 150, 20),
		canvasAnimator.createCircleAnimation.draw(0, 500),
		canvasAnimator.createCircleAnimation.fold(0, 1500, -90),
	]);
}

function ex10()
{
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
function ex11()
{
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

function ex1()
{
	canvasAnimator.drawCircle(100, 100, 50, false, false, [
		canvasAnimator.createCircleAnimation.grow(0, 1500, -90, true),
		canvasAnimator.createCircleAnimation.draw(0, 500),
		canvasAnimator.createCircleAnimation.moveTo(0, 500, 100, 100, 70),
		canvasAnimator.createCircleAnimation.draw(0, 500),
		canvasAnimator.createCircleAnimation.fold(0, 1500, -90),
	]);
}

function ex2()
{

	canvasAnimator.drawText(100, 100, "Hellow world", false, [
		canvasAnimator.createTextAnimation.grow(0, 1000),
		canvasAnimator.createTextAnimation.draw(0, 500),
		canvasAnimator.createTextAnimation.moveTo(0, 500, 300, 200),
		canvasAnimator.createTextAnimation.draw(0, 500),
		canvasAnimator.createTextAnimation.fold(0, 1000),
	], setStyle_text);
}

function setStyle_text(ctx: CanvasRenderingContext2D)
{
	ctx.font = "30px Arial";
}

function ex3()
{

	canvasAnimator.drawCircle(100, 100, 50, false, false, [
		canvasAnimator.createCircleAnimation.dash(0, -8, [15, 10], 2000),
		canvasAnimator.createCircleAnimation.grow(0, 2000, -90, true),
		canvasAnimator.createCircleAnimation.draw(0, 500),
		canvasAnimator.createCircleAnimation.moveTo(0, 1000, 130, 150, 70),
		canvasAnimator.createCircleAnimation.draw(0, 500),
		canvasAnimator.createCircleAnimation.dash(2000, -16, [15, 10], 4000),
		canvasAnimator.createCircleAnimation.fold(0, 2000, -90),
	]);
}

function ex4()
{
	canvasAnimator.drawLine(0, 0, 500, 500, false, [
		canvasAnimator.createLineAnimation.grow(0, 500),
		canvasAnimator.createLineAnimation.moveTo(0, 1000, 200, 200, 700, 400),
		canvasAnimator.createLineAnimation.draw(0, 500),
		canvasAnimator.createLineAnimation.fold(0, 500),
	], setStyle);
	canvasAnimator.drawLine(50, 100, 300, 300, false, [
		canvasAnimator.createLineAnimation.dash(500, 20, [20, 40]),
		canvasAnimator.createLineAnimation.grow(0, 500),
		canvasAnimator.createLineAnimation.moveTo(0, 1000, 300, 50, 100, 300),
		canvasAnimator.createLineAnimation.draw(0, 500),
		canvasAnimator.createLineAnimation.fold(0, 500),
	], setStyle);
}

const styles = [setStyle, setStyle2, setStyle3];
function setStyle(ctx: CanvasRenderingContext2D)
{
	ctx.strokeStyle = "blue";
	ctx.lineWidth = 2;
	ctx.shadowBlur = 5;
	ctx.shadowColor = "black";
	ctx.shadowOffsetX = 5;
	ctx.shadowOffsetY = 5;
}
function setStyle2(ctx: CanvasRenderingContext2D)
{
	ctx.strokeStyle = "lightblue";
	ctx.lineWidth = 2;
	ctx.shadowBlur = 10;
	ctx.shadowColor = "black";
	ctx.shadowOffsetX = 10;
	ctx.shadowOffsetY = 10;
}
function setStyle3(ctx: CanvasRenderingContext2D)
{
	ctx.strokeStyle = "darkblue";
	ctx.lineWidth = 2;
	ctx.shadowBlur = 3;
	ctx.shadowColor = "black";
	ctx.shadowOffsetX = 3;
	ctx.shadowOffsetY = 3;
}

function ex5()
{
	for (let i = 0; i < 100; i++)
	{
		canvasAnimator.drawLine(rndInt(canvas.width), rndInt(canvas.height), rndInt(canvas.width), rndInt(canvas.height), true, [
			canvasAnimator.createLineAnimation.grow(0, rndInt(800) + 200),
			canvasAnimator.createLineAnimation.draw(0, rndInt(800) + 200),
			canvasAnimator.createLineAnimation.fold(0, rndInt(800) + 200),
		], styles[rndInt(styles.length)]);
	}
}

function ex6()
{
	for (let i = 0; i < 100; i++) {
		canvasAnimator.drawCircle(rndInt(canvas.width), rndInt(canvas.height), rndInt(100) + 10, false, true, [
			canvasAnimator.createCircleAnimation.grow(0, rndInt(800) + 200, -90, true),
			canvasAnimator.createCircleAnimation.draw(0, rndInt(800) + 200),
			canvasAnimator.createCircleAnimation.fold(0, rndInt(800) + 200, -90),
		], styles[rndInt(styles.length)]);
	}
}

function ex7()
{
	for (let i = 0; i < 100; i++) {
		canvasAnimator.drawCircle(rndInt(canvas.width), rndInt(canvas.height), rndInt(100) + 10, false, true, [
			canvasAnimator.createCircleAnimation.grow(0, rndInt(800) + 200, -90, true),
			canvasAnimator.createCircleAnimation.moveTo(0, rndInt(1600) + 400, rndInt(canvas.width), rndInt(canvas.height), rndInt(100) + 10),
			canvasAnimator.createCircleAnimation.fold(0, rndInt(800) + 200, -90),
		], styles[rndInt(styles.length)]);
	}
}


function setButtonOnClick(id: string, f: () => void)
{
	const el = <unknown | null>document.getElementById(id);
	if (el == null) throw new Error(`${id} not found`);
	if (!(el instanceof HTMLButtonElement)) throw new Error(`${id} element not Button`);
	el.addEventListener("click", f);
}
function rndInt(bound: number)
{
	return Math.floor(Math.random() * bound);
}