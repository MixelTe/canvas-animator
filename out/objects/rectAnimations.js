import { CanvasAnimator_Animator, logEnd, logStart } from "./someBase.js";
export class CanvasAnimator_RectAnimator extends CanvasAnimator_Animator {
    constructor(startTime, calcTimeFrElCr, x, y, width, height, setStyle, animations) {
        super(startTime, calcTimeFrElCr);
        this.dashAnimations = [];
        this.animations = animations;
        this.setStyle = setStyle;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        for (let i = this.animations.length - 1; i >= 0; i--) {
            const el = this.animations[i];
            if (el instanceof CanvasAnimator_RectAnimationData_Dash) {
                this.dashAnimations.push(el);
                this.animations.splice(i, 1);
            }
        }
    }
    animate(ctx, startTime, time, interFrame) {
        ctx.save();
        ctx.fillStyle = "transparent";
        this.setStyle(ctx);
        if (this.dashAnimation == undefined) {
            for (let i = 0; i < this.dashAnimations.length; i++) {
                const el = this.dashAnimations[i];
                let elTime = el.startTime;
                if (this.calculateTimeFromElementCreating)
                    elTime += this.startTime;
                if (elTime <= time - startTime) {
                    const animation = el.createAnimation(this.x, this.y, this.width, this.height);
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
                    const animation = el.createAnimation(this.x, this.y, this.width, this.height);
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
            if (result.width != undefined)
                this.width = result.width;
            if (result.height != undefined)
                this.height = result.height;
        }
        ctx.restore();
        if (this.animations.length == 0 && this.curAnimation == undefined)
            return true;
        return false;
    }
}
class CanvasAnimator_RectAnimation {
    constructor(x, y, width, height) {
        this.name = "Rect animation: %c";
        this.startTime = 0;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    normalizeCoordinates(start, current, end) {
        if (start < end)
            return Math.min(current, end);
        else
            return Math.max(current, end);
    }
}
class CanvasAnimator_RectAnimation_Draw extends CanvasAnimator_RectAnimation {
    constructor(x, y, width, height, duraction) {
        super(x, y, width, height);
        this.duractionCur = 0;
        this.complited = false;
        this.name += "Draw";
        this.duraction = duraction || -1;
    }
    redraw(ctx, time) {
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        if (!this.complited && this.duraction > 0) {
            this.duractionCur += time;
            if (this.duractionCur > this.duraction)
                this.complited = true;
        }
        return { complited: this.complited };
    }
}
class CanvasAnimator_RectAnimation_Grow extends CanvasAnimator_RectAnimation {
    constructor(time, x, y, width, height, xAxis, toRight, reversX, yAxis, toTop, reversY) {
        super(x, y, width, height);
        this.complited = false;
        this.name += "Grow";
        if (time < 0)
            time = 0;
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
        if (xAxis) {
            nameSuffixX += " (xAxis";
            if (toRight) {
                nameSuffixX += " toRight";
                this.cwidth = 0;
            }
            else if (!this.reversX) {
                this.cx = x + width;
                this.cwidth = 0;
            }
            if (reversX)
                nameSuffixX += " reversX";
        }
        if (yAxis) {
            nameSuffixY += " (yAxis";
            if (toTop) {
                nameSuffixY += " toTop";
                this.cheight = 0;
            }
            else if (!this.reversY) {
                this.cy = y + height;
                this.cheight = 0;
            }
            if (reversY)
                nameSuffixY += " reversX";
        }
        if (nameSuffixX != "")
            this.name += nameSuffixX + ")";
        if (nameSuffixY != "")
            this.name += nameSuffixY + ")";
    }
    redraw(ctx, time) {
        ctx.fillRect(this.cx, this.cy, this.cwidth, this.cheight);
        ctx.strokeRect(this.cx, this.cy, this.cwidth, this.cheight);
        let complitedX = false;
        let complitedY = false;
        if (!this.complited) {
            if (this.xAxis) {
                if (this.toRight) {
                    if (this.reversX) {
                        this.cx += this.stepX * time;
                        this.cx = this.normalizeCoordinates(this.x, this.cx, this.x + this.width);
                        this.cwidth = this.width - (this.cx - this.x);
                        if (this.cwidth == 0)
                            complitedX = true;
                        // console.log("xAxis, toRight, reversX");
                    }
                    else {
                        this.cwidth += this.stepX * time;
                        this.cwidth = this.normalizeCoordinates(0, this.cwidth, this.width);
                        if (this.cwidth == this.width)
                            complitedX = true;
                        // console.log("xAxis, toRight");
                    }
                }
                else {
                    if (this.reversX) {
                        this.cwidth -= this.stepX * time;
                        this.cwidth = this.normalizeCoordinates(this.width, this.cwidth, 0);
                        if (this.cwidth == 0)
                            complitedX = true;
                        // console.log("xAxis, reversX");
                    }
                    else {
                        this.cx -= this.stepX * time;
                        this.cx = this.normalizeCoordinates(this.x + this.width, this.cx, this.x);
                        this.cwidth = this.width - (this.cx - this.x);
                        if (this.cx == this.x)
                            complitedX = true;
                        // console.log("xAxis");
                    }
                }
            }
            else {
                complitedX = true;
            }
            if (this.yAxis) {
                if (this.toTop) {
                    if (this.reversY) {
                        this.cy += this.stepY * time;
                        this.cy = this.normalizeCoordinates(this.y, this.cy, this.y + this.height);
                        this.cheight = this.height - (this.cy - this.y);
                        if (this.cheight == 0)
                            complitedY = true;
                        // console.log("yAxis, toTop, reversY");
                    }
                    else {
                        this.cheight += this.stepY * time;
                        this.cheight = this.normalizeCoordinates(0, this.cheight, this.height);
                        if (this.cheight == this.height)
                            complitedY = true;
                        // console.log("yAxis, toTop");
                    }
                }
                else {
                    if (this.reversY) {
                        this.cheight -= this.stepY * time;
                        this.cheight = this.normalizeCoordinates(this.height, this.cheight, 0);
                        if (this.cheight == 0)
                            complitedY = true;
                        // console.log("yAxis, reversY");
                    }
                    else {
                        this.cy -= this.stepY * time;
                        this.cy = this.normalizeCoordinates(this.y + this.height, this.cy, this.y);
                        this.cheight = this.height - (this.cy - this.y);
                        if (this.cy == this.y)
                            complitedY = true;
                        // console.log("yAxis");
                    }
                }
            }
            else {
                complitedY = true;
            }
        }
        this.complited = complitedX == true && complitedY == true;
        return { complited: this.complited };
    }
}
class CanvasAnimator_RectAnimation_Dash extends CanvasAnimator_RectAnimation {
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
class CanvasAnimator_RectAnimation_Move extends CanvasAnimator_RectAnimation {
    constructor(time, x, y, width, height, x2, y2, width2, height2) {
        super(x, y, width, height);
        this.complited = false;
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
    redraw(ctx, time) {
        ctx.fillRect(this.xCur, this.yCur, this.widthCur, this.heightCur);
        ctx.strokeRect(this.xCur, this.yCur, this.widthCur, this.heightCur);
        if (!this.complited) {
            this.xCur += this.stepX * time;
            this.yCur += this.stepY * time;
            this.widthCur += this.stepWidth * time;
            this.heightCur += this.stepHeight * time;
            this.xCur = this.normalizeCoordinates(this.x, this.xCur, this.x2);
            this.yCur = this.normalizeCoordinates(this.y, this.yCur, this.y2);
            this.widthCur = this.normalizeCoordinates(this.width, this.widthCur, this.width2);
            this.heightCur = this.normalizeCoordinates(this.height, this.heightCur, this.height2);
            if (this.xCur == this.x2 && this.yCur == this.y2 &&
                this.widthCur == this.width2 && this.heightCur == this.height2) {
                this.complited = true;
            }
        }
        return { complited: this.complited, x: this.xCur, y: this.yCur, width: this.widthCur, height: this.heightCur };
    }
}
export class CanvasAnimator_RectAnimationData {
    constructor(startTime) {
        this.startTime = startTime;
    }
}
export class CanvasAnimator_RectAnimationData_Draw extends CanvasAnimator_RectAnimationData {
    constructor(startTime, duraction) {
        super(startTime);
        this.duraction = duraction || -1;
    }
    createAnimation(x, y, width, height) {
        return new CanvasAnimator_RectAnimation_Draw(x, y, width, height, this.duraction);
    }
}
export class CanvasAnimator_RectAnimationData_Grow extends CanvasAnimator_RectAnimationData {
    constructor(startTime, time, xAxis, toRight, reversX, yAxis, toTop, reversY) {
        super(startTime);
        this.time = time;
        this.xAxis = xAxis;
        this.toRight = toRight;
        this.reversX = reversX;
        this.yAxis = yAxis;
        this.toTop = toTop;
        this.reversY = reversY;
    }
    createAnimation(sx, sy, ex, ey) {
        return new CanvasAnimator_RectAnimation_Grow(this.time, sx, sy, ex, ey, this.xAxis, this.toRight, this.reversX, this.yAxis, this.toTop, this.reversY);
    }
}
export class CanvasAnimator_RectAnimationData_Dash extends CanvasAnimator_RectAnimationData {
    constructor(startTime, dashSpeed, dashArray, duration) {
        super(startTime);
        this.dashSpeed = dashSpeed;
        this.dashArray = dashArray;
        this.duration = duration;
    }
    createAnimation(sx, sy, ex, ey) {
        return new CanvasAnimator_RectAnimation_Dash(sx, sy, ex, ey, this.dashSpeed, this.dashArray, this.duration);
    }
}
export class CanvasAnimator_RectAnimationData_MoveTo extends CanvasAnimator_RectAnimationData {
    constructor(startTime, time, x, y, width, height) {
        super(startTime);
        this.time = time;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    createAnimation(x, y, width, height) {
        return new CanvasAnimator_RectAnimation_Move(this.time, x, y, width, height, this.x, this.y, this.width, this.height);
    }
}
