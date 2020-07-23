import { SetStyleFunction } from "../canvasAnimator.js";
import { CanvasAnimator_Animator, logEnd, logStart } from "./someBase.js";

export class CanvasAnimator_RectAnimator extends CanvasAnimator_Animator
{
	private x: number;
	private y: number;
	private width: number;
	private height: number;
	private setStyle: SetStyleFunction;
	private animations: CanvasAnimator_RectAnimationData[];
	private curAnimation: CanvasAnimator_RectAnimation | undefined;
	private dashAnimations: CanvasAnimator_RectAnimationData_Dash[] = [];
	private dashAnimation: CanvasAnimator_RectAnimation_Dash | undefined;
	constructor(startTime: number, calcTimeFrElCr: boolean, x: number, y: number, width: number, height: number, setStyle: SetStyleFunction, animations: CanvasAnimator_RectAnimationData[])
	{
		super(startTime, calcTimeFrElCr);
		this.animations = animations;
		this.setStyle = setStyle;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

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
				let elTime = el.startTime;
				if (this.calculateTimeFromElementCreating) elTime += this.startTime;
				if (elTime <= time - startTime)
				{
					const animation = el.createAnimation(this.x, this.y, this.width, this.height);
					this.dashAnimation = animation;
					this.dashAnimation.redraw(ctx, interFrame);
					this.dashAnimations.splice(i, 1);
					if (this.calculateTimeFromElementCreating) logStart(this.dashAnimation.name, el.startTime, time, startTime, elTime);
					else logStart(this.dashAnimation.name, elTime, time, startTime);
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
				let elTime = el.startTime;
				if (this.calculateTimeFromElementCreating) elTime += this.startTime;
				if (elTime <= time - startTime)
				{
					const animation = el.createAnimation(this.x, this.y, this.width, this.height);
					this.curAnimation = animation;
					this.animations.splice(i, 1);
					this.curAnimation.redraw(ctx, interFrame);
					if (this.calculateTimeFromElementCreating) logStart(this.curAnimation.name, el.startTime, time, startTime, elTime);
					else logStart(this.curAnimation.name, elTime, time, startTime);
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
			if (result.x != undefined) this.x = result.x;
			if (result.y != undefined) this.y = result.y;
			if (result.width != undefined) this.width = result.width;
			if (result.height != undefined) this.height = result.height;
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
		let nameSuffixX = "";
		let nameSuffixY = "";
		if (xAxis)
		{
			nameSuffixX += " (xAxis";
			if (toRight)
			{
				nameSuffixX += " toRight";
				this.cwidth = 0;
			}
			else if (!this.reversX)
			{
				this.cx = x + width;
				this.cwidth = 0;
			}
			if (reversX) nameSuffixX += " reversX";
		}
		if (yAxis)
		{
			nameSuffixY += " (yAxis";
			if (toTop)
			{
				nameSuffixY += " toTop";
				this.cheight = 0;
			}
			else if (!this.reversY)
			{
				this.cy = y + height;
				this.cheight = 0;
			}
			if (reversY) nameSuffixY += " reversX";
		}
		if (nameSuffixX != "") this.name += nameSuffixX + ")";
		if (nameSuffixY != "") this.name += nameSuffixY + ")";
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
	protected x2: number;
	protected y2: number;
	protected width2: number;
	protected height2: number;
	protected xCur: number;
	protected yCur: number;
	protected widthCur: number;
	protected heightCur: number;
	private stepX: number;
	private stepY: number;
	private stepWidth: number;
	private stepHeight: number;
	constructor(time: number, x: number, y: number, width: number, height: number, x2: number, y2: number, width2: number, height2: number)
	{
		super(x, y, width, height);
		this.name += "Move";
		this.x2 = x2;
		this.y2 = y2;
		this.width2 = width2;
		this.height2 = height2;
		this.xCur = x;
		this.yCur = y;
		this.widthCur = width;
		this.heightCur = height;

		this.stepX = (x2 - x) / time;
		this.stepWidth = (width2 - width) / time;
		this.stepY = (y2 - y) / time;
		this.stepHeight = (height2 - height) / time;
	}
	public redraw(ctx: CanvasRenderingContext2D, time: number)
	{
		ctx.fillRect(this.xCur, this.yCur, this.widthCur, this.heightCur);
		ctx.strokeRect(this.xCur, this.yCur, this.widthCur, this.heightCur);

		if (!this.complited)
		{
			this.xCur += this.stepX * time;
			this.yCur += this.stepY * time;
			this.widthCur += this.stepWidth * time;
			this.heightCur += this.stepHeight * time;

			this.xCur = this.normalizeCoordinates(this.x, this.xCur, this.x2);
			this.yCur = this.normalizeCoordinates(this.y, this.yCur, this.y2);
			this.widthCur = this.normalizeCoordinates(this.width, this.widthCur, this.width2);
			this.heightCur = this.normalizeCoordinates(this.height, this.heightCur, this.height2);

			if (this.xCur == this.x2 && this.yCur == this.y2 &&
				this.widthCur == this.width2 && this.heightCur == this.height2)
			{
				this.complited = true;
			}
		}
		return { complited: this.complited, x: this.xCur, y: this.yCur, width: this.widthCur, height: this.heightCur };
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
	public x: number;
	public y: number;
	public width: number;
	public height: number;
	constructor(startTime: number, time: number, x: number, y: number, width: number, height: number)
	{
		super(startTime);
		this.time = time;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	public createAnimation(x: number, y: number, width: number, height: number)
	{
		return new CanvasAnimator_RectAnimation_Move(this.time, x, y, width, height, this.x, this.y, this.width, this.height);
	}
}