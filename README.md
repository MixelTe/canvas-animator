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

# Animation
## Line animation
``` ts
const animation  = canvasAnimator.createLineAnimation
canvasAnimator.drawLine(startX: number, startY: number, endX: number, enxY: number, animations: animation[]);
```

### Grow animation
``` ts
const animation  = canvasAnimator.createLineAnimation.grow(startTime: number, duraction: number));
```
### Fold animation
``` ts
const animation  = canvasAnimator.createLineAnimation.fold(startTime: number, duraction: number));
```
### Dash animation
``` ts
const animation  = canvasAnimator.createLineAnimation.grow(startTime: number, dashSpeed: number, fillLenght: number, spaceLenght: number, duration?: number));
```
dashSpeed: X/100px per ms

duration: infinite if undefined or less than zero

### Only draw without animation
``` ts
const animation  = canvasAnimator.createLineAnimation.dash(growTime: number, duraction?: number));
```
duration: infinite if undefined or less than zero

### Move animation
``` ts
const animation  = canvasAnimator.createLineAnimation.moveTo(startTime: number, duraction: number, sx: number, sy: number, ex: number, ey: number));
```