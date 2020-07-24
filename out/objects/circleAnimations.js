import { CanvasAnimator_Animator, logEnd, logStart } from "./someBase.js";
export class CanvasAnimator_CircleAnimator extends CanvasAnimator_Animator {
    constructor(startTime, calcTimeFrElCr, x, y, r, fill, setStyle, animations) {
        super(startTime, calcTimeFrElCr);
        this.dashAnimations = [];
        this.animations = animations;
        this.setStyle = setStyle;
        this.x = x;
        this.y = y;
        this.r = r;
        this.fill = fill;
        for (let i = this.animations.length - 1; i >= 0; i--) {
            const el = this.animations[i];
            if (el instanceof CanvasAnimator_CircleAnimationData_Dash) {
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
                    const animation = el.createAnimation(this.x, this.y, this.r, this.fill);
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
                    const animation = el.createAnimation(this.x, this.y, this.r, this.fill);
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
            if (result.x != undefined)
                this.x = result.x;
            if (result.y != undefined)
                this.y = result.y;
            if (result.r != undefined)
                this.r = result.r;
        }
        ctx.restore();
        if (this.animations.length == 0 && this.curAnimation == undefined)
            return true;
        return false;
    }
}
class CanvasAnimator_CircleAnimation {
    constructor(x, y, r, fill) {
        this.name = "Circle animation: %c";
        this.startTime = 0;
        this.x = x;
        this.y = y;
        this.r = r;
        this.fill = fill;
    }
    normalizeCoordinates(start, current, end) {
        if (start < end)
            return Math.min(current, end);
        else
            return Math.max(current, end);
    }
}
class CanvasAnimator_CircleAnimation_Draw extends CanvasAnimator_CircleAnimation {
    constructor(x, y, r, fill, duraction) {
        super(x, y, r, fill);
        this.duractionCur = 0;
        this.complited = false;
        this.name += "Draw";
        this.duraction = duraction || -1;
    }
    redraw(ctx, time) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        if (this.fill)
            ctx.fill();
        else
            ctx.stroke();
        if (!this.complited && this.duraction > 0) {
            this.duractionCur += time;
            if (this.duractionCur > this.duraction)
                this.complited = true;
        }
        return { complited: this.complited };
    }
}
class CanvasAnimator_CircleAnimation_GrowRight extends CanvasAnimator_CircleAnimation {
    constructor(time, startAngle, x, y, r, fill, reverse) {
        super(x, y, r, fill);
        this.complited = false;
        this.name += "GrowRight";
        if (reverse)
            this.name += " (reversed)";
        this.reverse = reverse;
        this.startAngle = startAngle / 180 * Math.PI;
        this.angle = this.startAngle;
        this.growSpeed = Math.PI * 2 / time;
        if (reverse)
            this.angle += this.growSpeed;
    }
    redraw(ctx, time) {
        ctx.beginPath();
        if (this.reverse)
            ctx.arc(this.x, this.y, this.r, this.angle, this.startAngle);
        else
            ctx.arc(this.x, this.y, this.r, this.startAngle, this.angle);
        if (this.fill)
            ctx.fill();
        else
            ctx.stroke();
        if (!this.complited) {
            this.angle += this.growSpeed * time;
            this.angle = this.normalizeCoordinates(this.startAngle, this.angle, Math.PI * 2 + this.startAngle);
            if (this.angle >= Math.PI * 2 + this.startAngle)
                this.complited = true;
        }
        return { complited: this.complited };
    }
}
class CanvasAnimator_CircleAnimation_GrowLeft extends CanvasAnimator_CircleAnimation {
    constructor(time, startAngle, x, y, r, fill, reverse) {
        super(x, y, r, fill);
        this.complited = false;
        this.name += "GrowLeft";
        if (reverse)
            this.name += " (reversed)";
        this.reverse = reverse;
        this.startAngle = startAngle / 180 * Math.PI;
        this.angle = Math.PI * 2 + this.startAngle;
        this.growSpeed = Math.PI * 2 / time;
        if (reverse)
            this.angle -= this.growSpeed;
    }
    redraw(ctx, time) {
        ctx.beginPath();
        if (this.reverse)
            ctx.arc(this.x, this.y, this.r, this.angle, this.startAngle);
        else
            ctx.arc(this.x, this.y, this.r, this.startAngle, this.angle);
        if (this.fill)
            ctx.fill();
        else
            ctx.stroke();
        if (!this.complited) {
            this.angle -= this.growSpeed * time;
            this.angle = this.normalizeCoordinates(this.startAngle, this.angle, Math.PI * 2 + this.startAngle);
            if (this.angle < this.startAngle)
                this.complited = true;
        }
        return { complited: this.complited };
    }
}
class CanvasAnimator_CircleAnimation_Dash extends CanvasAnimator_CircleAnimation {
    constructor(x, y, r, fill, dashSpeed, dashArray, duration) {
        super(x, y, r, fill);
        this.dashOffset = 0;
        this.curDuration = 0;
        this.complited = false;
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
class CanvasAnimator_CircleAnimation_Move extends CanvasAnimator_CircleAnimation {
    constructor(time, x, y, r, fill, x2, y2, r2) {
        super(x, y, r, fill);
        this.complited = false;
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
    redraw(ctx, time) {
        ctx.beginPath();
        ctx.arc(this.xCur, this.yCur, this.rCur, 0, Math.PI * 2);
        if (this.fill)
            ctx.fill();
        else
            ctx.stroke();
        if (!this.complited) {
            this.xCur += this.stepX * time;
            this.yCur += this.stepY * time;
            this.rCur += this.stepR * time;
            this.xCur = this.normalizeCoordinates(this.x, this.xCur, this.x2);
            this.yCur = this.normalizeCoordinates(this.y, this.yCur, this.y2);
            this.rCur = this.normalizeCoordinates(this.r, this.rCur, this.r2);
            if (this.xCur == this.x2 && this.yCur == this.y2 && this.rCur == this.r2) {
                this.complited = true;
            }
        }
        return { complited: this.complited, x: this.xCur, y: this.yCur, r: this.rCur };
    }
}
export class CanvasAnimator_CircleAnimationData {
    constructor(startTime) {
        this.startTime = startTime;
    }
}
export class CanvasAnimator_CircleAnimationData_Draw extends CanvasAnimator_CircleAnimationData {
    constructor(startTime, duraction) {
        super(startTime);
        this.duraction = duraction || -1;
    }
    createAnimation(x, y, r, fill) {
        return new CanvasAnimator_CircleAnimation_Draw(x, y, r, fill, this.duraction);
    }
}
export class CanvasAnimator_CircleAnimationData_Grow extends CanvasAnimator_CircleAnimationData {
    constructor(startTime, time, startAngle, reverse) {
        super(startTime);
        this.time = time;
        this.reverse = reverse || false;
        this.startAngle = startAngle;
    }
    createAnimation(x, y, r, fill) {
        if (this.reverse)
            return new CanvasAnimator_CircleAnimation_GrowLeft(this.time, this.startAngle, x, y, r, fill, true);
        else
            return new CanvasAnimator_CircleAnimation_GrowRight(this.time, this.startAngle, x, y, r, fill, false);
    }
}
export class CanvasAnimator_CircleAnimationData_Fold extends CanvasAnimator_CircleAnimationData {
    constructor(startTime, time, startAngle, reverse) {
        super(startTime);
        this.time = time;
        this.reverse = reverse || false;
        this.startAngle = startAngle;
    }
    createAnimation(x, y, r, fill) {
        if (this.reverse)
            return new CanvasAnimator_CircleAnimation_GrowRight(this.time, this.startAngle, x, y, r, fill, true);
        else
            return new CanvasAnimator_CircleAnimation_GrowLeft(this.time, this.startAngle, x, y, r, fill, false);
    }
}
export class CanvasAnimator_CircleAnimationData_Dash extends CanvasAnimator_CircleAnimationData {
    constructor(startTime, dashSpeed, dashArray, duration) {
        super(startTime);
        this.dashSpeed = dashSpeed;
        this.dashArray = dashArray;
        this.duration = duration;
    }
    createAnimation(x, y, r, fill) {
        return new CanvasAnimator_CircleAnimation_Dash(x, y, r, fill, this.dashSpeed, this.dashArray, this.duration);
    }
}
export class CanvasAnimator_CircleAnimationData_MoveTo extends CanvasAnimator_CircleAnimationData {
    constructor(startTime, time, x, y, r) {
        super(startTime);
        this.time = time;
        this.x = x;
        this.y = y;
        this.r = r;
    }
    createAnimation(x, y, r, fill) {
        return new CanvasAnimator_CircleAnimation_Move(this.time, x, y, r, fill, this.x, this.y, this.r);
    }
}
