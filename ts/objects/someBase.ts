export abstract class CanvasAnimator_Animator
{
	protected startTime: number
	protected calculateTimeFromElementCreating: boolean //cuculate time from element creating
	constructor(startTime: number, cuculateTimeFromElementCreating: boolean)
	{
		this.startTime = startTime;
		this.calculateTimeFromElementCreating = cuculateTimeFromElementCreating;
	}
	public abstract animate(ctx: CanvasRenderingContext2D, startTime: number, time: number, interFrame: number): boolean;
}


export function logStart(name: string, elStartTime: number, time: number, startTime: number, elStartTimeReal?: number)
{
	// console.group("%cstarted%c: " + name, "color: green", "", "color: gold");
	console.groupCollapsed("%cstarted%c: " + name, "color: green", "", "color: gold");
	if (elStartTimeReal == undefined) console.log("el.startTime: " + elStartTime);
	else
	{
		console.log("el.startTime: " + elStartTime);
		console.log("el.startTime real: " + elStartTimeReal);
	}
	console.log(`current time: ${time - startTime}`);
	console.groupEnd();
}
export function logEnd(name: string, time: number, startTime: number)
{
	// console.group("%cended%c: " + name, "color: red", "", "color: gold");
	console.groupCollapsed("%cended%c: " + name, "color: red", "", "color: gold");
	console.log(`current time: ${time - startTime}`);
	console.groupEnd();
}