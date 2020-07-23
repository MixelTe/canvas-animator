import { CanvasAnimator_LineAnimator, CanvasAnimator_LineAnimationData, CanvasAnimator_LineAnimationData_Grow, CanvasAnimator_LineAnimationData_Dash, CanvasAnimator_LineAnimationData_Draw, CanvasAnimator_LineAnimationData_MoveTo, CanvasAnimator_LineAnimationData_Fold } from "./objects/lineAnimations.js";
import { CanvasAnimator_CircleAnimationData_Draw, CanvasAnimator_CircleAnimationData_Grow, CanvasAnimator_CircleAnimationData_Fold, CanvasAnimator_CircleAnimationData_Dash, CanvasAnimator_CircleAnimationData_MoveTo, CanvasAnimator_CircleAnimationData, CanvasAnimator_CircleAnimator } from "./objects/circleAnimations.js";
import { CanvasAnimator_Animator } from "./objects/someBase.js";
import { CanvasAnimator_TextAnimationData_Draw, CanvasAnimator_TextAnimator, CanvasAnimator_TextAnimationData, CanvasAnimator_TextAnimationData_Grow, CanvasAnimator_TextAnimationData_Fold, CanvasAnimator_TextAnimationData_MoveTo } from "./objects/textAnimations.js";
import { CanvasAnimator_RectAnimationData_Draw, CanvasAnimator_RectAnimationData, CanvasAnimator_RectAnimator, CanvasAnimator_RectAnimationData_Grow } from "./objects/rectAnimations.js";

export class CanvasAnimator
{
	private ctx: CanvasRenderingContext2D;
	private x = 0;
	private y = 0;
	private width: number;
	private height: number;
	private animators: CanvasAnimator_Animator[] = [];
	private pastTime = 0;
	private startTime = 0;
	private backgroundColor = "white";
	public createLineAnimation = {
		draw: this.createLineAnimationDraw,
		grow: this.createLineAnimationGrow,
		fold: this.createLineAnimationFold,
		dash: this.createLineAnimationDash,
		moveTo: this.createLineAnimationMoveTo,
	};
	public createCircleAnimation = {
		draw: this.createCircleAnimationDraw,
		grow: this.createCircleAnimationGrow,
		fold: this.createCircleAnimationFold,
		dash: this.createCircleAnimationDash,
		moveTo: this.createCircleAnimationMoveTo,
	};
	public createTextAnimation = {
		draw: this.createTextAnimationDraw,
		grow: this.createTextAnimationGrow,
		fold: this.createTextAnimationFold,
		moveTo: this.createTextAnimationMoveTo,
	};
	public createRectAnimation = {
		draw: this.createRectAnimationDraw,
		growFullControls: this.createRectAnimationGrowFull,
		growX: this.createRectAnimationGrowX,
		growY: this.createRectAnimationGrowY,
		growXY: this.createRectAnimationGrowXY,
		foldX: this.createRectAnimationFoldX,
		foldY: this.createRectAnimationFoldY,
		foldXY: this.createRectAnimationFoldXY,
		// moveTo: this.createRectAnimationMoveTo,
	};

	constructor(ctx: CanvasRenderingContext2D, drawZoneWidth: number, drawZoneHeight: number)
	{
		this.ctx = ctx;
		this.width = drawZoneWidth;
		this.height = drawZoneHeight;
		this.redrawAll(0);
	}

	private redrawAll(time: number)
	{
		if (this.pastTime == 0)
		{
			this.pastTime = time;
			this.startTime = time;
		};
		const interFrame = time - this.pastTime;
		this.pastTime = time;
		this.ctx.save();
		this.ctx.fillStyle = this.backgroundColor;
		this.ctx.fillRect(this.x, this.y, this.width, this.height);
		this.ctx.restore();
		for (let i = this.animators.length - 1; i >= 0; i--) {
			const el = this.animators[i];
			if (el.animate(this.ctx, this.startTime, time, interFrame))
			{
				this.animators.splice(i, 1);
			};
		}

		requestAnimationFrame(this.redrawAll.bind(this));
	}

	public drawLine(sx: number, sy: number, ex: number, ey: number, animation?: CanvasAnimator_LineAnimationData[], styles?: SetStyleFunction)
	{
		if (animation == undefined || animation.length == 0) animation = [new CanvasAnimator_LineAnimationData_Draw(0)];
		if (styles == undefined) styles = () => {};
		this.animators.push(new CanvasAnimator_LineAnimator(sx, sy, ex, ey, styles, animation));
	}
	public drawCircle(x: number, y: number, r: number, fill: boolean, animation?: CanvasAnimator_CircleAnimationData[], styles?: SetStyleFunction)
	{
		if (animation == undefined || animation.length == 0) animation = [new CanvasAnimator_CircleAnimationData_Draw(0)];
		if (styles == undefined) styles = () => {};
		this.animators.push(new CanvasAnimator_CircleAnimator(x, y, r, fill, styles, animation));
	}
	public drawText(x: number, y: number, text: string, animation?: CanvasAnimator_TextAnimationData[], styles?: SetStyleFunction)
	{
		if (animation == undefined || animation.length == 0) animation = [new CanvasAnimator_TextAnimationData_Draw(0)];
		if (styles == undefined) styles = () => {};
		this.animators.push(new CanvasAnimator_TextAnimator(x, y, text, styles, animation));
	}
	public drawRect(x: number, y: number, width: number, height: number, animation?: CanvasAnimator_RectAnimationData[], styles?: SetStyleFunction)
	{
		if (animation == undefined || animation.length == 0) animation = [new CanvasAnimator_RectAnimationData_Draw(0)];
		if (styles == undefined) styles = () => {};
		this.animators.push(new CanvasAnimator_RectAnimator(x, y, width, height, styles, animation));
	}

