import { SetStyleFunction } from "../canvasAnimator.js";
import { CanvasAnimator_Animator, logEnd, logStart } from "./someBase.js";

export class CanvasAnimator_RectAnimator extends CanvasAnimator_Animator
{
	private sx: number;
	private sy: number;
	private ex: number;
	private ey: number;
	private setStyle: SetStyleFunction;
	private animations: CanvasAnimator_RectAnimationData[];
	private curAnimation: CanvasAnimator_RectAnimation | undefined;
	private dashAnimations: CanvasAnimator_RectAnimationData_Dash[] = [];
	private dashAnimation: CanvasAnimator_RectAnimation_Dash | undefined;
	constructor(sx: number, sy: number, ex: number, ey: number, setStyle: SetStyleFunction, animations: CanvasAnimator_RectAnimationData[])
	{
		super();
		this.animations = animations;
		this.setStyle = setStyle;
		this.sx = sx;
		this.sy = sy;
		this.ex = ex;
		this.ey = ey;

		for (let i = this.animations.length - 1; i >= 0; i--)
		{
			const el = this.animations[i];
			if (el instanceof CanvasAnimator_RectAnimationData_Dash)
			{
				this.dashAnimations.push(el);
				this.animations.splice(i, 1);
			}
		}
	}

	public animate(ctx: CanvasRenderingContext2D, startTime: number, time: number, interFrame: number)
	{
		ctx.save();
		ctx.fillStyle = "transparent";
		this.setStyle(ctx);
		if (this.dashAnimation == undefined)
		{
			for (let i = 0; i < this.dashAnimations.length; i++)
			{
				const el = this.dashAnimations[i];
				if (el.startTime <= time - startTime)
				{
					const animation = el.createAnimation(this.sx, this.sy, this.ex, this.ey);
					this.dashAnimation = animation;
					this.dashAnimation.redraw(ctx, interFrame);
					this.dashAnimations.splice(i, 1);
					logStart(this.dashAnimation.name, el.startTime, time, startTime);
					break;
				};
			}
		}
		else
		{
			const dashResult = this.dashAnimation.redraw(ctx, interFrame);
			if (dashResult.complited)
			{
				logEnd(this.dashAnimation.name, time, startTime);
				this.dashAnimation = undefined;
			}
		}

		if (this.curAnimation == undefined)
		{
			for (let i = 0; i < this.animations.length; i++) {
				const el = this.animations[i];
				if (el.startTime <= time - startTime)
				{
					const animation = el.createAnimation(this.sx, this.sy, this.ex, this.ey);
					this.curAnimation = animation;
					this.animations.splice(i, 1);
					this.curAnimation.redraw(ctx, interFrame);
					logStart(this.curAnimation.name, el.startTime, time, startTime);
					break;
				};
			}
		}
		else
		{
			const result = this.curAnimation.redraw(ctx, interFrame)
			if (result.complited)
			{
				logEnd(this.curAnimation.name, time, startTime);
				this.curAnimation = undefined;
			}
			if (result.x != undefined) this.sx = result.x;
			if (result.y != undefined) this.sy = result.y;
			if (result.width != undefined) this.ex = result.width;
			if (result.height != undefined) this.ey = result.height;
		}
		ctx.restore();

		if (this.animations.length == 0 && this.curAnimation == undefined) return true
		return false;
	}
}



