import { SetStyleFunction } from "../canvasAnimator.js";
import { CanvasAnimator_Animator, logEnd, logStart } from "./someBase.js";

export class CanvasAnimator_CircleAnimator extends CanvasAnimator_Animator
{
	private x: number;
	private y: number;
	private r: number;
	private fill: boolean;
	private setStyle: SetStyleFunction;
	private animations: CanvasAnimator_CircleAnimationData[];
	private curAnimation: CanvasAnimator_CircleAnimation | undefined;
	private dashAnimations: CanvasAnimator_CircleAnimationData_Dash[] = [];
	private dashAnimation: CanvasAnimator_CircleAnimation_Dash | undefined;
	constructor(x: number, y: number, r: number, fill: boolean, setStyle: SetStyleFunction, animations: CanvasAnimator_CircleAnimationData[])
	{
		super();
		this.animations = animations;
		this.setStyle = setStyle;
		this.x = x;
		this.y = y;
		this.r = r;
		this.fill = fill;

		for (let i = this.animations.length - 1; i >= 0; i--)
		{
			const el = this.animations[i];
			if (el instanceof CanvasAnimator_CircleAnimationData_Dash)
			{
				this.dashAnimations.push(el);
				this.animations.splice(i, 1);
			}
		}
	}

	public animate(ctx: CanvasRenderingContext2D, startTime: number, time: number, interFrame: number)
	{
		ctx.save();
		this.setStyle(ctx);
		if (this.dashAnimation == undefined)
		{
			for (let i = 0; i < this.dashAnimations.length; i++)
			{
				const el = this.dashAnimations[i];
				if (el.startTime <= time - startTime)
				{
					const animation = el.createAnimation(this.x, this.y, this.r, this.fill);
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
					const animation = el.createAnimation(this.x, this.y, this.r, this.fill);
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
			if (result.x != undefined) this.x = result.x;
			if (result.y != undefined) this.y = result.y;
			if (result.r != undefined) this.r = result.r;
		}
		ctx.restore();

		if (this.animations.length == 0 && this.curAnimation == undefined) return true
		return false;
	}
}



abstract class CanvasAnimator_CircleAnimation
{
	public name = "Circle animation: %c";
	protected fill: boolean;
	protected x: number;
	protected y: number;
	protected r: number;
	public startTime = 0;
	constructor(x: number, y: number, r: number, fill: boolean)
	{
		this.x = x;
		this.y = y;
		this.r = r;
		this.fill = fill;
	}
	public abstract redraw(ctx: CanvasRenderingContext2D, time: number): { complited: boolean, x?: number, y?: number, r?: number };
	protected normalizeCoordinates(start: number, current: number, end: number)
	{
		if (start < end) return Math.min(current, end);
		else return Math.max(current, end);
	}
}
class CanvasAnimator_CircleAnimation_Draw extends CanvasAnimator_CircleAnimation
{
	private duraction: number;
	private duractionCur = 0;
	private complited = false;
	constructor(x: number, y: number, r: number, fill: boolean, duraction?: number)
	{
		super(x, y, r, fill);
		this.name += "Draw";
		this.duraction = duraction || -1;
	}
	public redraw(ctx: CanvasRenderingContext2D, time: number)
	{
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
		if (this.fill) ctx.fill();
		else ctx.stroke();

		if (!this.complited && this.duraction > 0)
		{
			this.duractionCur += time;
			if (this.duractionCur > this.duraction) this.complited = true;
		}
		return { complited: this.complited };
	}
}
class CanvasAnimator_CircleAnimation_GrowRight extends CanvasAnimator_CircleAnimation
{
	private startAngle: number;
	private angle: number;
	private growSpeed: number;
	private reverse: boolean;
	private complited = false;
	constructor(time: number, startAngle: number, x: number, y: number, r: number, fill: boolean, reverse: boolean)
	{
		super(x, y, r, fill);
		this.name += "GrowRight";
		if (reverse) this.name += " (reversed)";
		this.reverse = reverse;
		this.startAngle = startAngle / 180 * Math.PI;
		this.angle = this.startAngle;
		this.growSpeed = Math.PI * 2 / time;
		if (reverse) this.angle += this.growSpeed;
	}
	public redraw(ctx: CanvasRenderingContext2D, time: number)
	{
		ctx.beginPath();
		if (this.reverse) ctx.arc(this.x, this.y, this.r, this.angle, this.startAngle);
		else ctx.arc(this.x, this.y, this.r, this.startAngle, this.angle);
		if (this.fill) ctx.fill();
		else ctx.stroke();

		if (!this.complited)
		{
			this.angle += this.growSpeed * time;
			this.angle = this.normalizeCoordinates(this.startAngle, this.angle, Math.PI * 2 + this.startAngle)
			if (this.angle >= Math.PI * 2 + this.startAngle) this.complited = true;
		}
		return { complited: this.complited };
	}
}
class CanvasAnimator_CircleAnimation_GrowLeft extends CanvasAnimator_CircleAnimation
{
	private startAngle: number;
	private angle: number;
	private growSpeed: number;
	private reverse: boolean;
	private complited = false;
	constructor(time: number, startAngle: number, x: number, y: number, r: number, fill: boolean, reverse: boolean)
	{
		super(x, y, r, fill);
		this.name += "GrowLeft";
		if (reverse) this.name += " (reversed)";
		this.reverse = reverse;
		this.startAngle = startAngle / 180 * Math.PI;
		this.angle = Math.PI * 2 + this.startAngle;
		this.growSpeed = Math.PI * 2 / time;
		if (reverse) this.angle -= this.growSpeed;
	}
	public redraw(ctx: CanvasRenderingContext2D, time: number)
	{
		ctx.beginPath();
		if (this.reverse) ctx.arc(this.x, this.y, this.r, this.angle, this.startAngle);
		else ctx.arc(this.x, this.y, this.r, this.startAngle, this.angle);
		if (this.fill) ctx.fill();
		else ctx.stroke();

		if (!this.complited)
		{
			this.angle -= this.growSpeed * time;
			this.angle = this.normalizeCoordinates(this.startAngle, this.angle, Math.PI * 2 + this.startAngle)
			if (this.angle < this.startAngle) this.complited = true;
		}
		return { complited: this.complited };
	}
}
class CanvasAnimator_CircleAnimation_Dash extends CanvasAnimator_CircleAnimation
{
	private dashOffset = 0;
	private step: number;
	private loopLenght: number;
	private dashArray: number[];
	private curDuration = 0;
	private duration: number;
	private complited = false;
	constructor(x: number, y: number, r: number, fill: boolean, dashSpeed: number, dashArray: number[], duration?: number)
	{
		super(x, y, r, fill);
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
class CanvasAnimator_CircleAnimation_Move extends CanvasAnimator_CircleAnimation
{
	private complited = false;
	protected x2: number;
	protected y2: number;
	protected r2: number;
	protected xCur: number;
	protected yCur: number;
	protected rCur: number;
	private stepX: number;
	private stepY: number;
	private stepR: number;
	constructor(time: number, x: number, y: number, r: number, fill: boolean, x2: number, y2: number, r2: number)
	{
		super(x, y, r, fill);
		this.name += "Move";
		this.x2 = x2;
		this.y2 = y2;
		this.r2 = r2;
		this.xCur = x;
		this.yCur = y;
		this.rCur = r;

		this.stepX = (x2 - x) / time;
		this.stepY = (y2 - y) / time;
		this.stepR = (r2 - r) / time;
	}
	public redraw(ctx: CanvasRenderingContext2D, time: number)
	{
		ctx.beginPath();
		ctx.arc(this.xCur, this.yCur, this.rCur, 0, Math.PI * 2);
		if (this.fill) ctx.fill();
		else ctx.stroke();

		if (!this.complited)
		{
			this.xCur += this.stepX * time;
			this.yCur += this.stepY * time;
			this.rCur += this.stepR * time;

			this.xCur = this.normalizeCoordinates(this.x, this.xCur, this.x2);
			this.yCur = this.normalizeCoordinates(this.y, this.yCur, this.y2);
			this.rCur = this.normalizeCoordinates(this.r, this.rCur, this.r2);

			if (this.xCur == this.x2 && this.yCur == this.y2 && this.rCur == this.r2)
			{
				this.complited = true;
			}
		}
		return { complited: this.complited, x: this.xCur, y: this.yCur, r: this.rCur};
	}
}



export abstract class CanvasAnimator_CircleAnimationData
{
	public startTime: number;
	constructor(startTime: number)
	{
		this.startTime = startTime;
	}
	public abstract createAnimation(x: number, y: number, r: number, fill: boolean): CanvasAnimator_CircleAnimation
}
export class CanvasAnimator_CircleAnimationData_Draw extends CanvasAnimator_CircleAnimationData
{
	private duraction: number;
	constructor(startTime: number, duraction?: number)
	{
		super(startTime);
		this.duraction = duraction || -1;
	}
	public createAnimation(x: number, y: number, r: number, fill: boolean)
	{
		return new CanvasAnimator_CircleAnimation_Draw(x, y, r, fill, this.duraction);
	}
}
export class CanvasAnimator_CircleAnimationData_Grow extends CanvasAnimator_CircleAnimationData
{
	public time: number;
	public startAngle: number;
	public reverse: boolean;
	constructor(startTime: number, time: number, startAngle: number, reverse?: boolean)
	{
		super(startTime);
		this.time = time;
		this.reverse = reverse || false;
		this.startAngle = startAngle;

	}
	public createAnimation(x: number, y: number, r: number, fill: boolean)
	{
		if (this.reverse) return new CanvasAnimator_CircleAnimation_GrowLeft(this.time, this.startAngle, x, y, r, fill, true);
		else return new CanvasAnimator_CircleAnimation_GrowRight(this.time, this.startAngle, x, y, r, fill, false);
	}
}
export class CanvasAnimator_CircleAnimationData_Fold extends CanvasAnimator_CircleAnimationData
{
	public time: number;
	public startAngle: number;
	public reverse: boolean;
	constructor(startTime: number, time: number, startAngle: number, reverse?: boolean)
	{
		super(startTime);
		this.time = time;
		this.reverse = reverse || false;
		this.startAngle = startAngle;
	}
	public createAnimation(x: number, y: number, r: number, fill: boolean)
	{
		if (this.reverse) return new CanvasAnimator_CircleAnimation_GrowRight(this.time, this.startAngle, x, y, r, fill, true);
		else return new CanvasAnimator_CircleAnimation_GrowLeft(this.time, this.startAngle, x, y, r, fill, false);
	}
}
export class CanvasAnimator_CircleAnimationData_Dash extends CanvasAnimator_CircleAnimationData
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
	public createAnimation(x: number, y: number, r: number, fill: boolean)
	{
		return new CanvasAnimator_CircleAnimation_Dash(x, y, r, fill, this.dashSpeed, this.dashArray, this.duration);
	}
}
export class CanvasAnimator_CircleAnimationData_MoveTo extends CanvasAnimator_CircleAnimationData
{
	public time: number;
	public x: number;
	public y: number;
	public r: number;
	constructor(startTime: number, time: number, x: number, y: number, r: number)
	{
		super(startTime);
		this.time = time;
		this.x = x;
		this.y = y;
		this.r = r;
	}
	public createAnimation(x: number, y: number, r: number, fill: boolean)
	{
		return new CanvasAnimator_CircleAnimation_Move(this.time, x, y, r, fill, this.x, this.y, this.r);
	}
}