	public setBackgroundColor(color: string)
	{
		this.backgroundColor = color;
	}

	private createLineAnimationDraw(startTime: number, duraction?: number)
	{
		return new CanvasAnimator_LineAnimationData_Draw(startTime, duraction);
	}
	private createLineAnimationGrow(startTime: number, duraction: number)
	{
		return new CanvasAnimator_LineAnimationData_Grow(startTime, duraction);
	}
	private createLineAnimationFold(startTime: number, duraction: number)
	{
		return new CanvasAnimator_LineAnimationData_Fold(startTime, duraction);
	}
	private createLineAnimationDash(startTime: number, dashSpeed: number, dashArray: number[], duration?: number)
	{
		return new CanvasAnimator_LineAnimationData_Dash(startTime, dashSpeed, dashArray, duration);
	}
	private createLineAnimationMoveTo(startTime: number, duraction: number, sx: number, sy: number, ex: number, ey: number)
	{
		return new CanvasAnimator_LineAnimationData_MoveTo(startTime, duraction, sx, sy, ex, ey);
	}


	private createCircleAnimationDraw(startTime: number, duraction?: number)
	{
		return new CanvasAnimator_CircleAnimationData_Draw(startTime, duraction);
	}
	private createCircleAnimationGrow(startTime: number, duraction: number, startAngle: number, reverse?: boolean)
	{
		return new CanvasAnimator_CircleAnimationData_Grow(startTime, duraction, startAngle, reverse);
	}
	private createCircleAnimationFold(startTime: number, duraction: number, startAngle: number, reverse?: boolean)
	{
		return new CanvasAnimator_CircleAnimationData_Fold(startTime, duraction, startAngle, reverse);
	}
	private createCircleAnimationDash(startTime: number, dashSpeed: number, dashArray: number[], duration?: number)
	{
		return new CanvasAnimator_CircleAnimationData_Dash(startTime, dashSpeed, dashArray, duration);
	}
	private createCircleAnimationMoveTo(startTime: number, duraction: number, x: number, y: number, r: number)
	{
		return new CanvasAnimator_CircleAnimationData_MoveTo(startTime, duraction, x, y, r);
	}


	private createTextAnimationDraw(startTime: number, duraction?: number)
	{
		return new CanvasAnimator_TextAnimationData_Draw(startTime, duraction);
	}
	private createTextAnimationGrow(startTime: number, duraction: number) {
		return new CanvasAnimator_TextAnimationData_Grow(startTime, duraction);
	}
	private createTextAnimationFold(startTime: number, duraction: number) {
		return new CanvasAnimator_TextAnimationData_Fold(startTime, duraction);
	}
	private createTextAnimationMoveTo(startTime: number, duraction: number, x: number, y: number) {
		return new CanvasAnimator_TextAnimationData_MoveTo(startTime, duraction, x, y);
	}

	private createRectAnimationDraw(startTime: number, duraction?: number)
	{
		return new CanvasAnimator_RectAnimationData_Draw(startTime, duraction);
	}
	private createRectAnimationGrowFull(startTime: number, duraction: number, xAxis: boolean, toRight: boolean, reversX: boolean, yAxis: boolean, toTop: boolean, reversY: boolean)
	{
		return new CanvasAnimator_RectAnimationData_Grow(startTime, duraction, xAxis, toRight, reversX, yAxis, toTop, reversY);
	}
	private createRectAnimationGrowX(startTime: number, duraction: number, toRight: boolean)
	{
		return new CanvasAnimator_RectAnimationData_Grow(startTime, duraction, true, toRight, false, false, false, false);
	}
	private createRectAnimationGrowY(startTime: number, duraction: number, toTop: boolean)
	{
		return new CanvasAnimator_RectAnimationData_Grow(startTime, duraction, false, false, false, true, toTop, false);
	}
	private createRectAnimationGrowXY(startTime: number, duraction: number, toRight: boolean, toTop: boolean)
	{
		return new CanvasAnimator_RectAnimationData_Grow(startTime, duraction, true, toRight, false, true, toTop, false);
	}
	private createRectAnimationFoldX(startTime: number, duraction: number, toRight: boolean)
	{
		return new CanvasAnimator_RectAnimationData_Grow(startTime, duraction, true, toRight, true, false, false, false);
	}
	private createRectAnimationFoldY(startTime: number, duraction: number, toTop: boolean)
	{
		return new CanvasAnimator_RectAnimationData_Grow(startTime, duraction, false, false, false, true, toTop, true);
	}
	private createRectAnimationFoldXY(startTime: number, duraction: number, toRight: boolean, toTop: boolean)
	{
		return new CanvasAnimator_RectAnimationData_Grow(startTime, duraction, true, toRight, true, true, toTop, true);
	}
}
export type SetStyleFunction = (ctx: CanvasRenderingContext2D) => void;