
export default class ElementTransform {
    left: number | null;
    top: number | null;
    width: number | null;
    height: number | null;
    angle: number | null;

    constructor(params: Partial<ElementTransform>) {
        this.left = params?.left || null;
        this.top = params?.top || null;
        this.width = params?.width || null;
        this.height = params?.height || null;
        this.angle = params?.angle || null;
    }

    getAsStyle(): any {
        return {
            left: this.getPixelValue(this.left),
            top: this.getPixelValue(this.top),
            width: this.getPixelValue(this.width),
            height: this.getPixelValue(this.height),
            transform: this.getAngleTransformValue(this.angle),
        };
    }

    getPixelValue(val: number | null): string | null {
        return  val ? val + 'px' : null;
    }

    getAngleTransformValue(val: number | null): string | null {
        return  val ? 'rotate(' + val + 'deg)' : null;
    }
};