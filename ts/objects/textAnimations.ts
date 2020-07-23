import { SetStyleFunction } from "../canvasAnimator.js";
import { CanvasAnimator_Animator, logEnd, logStart } from "./someBase.js";

export class CanvasAnimator_TextAnimator extends CanvasAnimator_Animator
{
	protected x: number;
	protected y: number;
	protected text: string;
	private setStyle: SetStyleFunction;
	private animations: CanvasAnimator_TextAnimationData[];
	private curAnimation: CanvasAnimator_TextAnimation | undefined;
	constructor(startTime: number, calcTimeFrElCr: boolean, x: number, y: number, text: string, setStyle: SetStyleFunction, animations: CanvasAnimator_TextAnimationData[])
	{
		super(startTime, calcTimeFrElCr);
		this.animations = animations;
		this.setStyle = setStyle;
		this.x = x;
		this.y = y;
		this.text = text;
	}

	public animate(ctx: CanvasRenderingContext2D, startTime: number, time: number, interFrame: number)
	{
		ctx.save();
		this.setStyle(ctx);
		if (this.curAnimation == undefined)
		{
			for (let i = 0; i < this.animations.length; i++) {
				const el = this.animations[i];
				let elTime = el.startTime;
				if (this.calculateTimeFromElementCreating) elTime += this.startTime;
				if (elTime <= time - startTime)
				{
					const animation = el.createAnimation(this.x, this.y, this.text);
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
		}
		ctx.restore();

		if (this.animations.length == 0 && this.curAnimation == undefined) return true
		return false;
	}
}



abstract class CanvasAnimator_TextAnimation
{
	public name = "Text animation: %c";
	protected x: number;
	protected y: number;
	protected text: string;
	public startTime = 0;
	constructor(x: number, y: number, text: string)
	{
		this.x = x;
		this.y = y;
		this.text = text;
	}
	public abstract redraw(ctx: CanvasRenderingContext2D, time: number): { complited: boolean,x?: number, y?: number };
	protected normalizeCoordinates(start: number, current: number, end: number)
	{
		if (start < end) return Math.min(current, end);
		else return Math.max(current, end);
	}
}
class CanvasAnimator_TextAnimation_Draw extends CanvasAnimator_TextAnimation
{
	private duraction: number;
	private duractionCur = 0;
	private complited = false;
	constructor(x: number, y: number, text: string, duraction?: number)
	{
		super(x, y, text);
		this.name += "Draw";
		this.duraction = duraction || -1;
	}
	public redraw(ctx: CanvasRenderingContext2D, time: number)
	{
		ctx.fillText(this.text, this.x, this.y);

		if (!this.complited && this.duraction > 0)
		{
			this.duractionCur += time;
			if (this.duractionCur > this.duraction) this.complited = true;
		}
		return { complited: this.complited };
	}
}
class CanvasAnimator_TextAnimation_Grow extends CanvasAnimator_TextAnimation
{
	private rx: number;
	private ry = 0;
	private rx2 = 0;
	private ry2 = 0;
	private rwCur = 0;
	private step = 0;
	private time: number;
	private complited = false;
	constructor(time: number, x: number, y: number, text: string)
	{
		super(x, y, text);
		this.name += "Grow";
		if (time < 0) time = 0;
		this.time = time;
		this.rx = x;
	}
	public redraw(ctx: CanvasRenderingContext2D, time: number)
	{
		if (!this.complited)
		{
			const textMetrics = ctx.measureText(this.text);
			this.ry = this.y + textMetrics.actualBoundingBoxDescent;
			this.rx2 = this.x + textMetrics.width;
			this.ry2 = this.y - textMetrics.actualBoundingBoxAscent;
			this.step = (this.rx2 - this.rx) / this.time;

			this.rwCur += this.step * time;

			this.rwCur = this.normalizeCoordinates(this.rx, this.rwCur, this.rx2);
			if (this.rwCur == this.rx2) this.complited = true;
		}

		ctx.beginPath();
		ctx.rect(this.rx, this.ry, this.rwCur, this.ry2 - this.ry);
		ctx.clip();

		ctx.beginPath();
		ctx.fillText(this.text, this.x, this.y);
		ctx.stroke();

		return { complited: this.complited };
	}
}
class CanvasAnimator_TextAnimation_Fold extends CanvasAnimator_TextAnimation
{
	private rx: number;
	private ry = 0;
	private rx2 = 0;
	private ry2 = 0;
	private rwCur = 0;
	private step = 0;
	private time: number;
	private firstRedraw = true;
	private complited = false;
	constructor(time: number, x: number, y: number, text: string)
	{
		super(x, y, text);
		this.name += "Fold";
		if (time < 0) time = 0;
		this.time = time;
		this.rx = x;
	}
	public redraw(ctx: CanvasRenderingContext2D, time: number)
	{
		if (!this.complited)
		{
			const textMetrics = ctx.measureText(this.text);
			this.ry = this.y + textMetrics.actualBoundingBoxDescent;
			this.rx2 = this.x + textMetrics.width;
			this.ry2 = this.y - textMetrics.actualBoundingBoxAscent;
			this.step = (this.rx2 - this.rx) / this.time;
			if (this.firstRedraw)
			{
				this.rwCur = this.rx2;
				this.firstRedraw = false;
			}

			this.rwCur -= this.step * time;

			this.rwCur = this.normalizeCoordinates(this.rx2, this.rwCur, 0);
			if (this.rwCur == 0) this.complited = true;
		}

		ctx.beginPath();
		ctx.rect(this.rx, this.ry, this.rwCur, this.ry2 - this.ry);
		ctx.clip();

		ctx.beginPath();
		ctx.fillText(this.text, this.x, this.y);
		ctx.stroke();

		return { complited: this.complited };
	}
}
class CanvasAnimator_TextAnimation_Move extends CanvasAnimator_TextAnimation
{
	private complited = false;
	protected x2: number;
	protected y2: number;
	protected xCur: number;
	protected yCur: number;
	private stepX: number;
	private stepY: number;
	constructor(time: number, x: number, y: number, text: string, x2: number, y2: number)
	{
		super(x, y, text);
		this.name += "Move";
		this.x2 = x2;
		this.y2 = y2;
		this.xCur = x;
		this.yCur = y;

		this.stepX = (x2 - x) / time;
		this.stepY = (y2 - y) / time;
	}
	public redraw(ctx: CanvasRenderingContext2D, time: number)
	{
		ctx.fillText(this.text, this.xCur, this.yCur);

		if (!this.complited)
		{
			this.xCur += this.stepX * time;
			this.yCur += this.stepY * time;

			this.xCur = this.normalizeCoordinates(this.x, this.xCur, this.x2);
			this.yCur = this.normalizeCoordinates(this.y, this.yCur, this.y2);

			if (this.xCur == this.x2 && this.yCur == this.y2)
			{
				this.complited = true;
			}
		}
		return { complited: this.complited, x: this.xCur, y: this.yCur };
	}
}



export abstract class CanvasAnimator_TextAnimationData
{
	public startTime: number;
	constructor(startTime: number)
	{
		this.startTime = startTime;
	}
	public abstract createAnimation(x: number, y: number, text: string): CanvasAnimator_TextAnimation
}
export class CanvasAnimator_TextAnimationData_Draw extends CanvasAnimator_TextAnimationData
{
	private duraction: number;
	constructor(startTime: number, duraction?: number)
	{
		super(startTime);
		this.duraction = duraction || -1;
	}
	public createAnimation(x: number, y: number, text: string)
	{
		return new CanvasAnimator_TextAnimation_Draw(x, y, text, this.duraction);
	}
}
export class CanvasAnimator_TextAnimationData_Grow extends CanvasAnimator_TextAnimationData
{
	public time: number;
	constructor(startTime: number, time: number)
	{
		super(startTime);
		this.time = time;
	}
	public createAnimation(x: number, y: number, text: string)
	{
		return new CanvasAnimator_TextAnimation_Grow(this.time, x, y, text);
	}
}
export class CanvasAnimator_TextAnimationData_Fold extends CanvasAnimator_TextAnimationData
{
	public time: number;
	constructor(startTime: number, time: number)
	{
		super(startTime);
		this.time = time;
	}
	public createAnimation(x: number, y: number, text: string)
	{
		return new CanvasAnimator_TextAnimation_Fold(this.time, x, y, text);
	}
}
export class CanvasAnimator_TextAnimationData_MoveTo extends CanvasAnimator_TextAnimationData
{
	public time: number;
	public x: number;
	public y: number;
	constructor(startTime: number, time: number, x: number, y: number)
	{
		super(startTime);
		this.time = time;
		this.x = x;
		this.y = y;
	}
	public createAnimation(x: number, y: number, text: string)
	{
		return new CanvasAnimator_TextAnimation_Move(this.time, x, y, text, this.x, this.y);
	}
}