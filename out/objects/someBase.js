export class CanvasAnimator_Animator {
    constructor(startTime, cuculateTimeFromElementCreating) {
        this.startTime = startTime;
        this.calculateTimeFromElementCreating = cuculateTimeFromElementCreating;
    }
}
export function logStart(name, elStartTime, time, startTime, elStartTimeReal) {
    // console.group("%cstarted%c: " + name, "color: green", "", "color: gold");
    console.groupCollapsed("%cstarted%c: " + name, "color: green", "", "color: gold");
    if (elStartTimeReal == undefined)
        console.log("el.startTime: " + elStartTime);
    else {
        console.log("el.startTime: " + elStartTime);
        console.log("el.startTime real: " + elStartTimeReal);
    }
    console.log(`current time: ${time - startTime}`);
    console.groupEnd();
}
export function logEnd(name, time, startTime) {
    // console.group("%cended%c: " + name, "color: red", "", "color: gold");
    console.groupCollapsed("%cended%c: " + name, "color: red", "", "color: gold");
    console.log(`current time: ${time - startTime}`);
    console.groupEnd();
}
