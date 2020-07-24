# Canvas animator
# How to start

create instance of class

``` ts
const canvasAnimator = new CanvasAnimator(ctx: CanvasRenderingContext2D, drawZoneWidth: number, drawZoneHeight: number);

```

# Drawing
## Draw line

``` ts
canvasAnimator.drawLine(startX: number, startY: number, endX: number, enxY: number);
```

## Draw circle

``` ts
canvasAnimator.drawCircle(x: number, y: number, radius: number, fill: boolean);
```

## Draw text

``` ts
canvasAnimator.drawText(x: number, y: number, text: string);
```

## Draw rect

``` ts
canvasAnimator.drawRect(x: number, y: number, width: number, height: number);
```

# Animation
## Add animation
``` ts
const lineAnimation  = canvasAnimator.createLineAnimation.[animation]
canvasAnimator.drawLine(startX: number, startY: number, endX: number, enxY: number, countTimeFromNow: boolean, animations: lineAnimation[]);

const circleAnimation  = canvasAnimator.createCircleAnimation.[animation]
canvasAnimator.drawCircle(x: number, y: number, radius: number, fill: boolean, countTimeFromNow: boolean, animations: circleAnimation[]);

const textAnimation  = canvasAnimator.createTextAnimation.[animation]
canvasAnimator.drawText(x: number, y: number, text: string, countTimeFromNow: boolean, animations: textAnimation[]);

const rectAnimation  = canvasAnimator.createRectAnimation.[animation]
canvasAnimator.drawRect(x: number, y: number, width: number, height: number, countTimeFromNow: boolean, animations: rectAnimation[]);
```
if countTimeFromNow is true, zero time for animations will be when the draw function is called

if countTimeFromNow is false, zero time for animations will be when the canvasAnimator is created


## Animations
### Grow animation
``` ts
// for line, circle or text
const animation  = canvasAnimator.create[Line/Circle/Text]Animation.grow(startTime: number, duraction: number));

// for rect
const animation  = canvasAnimator.createRectAnimation.growX(startTime: number, duraction: number, toRight: boolean)
const animation  = canvasAnimator.createRectAnimation.growY(startTime: number, duraction: number, toTop: boolean)
const animation  = canvasAnimator.createRectAnimation.growXY(startTime: number, duraction: number, toRight: boolean, toTop: boolean)
```
### Fold animation
``` ts
// for line, circle or text
const animation  = canvasAnimator.create[Line/Circle/Text]Animation.fold(startTime: number, duraction: number));

// for rect
const animation  = canvasAnimator.createRectAnimation.foldX(startTime: number, duraction: number, toRight: boolean)
const animation  = canvasAnimator.createRectAnimation.foldY(startTime: number, duraction: number, toTop: boolean)
const animation  = canvasAnimator.createRectAnimation.foldXY(startTime: number, duraction: number, toRight: boolean, toTop: boolean)
```
### Dash animation
``` ts
const animation  = canvasAnimator.create[Line/Circle/Rect]Animation.dash(startTime: number, dashSpeed: number, dashArray: number[], duration?: number));
```
dashSpeed: X/100px per ms

duration: infinite if undefined or less than zero

### Only draw without animation
``` ts
const animation  = canvasAnimator.create[Line/Circle/Text/Rect]Animation.draw(startTime: number, duraction?: number));
```
duration: infinite if undefined or less than zero

### Move animation
line:
``` ts
const animation  = canvasAnimator.createLineAnimation.moveTo(startTime: number, duraction: number, sx: number, sy: number, ex: number, ey: number));
```
circle:
``` ts
const animation  = canvasAnimator.createCircleAnimation.moveTo(startTime: number, duraction: number, x: number, y: number, radius: number));
```
text:
``` ts
const animation  = canvasAnimator.createTextAnimation.moveTo(startTime: number, duraction: number, x: number, y: number));
```
rect:
``` ts
const animation  = canvasAnimator.createRectAnimation.moveTo(startTime: number, duraction: number, x: number, y: number, width: number, height: number));
```

# Drawing style
## Add style
``` ts
canvasAnimator.drawLine(startX: number, startY: number, endX: number, enxY: number, countTimeFromNow: boolean, animations: lineAnimation[], styles: (ctx: CanvasRenderingContext2D) => void);

canvasAnimator.drawCircle(x: number, y: number, radius: number, fill: boolean, countTimeFromNow: boolean, animations: circleAnimation[], styles: (ctx: CanvasRenderingContext2D) => void);

canvasAnimator.drawText(x: number, y: number, text: string, countTimeFromNow: boolean, animations: textAnimation[], styles: (ctx: CanvasRenderingContext2D) => void);

canvasAnimator.drawRect(x: number, y: number, width: number, height: number, countTimeFromNow: boolean, animations: rectAnimation[], styles: (ctx: CanvasRenderingContext2D) => void);
```

