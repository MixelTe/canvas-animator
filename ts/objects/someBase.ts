export abstract class CanvasAnimator_Animator
{
	public abstract animate(ctx: CanvasRenderingContext2D, startTime: number, time: number, interFrame: number): boolean;
}


export function logStart(name: string, elStartTime: number, time: number, startTime: number)
{
	console.group("%cstarted%c: " + name, "color: green", "", "color: gold");
	console.log("el.startTime: " + elStartTime);
	console.log(`current time: ${time - startTime}`);
	console.groupEnd();
}
export function logEnd(name: string, time: number, startTime: number)
{
	console.group("%cended%c: " + name, "color: red", "", "color: gold");
	console.log(`current time: ${time - startTime}`);
	console.groupEnd();
}