export class CanvasAnimator_Animator {
}
export function logStart(name, elStartTime, time, startTime) {
    console.group("%cstarted%c: " + name, "color: green", "", "color: gold");
    console.log("el.startTime: " + elStartTime);
    console.log(`current time: ${time - startTime}`);
    console.groupEnd();
}
export function logEnd(name, time, startTime) {
    console.group("%cended%c: " + name, "color: red", "", "color: gold");
    console.log(`current time: ${time - startTime}`);
    console.groupEnd();
}