## Write style function
``` ts
function setStyle(ctx: CanvasRenderingContext2D) {
	//set any styles
	//for example:
	ctx.strokeStyle = "blue";
}
```
## Background color
``` ts
canvasAnimator.setBackgroundColor(color: string);
```

# Working examples
## simple drawing
``` ts
const canvas = getCanvas("canvas");
const ctx = getCanvasContext(canvas);
const canvasAnimator = new CanvasAnimator(ctx, canvas.width, canvas.height);

canvasAnimator.drawLine(0, 0, 250, 250);
canvasAnimator.drawCircle(100, 100, 50, false);
canvasAnimator.drawText(100, 100, "Hellow world");
canvasAnimator.drawRect(20, 40, 200, 120);
```
## animate line
``` ts
const canvas = getCanvas("canvas");
const ctx = getCanvasContext(canvas);
const canvasAnimator = new CanvasAnimator(ctx, canvas.width, canvas.height);

canvasAnimator.drawLine(50, 100, 300, 300, true, [
	canvasAnimator.createLineAnimation.dash(500, 20, [20, 40]),
	canvasAnimator.createLineAnimation.grow(0, 500),
	canvasAnimator.createLineAnimation.moveTo(0, 1000, 300, 50, 100, 300),
	canvasAnimator.createLineAnimation.draw(0, 500),
	canvasAnimator.createLineAnimation.fold(0, 500),
]);
```
## animate circle
``` ts
const canvas = getCanvas("canvas");
const ctx = getCanvasContext(canvas);
const canvasAnimator = new CanvasAnimator(ctx, canvas.width, canvas.height);

canvasAnimator.drawCircle(100, 100, 50, true, true, [
	canvasAnimator.createCircleAnimation.grow(0, 2000, -90, true),
	canvasAnimator.createCircleAnimation.draw(0, 500),
	canvasAnimator.createCircleAnimation.moveTo(0, 500, 100, 100, 70),
	canvasAnimator.createCircleAnimation.draw(0, 500),
	canvasAnimator.createCircleAnimation.fold(0, 2000, -90),
]);
```
## animate text
``` ts
const canvas = getCanvas("canvas");
const ctx = getCanvasContext(canvas);
const canvasAnimator = new CanvasAnimator(ctx, canvas.width, canvas.height);

canvasAnimator.drawText(100, 100, "Hellow world", true, [
	canvasAnimator.createTextAnimation.grow(0, 1000),
	canvasAnimator.createTextAnimation.draw(0, 500),
	canvasAnimator.createTextAnimation.moveTo(0, 1000, 300, 200),
	canvasAnimator.createTextAnimation.draw(0, 500),
	canvasAnimator.createTextAnimation.fold(0, 1000),
]);
```
## animate rect
``` ts
const canvas = getCanvas("canvas");
const ctx = getCanvasContext(canvas);
const canvasAnimator = new CanvasAnimator(ctx, canvas.width, canvas.height);

canvasAnimator.drawRect(20, 20, 150, 100, true, [
	canvasAnimator.createRectAnimation.growX(0, 1000, true),
	canvasAnimator.createRectAnimation.draw(0, 250),
	canvasAnimator.createRectAnimation.moveTo(0, 1000, 50, 50, 200, 150),
	canvasAnimator.createRectAnimation.draw(0, 250),
	canvasAnimator.createRectAnimation.foldXY(0, 1000, true, true),
]);
```

## set style
``` ts
const canvas = getCanvas("canvas");
const ctx = getCanvasContext(canvas);
const canvasAnimator = new CanvasAnimator(ctx, canvas.width, canvas.height);

function setStyle(ctx: CanvasRenderingContext2D)
{
	ctx.strokeStyle = "blue";
	ctx.lineWidth = 2;
	ctx.shadowBlur = 5;
	ctx.shadowColor = "black";
	ctx.shadowOffsetX = 5;
	ctx.shadowOffsetY = 5;
}
canvasAnimator.drawLine(50, 50, 200, 250, true, [], setStyle);
```

## draw filled rect
``` ts
const canvas = getCanvas("canvas");
const ctx = getCanvasContext(canvas);
const canvasAnimator = new CanvasAnimator(ctx, canvas.width, canvas.height);

function setStyle(ctx: CanvasRenderingContext2D)
{
	ctx.fillStyle = "blue";
}
canvasAnimator.drawRect(20, 20, 100, 100, true, [], setStyle);
```