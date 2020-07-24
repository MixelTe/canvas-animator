import { CanvasAnimator } from "./canvasAnimator.js";
import { setListeners } from "./exampleButtons.js";

export const canvas = getCanvas("canvas");
setCanvasWidth();
const ctx = getCanvasContext(canvas);
export const canvasAnimator = new CanvasAnimator(ctx, canvas.width, canvas.height);
setListeners();


canvasAnimator.setBackgroundColor("lightgreen");


function getDiv(id: string)
{
	const el = <unknown | null>document.getElementById(id);
	if (el == null) throw new Error(`${id} not found`);
	if (el instanceof HTMLDivElement) return el;
	throw new Error(`${id} element not Div`);
}
function getCanvas(id: string)
{
	const el = <unknown | null>document.getElementById(id);
	if (el == null) throw new Error(`${id} not found`);
	if (el instanceof HTMLCanvasElement) return el;
	throw new Error(`${id} element not Canvas`);
}
function getCanvasContext(canvas: HTMLCanvasElement)
{
	const ctx = canvas.getContext("2d");
	if (ctx == null) throw new Error(`Context not found`);
	return ctx;
}
function setCanvasWidth()
{
	const w = getDiv("canvasDiv").getBoundingClientRect().width
	canvas.style.width = `${w}`;
	canvas.width = w;
}
