import { CanvasAnimator_LineAnimator, CanvasAnimator_LineAnimationData_Grow, CanvasAnimator_LineAnimationData_Dash, CanvasAnimator_LineAnimationData_Draw, CanvasAnimator_LineAnimationData_MoveTo, CanvasAnimator_LineAnimationData_Fold } from "./objects/lineAnimations.js";
import { CanvasAnimator_CircleAnimationData_Draw, CanvasAnimator_CircleAnimationData_Grow, CanvasAnimator_CircleAnimationData_Fold, CanvasAnimator_CircleAnimationData_Dash, CanvasAnimator_CircleAnimationData_MoveTo, CanvasAnimator_CircleAnimator } from "./objects/circleAnimations.js";
import { CanvasAnimator_TextAnimationData_Draw, CanvasAnimator_TextAnimator, CanvasAnimator_TextAnimationData_Grow, CanvasAnimator_TextAnimationData_Fold, CanvasAnimator_TextAnimationData_MoveTo } from "./objects/textAnimations.js";
export class CanvasAnimator {
    constructor(ctx, drawZoneWidth, drawZoneHeight) {
        this.x = 0;
        this.y = 0;
        this.animators = [];
        this.pastTime = 0;
        this.startTime = 0;
        this.backgroundColor = "white";
        this.createLineAnimation = {
            draw: this.createLineAnimationDraw,
            grow: this.createLineAnimationGrow,
            fold: this.createLineAnimationFold,
            dash: this.createLineAnimationDash,
            moveTo: this.createLineAnimationMoveTo,
        };
        this.createCircleAnimation = {
            draw: this.createCircleAnimationDraw,
            grow: this.createCircleAnimationGrow,
            fold: this.createCircleAnimationFold,
            dash: this.createCircleAnimationDash,
            moveTo: this.createCircleAnimationMoveTo,
        };
        this.createTextAnimation = {
            draw: this.createTextAnimationDraw,
            grow: this.createTextAnimationGrow,
            fold: this.createTextAnimationFold,
            moveTo: this.createTextAnimationMoveTo,
        };
        this.ctx = ctx;
        this.width = drawZoneWidth;
        this.height = drawZoneHeight;
        this.redrawAll(0);
    }
    redrawAll(time) {
        if (this.pastTime == 0) {
            this.pastTime = time;
            this.startTime = time;
        }
        ;
        const interFrame = time - this.pastTime;
        this.pastTime = time;
        this.ctx.save();
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.restore();
        for (let i = this.animators.length - 1; i >= 0; i--) {
            const el = this.animators[i];
            if (el.animate(this.ctx, this.startTime, time, interFrame)) {
                this.animators.splice(i, 1);
            }
            ;
        }
        requestAnimationFrame(this.redrawAll.bind(this));
    }
    drawLine(sx, sy, ex, ey, animation, styles) {
        if (animation == undefined || animation.length == 0)
            animation = [new CanvasAnimator_LineAnimationData_Draw(0)];
        if (styles == undefined)
            styles = () => { };
        this.animators.push(new CanvasAnimator_LineAnimator(sx, sy, ex, ey, styles, animation));
    }
    drawCircle(x, y, r, fill, animation, styles) {
        if (animation == undefined || animation.length == 0)
            animation = [new CanvasAnimator_CircleAnimationData_Draw(0)];
        if (styles == undefined)
            styles = () => { };
        this.animators.push(new CanvasAnimator_CircleAnimator(x, y, r, fill, styles, animation));
    }
    drawText(x, y, text, animation, styles) {
        if (animation == undefined || animation.length == 0)
            animation = [new CanvasAnimator_TextAnimationData_Draw(0)];
        if (styles == undefined)
            styles = () => { };
        this.animators.push(new CanvasAnimator_TextAnimator(x, y, text, styles, animation));
    }
    setBackgroundColor(color) {
        this.backgroundColor = color;
    }
    createLineAnimationDraw(startTime, duraction) {
        return new CanvasAnimator_LineAnimationData_Draw(startTime, duraction);
    }
    createLineAnimationGrow(startTime, duraction) {
        return new CanvasAnimator_LineAnimationData_Grow(startTime, duraction);
    }
    createLineAnimationFold(startTime, duraction) {
        return new CanvasAnimator_LineAnimationData_Fold(startTime, duraction);
    }
    createLineAnimationDash(startTime, dashSpeed, dashArray, duration) {
        return new CanvasAnimator_LineAnimationData_Dash(startTime, dashSpeed, dashArray, duration);
    }
    createLineAnimationMoveTo(startTime, duraction, sx, sy, ex, ey) {
        return new CanvasAnimator_LineAnimationData_MoveTo(startTime, duraction, sx, sy, ex, ey);
    }
    createCircleAnimationDraw(startTime, duraction) {
        return new CanvasAnimator_CircleAnimationData_Draw(startTime, duraction);
    }
    createCircleAnimationGrow(startTime, duraction, startAngle, reverse) {
        return new CanvasAnimator_CircleAnimationData_Grow(startTime, duraction, startAngle, reverse);
    }
    createCircleAnimationFold(startTime, duraction, startAngle, reverse) {
        return new CanvasAnimator_CircleAnimationData_Fold(startTime, duraction, startAngle, reverse);
    }
    createCircleAnimationDash(startTime, dashSpeed, dashArray, duration) {
        return new CanvasAnimator_CircleAnimationData_Dash(startTime, dashSpeed, dashArray, duration);
    }
    createCircleAnimationMoveTo(startTime, duraction, x, y, r) {
        return new CanvasAnimator_CircleAnimationData_MoveTo(startTime, duraction, x, y, r);
    }
    createTextAnimationDraw(startTime, duraction) {
        return new CanvasAnimator_TextAnimationData_Draw(startTime, duraction);
    }
    createTextAnimationGrow(startTime, duraction) {
        return new CanvasAnimator_TextAnimationData_Grow(startTime, duraction);
    }
    createTextAnimationFold(startTime, duraction) {
        return new CanvasAnimator_TextAnimationData_Fold(startTime, duraction);
    }
    createTextAnimationMoveTo(startTime, duraction, x, y) {
        return new CanvasAnimator_TextAnimationData_MoveTo(startTime, duraction, x, y);
    }
}
