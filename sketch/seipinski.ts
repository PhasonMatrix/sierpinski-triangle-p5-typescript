class Dot {
    public x:number;
    public y:number;
    private c: p5.Color;
    private p:p5;
    private gfx:any; // actually a p5.Graphics off-screen image buffer, but typings are wrong

    constructor(x:number, y:number, p:p5, gfx:any){
            this.x = x;
            this.y = y;
            this.p = p;
            this.gfx = gfx;
            this.c = p.color(0, 255, 0);
        }

    draw = () => {
        this.gfx.stroke(this.c);
        this.gfx.point(this.x, this.y);
    }

    randomiseColour = () => {
        let rando: number = Math.floor(this.p.random(0, 6));
        switch (rando){
            case 0:
                this.c = this.p.color(255, 0, 0);
                break;
            case 1:
                this.c = this.p.color(0, 255, 0);
                break;
            case 2:
                this.c = this.p.color(0, 0, 255);
                break;
            case 3:
                this.c = this.p.color(0, 255, 255);
                break;
            case 4:
                this.c = this.p.color(255, 0, 255);
                break;
            case 5:
                this.c = this.p.color(255, 255, 0);
                break;
            default:
                this.c = this.p.color(255, 255, 255);
        }
        
    }
}
class CalcLine {
    private p:p5;
    private gfx:any;
    constructor(
        public xStart:number,
        public yStart:number,
        public xMid:number,
        public yMid:number,
        public xEnd:number,
        public yEnd:number,
        p:p5,
        gfx:any
        ){
            this.p = p;
            this.gfx = gfx;
            this.gfx.noFill();
            this.gfx.strokeWeight(2);
        }

    draw = () => {
        //this.gfx.stroke(255, 0, 0);
        //this.gfx.ellipse(this.xStart, this.yStart, 10, 10);
        this.gfx.stroke(235, 255 ,100);
        this.gfx.line(this.xStart, this.yStart, this.xMid, this.yMid);
        this.gfx.stroke(255, 0, 0);
        this.gfx.ellipse(this.xMid, this.yMid, 10, 10);
        this.gfx.stroke(0, 255, 255);
        this.gfx.line(this.xMid, this.yMid, this.xEnd, this.yEnd);
        this.gfx.stroke(0, 0, 255);
        this.gfx.ellipse(this.xEnd, this.yEnd, 10, 10);
    }
}

class SierpinskiTriangle {
    private p:p5; // for drawing to canvas
    private gfx1:any;//: p5.Graphics; // for permanent draw
    private gfx2:any;//: p5.Graphics; // for image buffer overlay
    private corners:Array<Dot> = new Array<Dot>();
    private calcLine:CalcLine; // for visualising the calculation of dot locations
    private dot:Dot;
    public showCalcLines: boolean;
    public randomiseColour: boolean; // yes that's british/australian spelling


    /**
     * Creates an instance of a Sierpinski Triangle
     * @param p a p5 object to use for drawing to the canvas
     * @param centreX 
     * @param centreY 
     * @param size distance from centre to corner of triangle
     */
    constructor(p:p5, centreX:number, centreY:number, size:number = 300){
        this.p = p;
        this.gfx1 = p.createGraphics(p.width, p.height);
        this.gfx2 = p.createGraphics(p.width, p.height);
        // calculate corner locations from size.
        this.corners.push(new Dot(centreX, centreY-size, this.p, this.gfx1));
        this.corners.push(new Dot(centreX + size * 0.866, centreY + size * 0.5, this.p, this.gfx1 )); // sin(30)=0.5, cos(30)=0.866
        this.corners.push(new Dot(centreX - size * 0.866, centreY + size * 0.5, this.p, this.gfx1 ));
    }

    public addDot = (x: number, y:number) => {
        //console.log(`Adding dot at (${x}, ${y})`);
        this.dot = new Dot(x, y, this.p, this.gfx1);
        this.calcLine = new CalcLine(0,0,0,0,0,0,this.p, this.gfx2);
    }

    public newDot = () => {
        if (this.dot != undefined){
            let prevX = this.dot.x;
            let prevY = this.dot.y;
            let rand = Math.floor(this.p.random(0, 3)); // random corner
            // calculate next dot
            let nextX = prevX + (this.corners[rand].x - prevX) / 2;
            let nextY = prevY + (this.corners[rand].y - prevY) / 2;
            this.dot = new Dot(nextX, nextY, this.p, this.gfx1);
            if(this.randomiseColour){
                this.dot.randomiseColour();
            }
            // add a calcLine 
            this.calcLine = new CalcLine(
                prevX, //start point
                prevY, 
                nextX, // mid point
                nextY,
                this.corners[rand].x, // end point
                this.corners[rand].y, 
                this.p,
                this.gfx2);
        }
    }
    
    public draw = () => {
        if (this.dot != undefined) {

            this.gfx1.fill(0, 0, 0, 1);
            if(new Date().getMilliseconds() % 2 == 0){ // only half the time
                this.gfx1.rect(0, 0, this.gfx1.width, this.gfx1.height); // fade older dots
            }

            this.dot.draw(); // dot draws to gfx1 buffer
            this.gfx2.clear();
            if(this.showCalcLines){
                this.calcLine.draw();
            }

            this.p.image(this.gfx1, 0, 0);
            this.p.image(this.gfx2, 0, 0);
        }
    }

    public clear = () => {
        this.gfx1.fill(0);
        this.gfx1.rect(0, 0, this.gfx1.width, this.gfx1.height);

    }


}