abstract class CanvasAnimator_RectAnimation
{
	public name = "Rect animation: %c";
	protected x: number;
	protected y: number;
	protected width: number;
	protected height: number;
	public startTime = 0;
	constructor(x: number, y: number, width: number, height: number)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	public abstract redraw(ctx: CanvasRenderingContext2D, time: number): { complited: boolean, x?: number, y?: number, width?: number, height?: number };
	protected normalizeCoordinates(start: number, current: number, end: number)
	{
		if (start < end) return Math.min(current, end);
		else return Math.max(current, end);
	}
}
class CanvasAnimator_RectAnimation_Draw extends CanvasAnimator_RectAnimation
{
	private duraction: number;
	private duractionCur = 0;
	private complited = false;
	constructor(x: number, y: number, width: number, height: number, duraction?: number)
	{
		super(x, y, width, height);
		this.name += "Draw";
		this.duraction = duraction || -1;
	}
	public redraw(ctx: CanvasRenderingContext2D, time: number)
	{
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.strokeRect(this.x, this.y, this.width, this.height);

		if (!this.complited && this.duraction > 0)
		{
			this.duractionCur += time;
			if (this.duractionCur > this.duraction) this.complited = true;
		}
		return { complited: this.complited };
	}
}
class CanvasAnimator_RectAnimation_Grow extends CanvasAnimator_RectAnimation
{
	private cx: number;
	private cy: number;
	private cwidth: number;
	private cheight: number;
	private stepX: number;
	private stepY: number;
	private xAxis: boolean;
	private toRight: boolean;
	private reversX: boolean;
	private yAxis: boolean;
	private toTop: boolean;
	private reversY: boolean;
	private complited = false;
	constructor(time: number, x: number, y: number, width: number, height: number, xAxis: boolean, toRight: boolean, reversX: boolean, yAxis: boolean, toTop: boolean, reversY: boolean)
	{
		super(x, y, width, height);
		this.name += "Grow";
		if (time < 0) time = 0;
		this.xAxis = xAxis;
		this.toRight = toRight;
		this.reversX = reversX;
		this.yAxis = yAxis;
		this.toTop = toTop;
		this.reversY = reversY;
		this.cx = x;
		this.cy = y;
		this.cwidth = width;
		this.cheight = height;
		this.stepX = this.width / time;
		this.stepY = this.height / time;
		if (xAxis)
		{
			if (toRight)
			{
				this.cwidth = 0;
			}
			else if (!this.reversX)
			{
				this.cx = x + width;
				this.cwidth = 0;
			}
		}
		if (yAxis)
		{
			if (toTop)
			{
				this.cheight = 0;
			}
			else if (!this.reversY)
			{
				this.cy = y + height;
				this.cheight = 0;
			}
		}
	}
	public redraw(ctx: CanvasRenderingContext2D, time: number)
	{
		ctx.fillRect(this.cx, this.cy, this.cwidth, this.cheight);
		ctx.strokeRect(this.cx, this.cy, this.cwidth, this.cheight);

		let complitedX = false;
		let complitedY = false;
		if (!this.complited)
		{
			if (this.xAxis)
			{
				if (this.toRight)
				{
					if (this.reversX)
					{
						this.cx += this.stepX * time;
						this.cx = this.normalizeCoordinates(this.x, this.cx, this.x + this.width);
						this.cwidth = this.width - (this.cx - this.x);
						if (this.cwidth == 0) complitedX = true;
						// console.log("xAxis, toRight, reversX");
					}
					else
					{
						this.cwidth += this.stepX * time;
						this.cwidth = this.normalizeCoordinates(0, this.cwidth, this.width);
						if (this.cwidth == this.width) complitedX = true;
						// console.log("xAxis, toRight");
					}
				}
				else
				{
					if (this.reversX)
					{
						this.cwidth -= this.stepX * time;
						this.cwidth = this.normalizeCoordinates(this.width, this.cwidth, 0);
						if (this.cwidth == 0) complitedX = true;
						// console.log("xAxis, reversX");
					}
					else
					{
						this.cx -= this.stepX * time;
						this.cx = this.normalizeCoordinates(this.x + this.width, this.cx, this.x);
						this.cwidth = this.width - (this.cx - this.x);
						if (this.cx == this.x) complitedX = true;
						// console.log("xAxis");
					}
				}
			}
			else
			{
				complitedX = true;
			}
			if (this.yAxis)
			{
				if (this.toTop)
				{
					if (this.reversY)
					{
						this.cy += this.stepY * time;
						this.cy = this.normalizeCoordinates(this.y, this.cy, this.y + this.height);
						this.cheight = this.height - (this.cy - this.y);
						if (this.cheight == 0) complitedY = true;
						// console.log("yAxis, toTop, reversY");
					}
					else
					{
						this.cheight += this.stepY * time;
						this.cheight = this.normalizeCoordinates(0, this.cheight, this.height);
						if (this.cheight == this.height) complitedY = true;
						// console.log("yAxis, toTop");
					}
				}
				else
				{
					if (this.reversY)
					{
						this.cheight -= this.stepY * time;
						this.cheight = this.normalizeCoordinates(this.height, this.cheight, 0);
						if (this.cheight == 0) complitedY = true;
						// console.log("yAxis, reversY");
					}
					else
					{
						this.cy -= this.stepY * time;
						this.cy = this.normalizeCoordinates(this.y + this.height, this.cy, this.y);
						this.cheight = this.height - (this.cy - this.y);
						if (this.cy == this.y) complitedY = true;
						// console.log("yAxis");
					}
				}
			}
			else
			{
				complitedY = true;
			}
		}

		this.complited = complitedX == true && complitedY == true;

		return { complited: this.complited };
	}
}
class CanvasAnimator_RectAnimation_Dash extends CanvasAnimator_RectAnimation
{
	private dashOffset = 0;
	private step: number;
	private loopLenght: number;
	private dashArray: number[];
	private complited = false;
	private curDuration = 0;
	private duration: number;
	constructor(sx: number, sy: number, ex: number, ey: number, dashSpeed: number, dashArray: number[], duration?: number)
	{
		super(sx, sy, ex, ey);
		this.name += "Dash";
		this.dashArray = dashArray;
		this.duration = duration || -1;

		this.loopLenght = 0;
		dashArray.forEach(el => { this.loopLenght += el });
		this.step = dashSpeed / 100;
	}
	public redraw(ctx: CanvasRenderingContext2D, time: number)
	{
		if (!this.complited)
		{
			this.dashOffset -= this.step * time;
			this.dashOffset %= this.loopLenght;
			if (this.duration > 0)
			{
				this.curDuration += time;
				if (this.curDuration > this.duration) this.complited = true;
			}
		}

		ctx.setLineDash(this.dashArray);
		ctx.lineDashOffset = this.dashOffset;

		return { complited: this.complited };
	}
}
class CanvasAnimator_RectAnimation_Move extends CanvasAnimator_RectAnimation
{
	private complited = false;
	protected sx2: number;
	protected sy2: number;
	protected ex2: number;
	protected ey2: number;
	protected sxCur: number;
	protected syCur: number;
	protected exCur: number;
	protected eyCur: number;
	private stepX1: number;
	private stepX2: number;
	private stepY1: number;
	private stepY2: number;
	constructor(time: number, sx: number, sy: number, ex: number, ey: number, sx2: number, sy2: number, ex2: number, ey2: number)
	{
		super(sx, sy, ex, ey);
		this.name += "Move";
		this.sx2 = sx2;
		this.sy2 = sy2;
		this.ex2 = ex2;
		this.ey2 = ey2;
		this.sxCur = sx;
		this.syCur = sy;
		this.exCur = ex;
		this.eyCur = ey;

		this.stepX1 = (sx2 - sx) / time;
		this.stepX2 = (ex2 - ex) / time;
		this.stepY1 = (sy2 - sy) / time;
		this.stepY2 = (ey2 - ey) / time;
	}
	public redraw(ctx: CanvasRenderingContext2D, time: number)
	{
		ctx.beginPath();
		ctx.moveTo(this.sxCur, this.syCur);
		ctx.lineTo(this.exCur, this.eyCur);
		ctx.stroke();

		if (!this.complited)
		{
			this.sxCur += this.stepX1 * time;
			this.syCur += this.stepY1 * time;
			this.exCur += this.stepX2 * time;
			this.eyCur += this.stepY2 * time;

			this.sxCur = this.normalizeCoordinates(this.x, this.sxCur, this.sx2);
			this.syCur = this.normalizeCoordinates(this.y, this.syCur, this.sy2);
			this.exCur = this.normalizeCoordinates(this.width, this.exCur, this.ex2);
			this.eyCur = this.normalizeCoordinates(this.height, this.eyCur, this.ey2);

			if (this.sxCur == this.sx2 && this.syCur == this.sy2 &&
				this.exCur == this.ex2 && this.eyCur == this.ey2)
			{
				this.complited = true;
			}
		}
		return { complited: this.complited, sx: this.sxCur, sy: this.syCur, ex: this.exCur, ey: this.eyCur };
	}
}



