const Hammer = require('hammerjs');

export default class InputHandlerService {

    inputManager: any;
    panInputManager: any;

    constructor(elements: any) {
        this.inputManager = new Hammer.Manager(elements);
        this.inputManager.add(new Hammer.Swipe());
        this.inputManager.add(new Hammer.Press());
        this.inputManager.add(new Hammer.Tap());

        this.panInputManager = new Hammer.Manager(elements);
        this.panInputManager.add(new Hammer.Pan());
    }

    onPan(callback: CallableFunction): void {
        this.panInputManager.on('pan', function (e: any) {
            callback(e);
        });
    }

    onSwipeLeft(callback: CallableFunction): void {
        this.inputManager.on('swipe', function (e: any) {
            if (e.offsetDirection === 4) {
                callback();
            }
        });
    }

    onSwipeRight(callback: CallableFunction): void {
        this.inputManager.on('swipe', function (e: any) {
            //console.log(e.deltaX);
            if (e.offsetDirection === 2) {
                callback();
            }
        });
    }

    onSelectItem(callback: CallableFunction): void {
        this.inputManager.on('press', function (e: any) {
            const id = e.srcEvent?.target?.getAttribute('data-item-id') || null;
            if (id !== null) {
                callback(id);
            }
        });

        this.inputManager.on('tap', function (e: any) {
            const id = e.srcEvent?.target?.getAttribute('data-item-id') || null;
            if (id !== null) {
                callback(id);
            }
        });
    }
}
