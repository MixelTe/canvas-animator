import { CanvasAnimator_Animator, logEnd, logStart } from "./someBase.js";
export class CanvasAnimator_LineAnimator extends CanvasAnimator_Animator {
    constructor(startTime, calcTimeFrElCr, sx, sy, ex, ey, setStyle, animations) {
        super(startTime, calcTimeFrElCr);
        this.dashAnimations = [];
        this.animations = animations;
        this.setStyle = setStyle;
        this.sx = sx;
        this.sy = sy;
        this.ex = ex;
        this.ey = ey;
        for (let i = this.animations.length - 1; i >= 0; i--) {
            const el = this.animations[i];
            if (el instanceof CanvasAnimator_LineAnimationData_Dash) {
                this.dashAnimations.push(el);
                this.animations.splice(i, 1);
            }
        }
    }
    animate(ctx, startTime, time, interFrame) {
        ctx.save();
        this.setStyle(ctx);
        if (this.dashAnimation == undefined) {
            for (let i = 0; i < this.dashAnimations.length; i++) {
                const el = this.dashAnimations[i];
                let elTime = el.startTime;
                if (this.calculateTimeFromElementCreating)
                    elTime += this.startTime;
                if (elTime <= time - startTime) {
                    const animation = el.createAnimation(this.sx, this.sy, this.ex, this.ey);
                    this.dashAnimation = animation;
                    this.dashAnimation.redraw(ctx, interFrame);
                    this.dashAnimations.splice(i, 1);
                    if (this.calculateTimeFromElementCreating)
                        logStart(this.dashAnimation.name, el.startTime, time, startTime, elTime);
                    else
                        logStart(this.dashAnimation.name, elTime, time, startTime);
                    break;
                }
                ;
            }
        }
        else {
            const dashResult = this.dashAnimation.redraw(ctx, interFrame);
            if (dashResult.complited) {
                logEnd(this.dashAnimation.name, time, startTime);
                this.dashAnimation = undefined;
            }
        }
        if (this.curAnimation == undefined) {
            for (let i = 0; i < this.animations.length; i++) {
                const el = this.animations[i];
                let elTime = el.startTime;
                if (this.calculateTimeFromElementCreating)
                    elTime += this.startTime;
                if (elTime <= time - startTime) {
                    const animation = el.createAnimation(this.sx, this.sy, this.ex, this.ey);
                    this.curAnimation = animation;
                    this.animations.splice(i, 1);
                    this.curAnimation.redraw(ctx, interFrame);
                    if (this.calculateTimeFromElementCreating)
                        logStart(this.curAnimation.name, el.startTime, time, startTime, elTime);
                    else
                        logStart(this.curAnimation.name, elTime, time, startTime);
                    break;
                }
                ;
            }
        }
        else {
            const result = this.curAnimation.redraw(ctx, interFrame);
            if (result.complited) {
                logEnd(this.curAnimation.name, time, startTime);
                this.curAnimation = undefined;
            }
            if (result.sx != undefined)
                this.sx = result.sx;
            if (result.sy != undefined)
                this.sy = result.sy;
            if (result.ex != undefined)
                this.ex = result.ex;
            if (result.ey != undefined)
                this.ey = result.ey;
        }
        ctx.restore();
        if (this.animations.length == 0 && this.curAnimation == undefined)
            return true;
        return false;
    }
}
class CanvasAnimator_LineAnimation {
    constructor(sx, sy, ex, ey) {
        this.name = "Line animation: %c";
        this.startTime = 0;
        this.sx = sx;
        this.sy = sy;
        this.ex = ex;
        this.ey = ey;
    }
    normalizeCoordinates(start, current, end) {
        if (start < end)
            return Math.min(current, end);
        else
            return Math.max(current, end);
    }
}
class CanvasAnimator_LineAnimation_Draw extends CanvasAnimator_LineAnimation {
    constructor(sx, sy, ex, ey, duraction) {
        super(sx, sy, ex, ey);
        this.duractionCur = 0;
        this.complited = false;
        this.name += "Draw";
        this.duraction = duraction || -1;
    }
    redraw(ctx, time) {
        ctx.beginPath();
        ctx.moveTo(this.sx, this.sy);
        ctx.lineTo(this.ex, this.ey);
        ctx.stroke();
        if (!this.complited && this.duraction > 0) {
            this.duractionCur += time;
            if (this.duractionCur > this.duraction)
                this.complited = true;
        }
        return { complited: this.complited };
    }
}
class CanvasAnimator_LineAnimation_Grow extends CanvasAnimator_LineAnimation {
    constructor(time, sx, sy, ex, ey) {
        super(sx, sy, ex, ey);
        this.complited = false;
        this.name += "Grow";
        if (time < 0)
            time = 0;
        this.cx = sx;
        this.cy = sy;
        this.stepX = (this.ex - this.sx) / time;
        this.stepY = (this.ey - this.sy) / time;
    }
    redraw(ctx, time) {
        ctx.beginPath();
        ctx.moveTo(this.sx, this.sy);
        ctx.lineTo(this.cx, this.cy);
        ctx.stroke();
        if (!this.complited) {
            this.cx += this.stepX * time;
            this.cy += this.stepY * time;
            this.cx = this.normalizeCoordinates(this.sx, this.cx, this.ex);
            this.cy = this.normalizeCoordinates(this.sy, this.cy, this.ey);
            if (this.cx == this.ex && this.cy == this.ey)
                this.complited = true;
        }
        return { complited: this.complited };
    }
}
class CanvasAnimator_LineAnimation_Fold extends CanvasAnimator_LineAnimation {
    constructor(time, sx, sy, ex, ey) {
        super(sx, sy, ex, ey);
        this.complited = false;
        this.name += "Fold";
        if (time < 0)
            time = 0;
        this.cx = ex;
        this.cy = ey;
        this.stepX = (this.ex - this.sx) / time;
        this.stepY = (this.ey - this.sy) / time;
    }
    redraw(ctx, time) {
        ctx.beginPath();
        ctx.moveTo(this.sx, this.sy);
        ctx.lineTo(this.cx, this.cy);
        ctx.stroke();
        if (!this.complited) {
            this.cx -= this.stepX * time;
            this.cy -= this.stepY * time;
            this.cx = this.normalizeCoordinates(this.ex, this.cx, this.sx);
            this.cy = this.normalizeCoordinates(this.ey, this.cy, this.sy);
            if (this.cx == this.sx && this.cy == this.sy)
                this.complited = true;
        }
        return { complited: this.complited };
    }
}
class CanvasAnimator_LineAnimation_Dash extends CanvasAnimator_LineAnimation {
    constructor(sx, sy, ex, ey, dashSpeed, dashArray, duration) {
        super(sx, sy, ex, ey);
        this.dashOffset = 0;
        this.complited = false;
        this.curDuration = 0;
        this.name += "Dash";
        this.dashArray = dashArray;
        this.duration = duration || -1;
        this.loopLenght = 0;
        dashArray.forEach(el => { this.loopLenght += el; });
        this.step = dashSpeed / 100;
    }
    redraw(ctx, time) {
        if (!this.complited) {
            this.dashOffset -= this.step * time;
            this.dashOffset %= this.loopLenght;
            if (this.duration > 0) {
                this.curDuration += time;
                if (this.curDuration > this.duration)
                    this.complited = true;
            }
        }
        ctx.setLineDash(this.dashArray);
        ctx.lineDashOffset = this.dashOffset;
        return { complited: this.complited };
    }
}
class CanvasAnimator_LineAnimation_Move extends CanvasAnimator_LineAnimation {
    constructor(time, sx, sy, ex, ey, sx2, sy2, ex2, ey2) {
        super(sx, sy, ex, ey);
        this.complited = false;
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
    redraw(ctx, time) {
        ctx.beginPath();
        ctx.moveTo(this.sxCur, this.syCur);
        ctx.lineTo(this.exCur, this.eyCur);
        ctx.stroke();
        if (!this.complited) {
            this.sxCur += this.stepX1 * time;
            this.syCur += this.stepY1 * time;
            this.exCur += this.stepX2 * time;
            this.eyCur += this.stepY2 * time;
            this.sxCur = this.normalizeCoordinates(this.sx, this.sxCur, this.sx2);
            this.syCur = this.normalizeCoordinates(this.sy, this.syCur, this.sy2);
            this.exCur = this.normalizeCoordinates(this.ex, this.exCur, this.ex2);
            this.eyCur = this.normalizeCoordinates(this.ey, this.eyCur, this.ey2);
            if (this.sxCur == this.sx2 && this.syCur == this.sy2 &&
                this.exCur == this.ex2 && this.eyCur == this.ey2) {
                this.complited = true;
            }
        }
        return { complited: this.complited, sx: this.sxCur, sy: this.syCur, ex: this.exCur, ey: this.eyCur };
    }
}
export class CanvasAnimator_LineAnimationData {
    constructor(startTime) {
        this.startTime = startTime;
    }
}
export class CanvasAnimator_LineAnimationData_Draw extends CanvasAnimator_LineAnimationData {
    constructor(startTime, duraction) {
        super(startTime);
        this.duraction = duraction || -1;
    }
    createAnimation(sx, sy, ex, ey) {
        return new CanvasAnimator_LineAnimation_Draw(sx, sy, ex, ey, this.duraction);
    }
}
export class CanvasAnimator_LineAnimationData_Grow extends CanvasAnimator_LineAnimationData {
    constructor(startTime, time) {
        super(startTime);
        this.time = time;
    }
    createAnimation(sx, sy, ex, ey) {
        return new CanvasAnimator_LineAnimation_Grow(this.time, sx, sy, ex, ey);
    }
}
export class CanvasAnimator_LineAnimationData_Fold extends CanvasAnimator_LineAnimationData {
    constructor(startTime, time) {
        super(startTime);
        this.time = time;
    }
    createAnimation(sx, sy, ex, ey) {
        return new CanvasAnimator_LineAnimation_Fold(this.time, sx, sy, ex, ey);
    }
}
export class CanvasAnimator_LineAnimationData_Dash extends CanvasAnimator_LineAnimationData {
    constructor(startTime, dashSpeed, dashArray, duration) {
        super(startTime);
        this.dashSpeed = dashSpeed;
        this.dashArray = dashArray;
        this.duration = duration;
    }
    createAnimation(sx, sy, ex, ey) {
        return new CanvasAnimator_LineAnimation_Dash(sx, sy, ex, ey, this.dashSpeed, this.dashArray, this.duration);
    }
}
export class CanvasAnimator_LineAnimationData_MoveTo extends CanvasAnimator_LineAnimationData {
    constructor(startTime, time, sx, sy, ex, ey) {
        super(startTime);
        this.time = time;
        this.sx = sx;
        this.sy = sy;
        this.ex = ex;
        this.ey = ey;
    }
    createAnimation(sx, sy, ex, ey) {
        return new CanvasAnimator_LineAnimation_Move(this.time, sx, sy, ex, ey, this.sx, this.sy, this.ex, this.ey);
    }
}