export abstract class CanvasAnimator_RectAnimationData
{
	public startTime: number;
	constructor(startTime: number)
	{
		this.startTime = startTime;
	}
	public abstract createAnimation(x: number, y: number, width: number, height: number): CanvasAnimator_RectAnimation
}
export class CanvasAnimator_RectAnimationData_Draw extends CanvasAnimator_RectAnimationData
{
	private duraction: number;
	constructor(startTime: number, duraction?: number)
	{
		super(startTime);
		this.duraction = duraction || -1;
	}
	public createAnimation(x: number, y: number, width: number, height: number)
	{
		return new CanvasAnimator_RectAnimation_Draw(x, y, width, height, this.duraction);
	}
}
export class CanvasAnimator_RectAnimationData_Grow extends CanvasAnimator_RectAnimationData
{
	public time: number;
	private xAxis: boolean;
	private toRight: boolean;
	private reversX: boolean;
	private yAxis: boolean;
	private toTop: boolean;
	private reversY: boolean;
	constructor(startTime: number, time: number, xAxis: boolean, toRight: boolean, reversX: boolean, yAxis: boolean, toTop: boolean, reversY: boolean)
	{
		super(startTime);
		this.time = time;
		this.xAxis = xAxis;
		this.toRight = toRight;
		this.reversX = reversX;
		this.yAxis = yAxis;
		this.toTop = toTop;
		this.reversY = reversY;
	}
	public createAnimation(sx: number, sy: number, ex: number, ey: number)
	{
		return new CanvasAnimator_RectAnimation_Grow(this.time, sx, sy, ex, ey, this.xAxis, this.toRight, this.reversX, this.yAxis, this.toTop, this.reversY);
	}
}
export class CanvasAnimator_RectAnimationData_Dash extends CanvasAnimator_RectAnimationData
{
	public dashSpeed: number;
	public duration: number | undefined;
	public dashArray: number[];
	constructor(startTime: number, dashSpeed: number, dashArray: number[], duration?: number)
	{
		super(startTime);
		this.dashSpeed = dashSpeed;
		this.dashArray = dashArray;
		this.duration = duration;
	}
	public createAnimation(sx: number, sy: number, ex: number, ey: number)
	{
		return new CanvasAnimator_RectAnimation_Dash(sx, sy, ex, ey, this.dashSpeed, this.dashArray, this.duration);
	}
}
export class CanvasAnimator_RectAnimationData_MoveTo extends CanvasAnimator_RectAnimationData
{
	public time: number;
	public sx: number;
	public sy: number;
	public ex: number;
	public ey: number;
	constructor(startTime: number, time: number, sx: number, sy: number, ex: number, ey: number)
	{
		super(startTime);
		this.time = time;
		this.sx = sx;
		this.sy = sy;
		this.ex = ex;
		this.ey = ey;
	}
	public createAnimation(sx: number, sy: number, ex: number, ey: number)
	{
		return new CanvasAnimator_RectAnimation_Move(this.time, sx, sy, ex, ey, this.sx, this.sy, this.ex, this.ey);
	}
}