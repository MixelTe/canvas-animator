import { CanvasAnimator_LineAnimator, CanvasAnimator_LineAnimationData_Grow, CanvasAnimator_LineAnimationData_Dash, CanvasAnimator_LineAnimationData_Draw, CanvasAnimator_LineAnimationData_MoveTo, CanvasAnimator_LineAnimationData_Fold } from "./objects/lineAnimations.js";
import { CanvasAnimator_CircleAnimationData_Draw, CanvasAnimator_CircleAnimationData_Grow, CanvasAnimator_CircleAnimationData_Fold, CanvasAnimator_CircleAnimationData_Dash, CanvasAnimator_CircleAnimationData_MoveTo, CanvasAnimator_CircleAnimator } from "./objects/circleAnimations.js";
import { CanvasAnimator_TextAnimationData_Draw, CanvasAnimator_TextAnimator, CanvasAnimator_TextAnimationData_Grow, CanvasAnimator_TextAnimationData_Fold, CanvasAnimator_TextAnimationData_MoveTo } from "./objects/textAnimations.js";
import { CanvasAnimator_RectAnimationData_Draw, CanvasAnimator_RectAnimator, CanvasAnimator_RectAnimationData_Grow, CanvasAnimator_RectAnimationData_Dash, CanvasAnimator_RectAnimationData_MoveTo } from "./objects/rectAnimations.js";
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
        this.createRectAnimation = {
            draw: this.createRectAnimationDraw,
            growFullControls: this.createRectAnimationGrowFull,
            growX: this.createRectAnimationGrowX,
            growY: this.createRectAnimationGrowY,
            growXY: this.createRectAnimationGrowXY,
            foldX: this.createRectAnimationFoldX,
            foldY: this.createRectAnimationFoldY,
            foldXY: this.createRectAnimationFoldXY,
            dash: this.createRectAnimationDash,
            moveTo: this.createRectAnimationMoveTo,
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
        const toRemove = [];
        for (let i = 0; i < this.animators.length; i++) {
            const el = this.animators[i];
            if (el.animate(this.ctx, this.startTime, time, interFrame))
                toRemove.push(el);
        }
        toRemove.forEach(el => {
            this.animators.splice(this.animators.indexOf(el), 1);
        });
        requestAnimationFrame(this.redrawAll.bind(this));
    }
    drawLine(sx, sy, ex, ey, countTimeFromNow, animation, styles) {
        if (animation == undefined || animation.length == 0)
            animation = [new CanvasAnimator_LineAnimationData_Draw(0)];
        if (styles == undefined)
            styles = () => { };
        countTimeFromNow = countTimeFromNow || false;
        this.animators.push(new CanvasAnimator_LineAnimator(this.pastTime, countTimeFromNow, sx, sy, ex, ey, styles, animation));
    }
    drawCircle(x, y, r, fill, countTimeFromNow, animation, styles) {
        if (animation == undefined || animation.length == 0)
            animation = [new CanvasAnimator_CircleAnimationData_Draw(0)];
        if (styles == undefined)
            styles = () => { };
        countTimeFromNow = countTimeFromNow || false;
        this.animators.push(new CanvasAnimator_CircleAnimator(this.pastTime, countTimeFromNow, x, y, r, fill, styles, animation));
    }
    drawText(x, y, text, countTimeFromNow, animation, styles) {
        if (animation == undefined || animation.length == 0)
            animation = [new CanvasAnimator_TextAnimationData_Draw(0)];
        if (styles == undefined)
            styles = () => { };
        countTimeFromNow = countTimeFromNow || false;
        this.animators.push(new CanvasAnimator_TextAnimator(this.pastTime, countTimeFromNow, x, y, text, styles, animation));
    }
    drawRect(x, y, width, height, countTimeFromNow, animation, styles) {
        if (animation == undefined || animation.length == 0)
            animation = [new CanvasAnimator_RectAnimationData_Draw(0)];
        if (styles == undefined)
            styles = () => { };
        countTimeFromNow = countTimeFromNow || false;
        this.animators.push(new CanvasAnimator_RectAnimator(this.pastTime, countTimeFromNow, x, y, width, height, styles, animation));
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
    createRectAnimationDraw(startTime, duraction) {
        return new CanvasAnimator_RectAnimationData_Draw(startTime, duraction);
    }
    createRectAnimationGrowFull(startTime, duraction, xAxis, toRight, reversX, yAxis, toTop, reversY) {
        return new CanvasAnimator_RectAnimationData_Grow(startTime, duraction, xAxis, toRight, reversX, yAxis, toTop, reversY);
    }
    createRectAnimationGrowX(startTime, duraction, toRight) {
        return new CanvasAnimator_RectAnimationData_Grow(startTime, duraction, true, toRight, false, false, false, false);
    }
    createRectAnimationGrowY(startTime, duraction, toTop) {
        return new CanvasAnimator_RectAnimationData_Grow(startTime, duraction, false, false, false, true, toTop, false);
    }
    createRectAnimationGrowXY(startTime, duraction, toRight, toTop) {
        return new CanvasAnimator_RectAnimationData_Grow(startTime, duraction, true, toRight, false, true, toTop, false);
    }
    createRectAnimationFoldX(startTime, duraction, toRight) {
        return new CanvasAnimator_RectAnimationData_Grow(startTime, duraction, true, toRight, true, false, false, false);
    }
    createRectAnimationFoldY(startTime, duraction, toTop) {
        return new CanvasAnimator_RectAnimationData_Grow(startTime, duraction, false, false, false, true, toTop, true);
    }
    createRectAnimationFoldXY(startTime, duraction, toRight, toTop) {
        return new CanvasAnimator_RectAnimationData_Grow(startTime, duraction, true, toRight, true, true, toTop, true);
    }
    createRectAnimationDash(startTime, dashSpeed, dashArray, duration) {
        return new CanvasAnimator_RectAnimationData_Dash(startTime, dashSpeed, dashArray, duration);
    }
    createRectAnimationMoveTo(startTime, duraction, x, y, width, height) {
        return new CanvasAnimator_RectAnimationData_MoveTo(startTime, duraction, x, y, width, height);
    }
}
