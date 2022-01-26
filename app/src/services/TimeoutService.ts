class TimeoutService {

    timerS: number = 0;
    callbacks: Array<CallableFunction> = [];
    timerId: NodeJS.Timeout | null = null;

    constructor(s: number) {
        this.registerEventHandlers();
        this.timerS = s;
    }

    registerCallback(callback: CallableFunction): void {
        this.callbacks.push(callback);
    }

    timeOut(): void {
        if (this.timerId !== null) {
            clearTimeout(this.timerId);
        }

        for (const callback of this.callbacks) {
            callback();
        }
    }

    registerEventHandlers(): void {
        document.documentElement.addEventListener(
            "mousemove",
            this.handleEvent.bind(this),
            true
        );
        document.documentElement.addEventListener(
            "touchmove",
            this.handleEvent.bind(this),
            true
        );
        document.documentElement.addEventListener(
            "mousedown",
            this.handleEvent.bind(this),
            true
        );
        document.documentElement.addEventListener(
            "touchstart",
            this.handleEvent.bind(this),
            true
        );
        document.documentElement.addEventListener("mouseup", this.handleEvent.bind(this), true);
        document.documentElement.addEventListener("touchend", this.handleEvent.bind(this), true);
    }

    handleEvent(): void {
        if (this.timerId !== null) {
            clearTimeout(this.timerId);
        }
        this.timerId = setTimeout(this.timeOut.bind(this), this.timerS * 1000);
    }
}

export default new TimeoutService(120);