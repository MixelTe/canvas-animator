import { CanvasAnimator_Animator, logEnd, logStart } from "./someBase.js";
export class CanvasAnimator_TextAnimator extends CanvasAnimator_Animator {
    constructor(startTime, calcTimeFrElCr, x, y, text, setStyle, animations) {
        super(startTime, calcTimeFrElCr);
        this.animations = animations;
        this.setStyle = setStyle;
        this.x = x;
        this.y = y;
        this.text = text;
    }
    animate(ctx, startTime, time, interFrame) {
        ctx.save();
        this.setStyle(ctx);
        if (this.curAnimation == undefined) {
            for (let i = 0; i < this.animations.length; i++) {
                const el = this.animations[i];
                let elTime = el.startTime;
                if (this.calculateTimeFromElementCreating)
                    elTime += this.startTime;
                if (elTime <= time - startTime) {
                    const animation = el.createAnimation(this.x, this.y, this.text);
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
        }
        ctx.restore();
        if (this.animations.length == 0 && this.curAnimation == undefined)
            return true;
        return false;
    }
}
class CanvasAnimator_TextAnimation {
    constructor(x, y, text) {
        this.name = "Text animation: %c";
        this.startTime = 0;
        this.x = x;
        this.y = y;
        this.text = text;
    }
    normalizeCoordinates(start, current, end) {
        if (start < end)
            return Math.min(current, end);
        else
            return Math.max(current, end);
    }
}
class CanvasAnimator_TextAnimation_Draw extends CanvasAnimator_TextAnimation {
    constructor(x, y, text, duraction) {
        super(x, y, text);
        this.duractionCur = 0;
        this.complited = false;
        this.name += "Draw";
        this.duraction = duraction || -1;
    }
    redraw(ctx, time) {
        ctx.fillText(this.text, this.x, this.y);
        if (!this.complited && this.duraction > 0) {
            this.duractionCur += time;
            if (this.duractionCur > this.duraction)
                this.complited = true;
        }
        return { complited: this.complited };
    }
}
class CanvasAnimator_TextAnimation_Grow extends CanvasAnimator_TextAnimation {
    constructor(time, x, y, text) {
        super(x, y, text);
        this.ry = 0;
        this.rx2 = 0;
        this.ry2 = 0;
        this.rwCur = 0;
        this.step = 0;
        this.complited = false;
        this.name += "Grow";
        if (time < 0)
            time = 0;
        this.time = time;
        this.rx = x;
    }
    redraw(ctx, time) {
        if (!this.complited) {
            const textMetrics = ctx.measureText(this.text);
            this.ry = this.y + textMetrics.actualBoundingBoxDescent;
            this.rx2 = this.x + textMetrics.width;
            this.ry2 = this.y - textMetrics.actualBoundingBoxAscent;
            this.step = (this.rx2 - this.rx) / this.time;
            this.rwCur += this.step * time;
            this.rwCur = this.normalizeCoordinates(this.rx - this.x, this.rwCur, this.rx2 - this.x);
            if (this.rwCur == this.rx2 - this.x)
                this.complited = true;
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
class CanvasAnimator_TextAnimation_Fold extends CanvasAnimator_TextAnimation {
    constructor(time, x, y, text) {
        super(x, y, text);
        this.ry = 0;
        this.rx2 = 0;
        this.ry2 = 0;
        this.rwCur = 0;
        this.step = 0;
        this.firstRedraw = true;
        this.complited = false;
        this.name += "Fold";
        if (time < 0)
            time = 0;
        this.time = time;
        this.rx = x;
    }
    redraw(ctx, time) {
        if (!this.complited) {
            const textMetrics = ctx.measureText(this.text);
            this.ry = this.y + textMetrics.actualBoundingBoxDescent;
            this.rx2 = this.x + textMetrics.width;
            this.ry2 = this.y - textMetrics.actualBoundingBoxAscent;
            this.step = (this.rx2 - this.rx) / this.time;
            if (this.firstRedraw) {
                this.rwCur = this.rx2 - this.x;
                this.firstRedraw = false;
            }
            this.rwCur -= this.step * time;
            this.rwCur = this.normalizeCoordinates(this.rx2 - this.x, this.rwCur, 0);
            if (this.rwCur == 0)
                this.complited = true;
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
class CanvasAnimator_TextAnimation_Move extends CanvasAnimator_TextAnimation {
    constructor(time, x, y, text, x2, y2) {
        super(x, y, text);
        this.complited = false;
        this.name += "Move";
        this.x2 = x2;
        this.y2 = y2;
        this.xCur = x;
        this.yCur = y;
        this.stepX = (x2 - x) / time;
        this.stepY = (y2 - y) / time;
    }
    redraw(ctx, time) {
        ctx.fillText(this.text, this.xCur, this.yCur);
        if (!this.complited) {
            this.xCur += this.stepX * time;
            this.yCur += this.stepY * time;
            this.xCur = this.normalizeCoordinates(this.x, this.xCur, this.x2);
            this.yCur = this.normalizeCoordinates(this.y, this.yCur, this.y2);
            if (this.xCur == this.x2 && this.yCur == this.y2) {
                this.complited = true;
            }
        }
        return { complited: this.complited, x: this.xCur, y: this.yCur };
    }
}
export class CanvasAnimator_TextAnimationData {
    constructor(startTime) {
        this.startTime = startTime;
    }
}
export class CanvasAnimator_TextAnimationData_Draw extends CanvasAnimator_TextAnimationData {
    constructor(startTime, duraction) {
        super(startTime);
        this.duraction = duraction || -1;
    }
    createAnimation(x, y, text) {
        return new CanvasAnimator_TextAnimation_Draw(x, y, text, this.duraction);
    }
}
export class CanvasAnimator_TextAnimationData_Grow extends CanvasAnimator_TextAnimationData {
    constructor(startTime, time) {
        super(startTime);
        this.time = time;
    }
    createAnimation(x, y, text) {
        return new CanvasAnimator_TextAnimation_Grow(this.time, x, y, text);
    }
}
export class CanvasAnimator_TextAnimationData_Fold extends CanvasAnimator_TextAnimationData {
    constructor(startTime, time) {
        super(startTime);
        this.time = time;
    }
    createAnimation(x, y, text) {
        return new CanvasAnimator_TextAnimation_Fold(this.time, x, y, text);
    }
}
export class CanvasAnimator_TextAnimationData_MoveTo extends CanvasAnimator_TextAnimationData {
    constructor(startTime, time, x, y) {
        super(startTime);
        this.time = time;
        this.x = x;
        this.y = y;
    }
    createAnimation(x, y, text) {
        return new CanvasAnimator_TextAnimation_Move(this.time, x, y, text, this.x, this.y);
    }
}
