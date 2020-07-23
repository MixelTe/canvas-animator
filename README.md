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


# Animation
## Add animation
``` ts
const lineAnimation  = canvasAnimator.createLineAnimation.[animation]
canvasAnimator.drawLine(startX: number, startY: number, endX: number, enxY: number, countTimeFromNow: boolean, animations: lineAnimation[]);

const circleAnimation  = canvasAnimator.createCircleAnimation.[animation]
canvasAnimator.drawCircle(x: number, y: number, radius: number, fill: boolean, countTimeFromNow: boolean, animations: circleAnimation[]);

const textAnimation  = canvasAnimator.createTextAnimation.[animation]
canvasAnimator.drawText(x: number, y: number, text: string, countTimeFromNow: boolean, animations: textAnimation[]);
```
if countTimeFromNow is true zero time for animations will be when you call draw function

if countTimeFromNow is false zero time for animations will be when you create canvasAnimator


## Animations
### Grow animation
``` ts
const animation  = canvasAnimator.create[Line/Circle/Text]Animation.grow(startTime: number, duraction: number));
```
### Fold animation
``` ts
const animation  = canvasAnimator.create[Line/Circle/Text]Animation.fold(startTime: number, duraction: number));
```
### Dash animation
``` ts
const animation  = canvasAnimator.create[Line/Circle/Text]Animation.dash(startTime: number, dashSpeed: number, dashArray: number[], duration?: number));
```
dashSpeed: X/100px per ms

duration: infinite if undefined or less than zero

### Only draw without animation
``` ts
const animation  = canvasAnimator.create[Line/Circle/Text]Animation.draw(startTime: number, duraction?: number));
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

# Drawing style
## Add style
``` ts
canvasAnimator.drawLine(startX: number, startY: number, endX: number, enxY: number, animations: lineAnimation[], styles: (ctx: CanvasRenderingContext2D) => void);

canvasAnimator.drawCircle(x: number, y: number, radius: number, fill: boolean, animations: circleAnimation[], styles: (ctx: CanvasRenderingContext2D) => void);

canvasAnimator.drawText(x: number, y: number, text: string, animations: textAnimation[], styles: (ctx: CanvasRenderingContext2D) => void);
```

## Write style function
``` ts
function setStyle(ctx: CanvasRenderingContext2D) {
	//set any styles
	//for example:
	ctx.strokeStyle = "blue";
}
```

# Working examples
## example 1
``` ts
const canvas = getCanvas("canvas");
const ctx = getCanvasContext(canvas);
const canvasAnimator = new CanvasAnimator(ctx, canvas.width, canvas.height);

canvasAnimator.drawLine(0, 0, 500, 500);
canvasAnimator.drawCircle(100, 100, 50, false);
canvasAnimator.drawText(100, 100, "Hellow world");
```
## example 2
``` ts
const canvas = getCanvas("canvas");
const ctx = getCanvasContext(canvas);
const canvasAnimator = new CanvasAnimator(ctx, canvas.width, canvas.height);

canvasAnimator.drawLine(50, 100, 300, 300, [
	canvasAnimator.createLineAnimation.dash(500, 20, [20, 40]),
	canvasAnimator.createLineAnimation.grow(0, 500),
	canvasAnimator.createLineAnimation.moveTo(0, 1000, 300, 50, 100, 300),
	canvasAnimator.createLineAnimation.draw(0, 500),
	canvasAnimator.createLineAnimation.fold(0, 500),
]);
```
## example 4
``` ts
const canvas = getCanvas("canvas");
const ctx = getCanvasContext(canvas);
const canvasAnimator = new CanvasAnimator(ctx, canvas.width, canvas.height);

canvasAnimator.drawCircle(100, 100, 50, true, [
	canvasAnimator.createCircleAnimation.grow(0, 2000, -90, true),
	canvasAnimator.createCircleAnimation.draw(0, 500),
	canvasAnimator.createCircleAnimation.moveTo(0, 500, 100, 100, 70),
	canvasAnimator.createCircleAnimation.draw(0, 500),
	canvasAnimator.createCircleAnimation.fold(0, 2000, -90),
]);
```
## example 5
``` ts
const canvas = getCanvas("canvas");
const ctx = getCanvasContext(canvas);
const canvasAnimator = new CanvasAnimator(ctx, canvas.width, canvas.height);

canvasAnimator.drawText(100, 100, "Hellow world", [
	canvasAnimator.createTextAnimation.grow(0, 1000),
	canvasAnimator.createTextAnimation.draw(0, 500),
	canvasAnimator.createTextAnimation.moveTo(0, 1000, 300, 200),
	canvasAnimator.createTextAnimation.draw(0, 500),
	canvasAnimator.createTextAnimation.fold(0, 1000),
]);
```

## example 6
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
canvasAnimator.drawLine(50, 50, 200, 250, [], setStyle);
```