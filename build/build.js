class Dot {
    constructor(x, y, p, gfx) {
        this.draw = () => {
            this.gfx.stroke(this.c);
            this.gfx.point(this.x, this.y);
        };
        this.randomiseColour = () => {
            let rando = Math.floor(this.p.random(0, 6));
            switch (rando) {
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
        };
        this.x = x;
        this.y = y;
        this.p = p;
        this.gfx = gfx;
        this.c = p.color(0, 255, 0);
    }
}
class CalcLine {
    constructor(xStart, yStart, xMid, yMid, xEnd, yEnd, p, gfx) {
        this.xStart = xStart;
        this.yStart = yStart;
        this.xMid = xMid;
        this.yMid = yMid;
        this.xEnd = xEnd;
        this.yEnd = yEnd;
        this.draw = () => {
            //this.gfx.stroke(255, 0, 0);
            //this.gfx.ellipse(this.xStart, this.yStart, 10, 10);
            this.gfx.stroke(235, 255, 100);
            this.gfx.line(this.xStart, this.yStart, this.xMid, this.yMid);
            this.gfx.stroke(255, 0, 0);
            this.gfx.ellipse(this.xMid, this.yMid, 10, 10);
            this.gfx.stroke(0, 255, 255);
            this.gfx.line(this.xMid, this.yMid, this.xEnd, this.yEnd);
            this.gfx.stroke(0, 0, 255);
            this.gfx.ellipse(this.xEnd, this.yEnd, 10, 10);
        };
        this.p = p;
        this.gfx = gfx;
        this.gfx.noFill();
        this.gfx.strokeWeight(2);
    }
}
class SierpinskiTriangle {
    /**
     * Creates an instance of a Sierpinski Triangle
     * @param p a p5 object to use for drawing to the canvas
     * @param centreX
     * @param centreY
     * @param size distance from centre to corner of triangle
     */
    constructor(p, centreX, centreY, size = 300) {
        this.corners = new Array();
        this.addDot = (x, y) => {
            //console.log(`Adding dot at (${x}, ${y})`);
            this.dot = new Dot(x, y, this.p, this.gfx1);
            this.calcLine = new CalcLine(0, 0, 0, 0, 0, 0, this.p, this.gfx2);
        };
        this.newDot = () => {
            if (this.dot != undefined) {
                let prevX = this.dot.x;
                let prevY = this.dot.y;
                let rand = Math.floor(this.p.random(0, 3)); // random corner
                // calculate next dot
                let nextX = prevX + (this.corners[rand].x - prevX) / 2;
                let nextY = prevY + (this.corners[rand].y - prevY) / 2;
                this.dot = new Dot(nextX, nextY, this.p, this.gfx1);
                if (this.randomiseColour) {
                    this.dot.randomiseColour();
                }
                // add a calcLine 
                this.calcLine = new CalcLine(prevX, //start point
                prevY, nextX, // mid point
                nextY, this.corners[rand].x, // end point
                this.corners[rand].y, this.p, this.gfx2);
            }
        };
        this.draw = () => {
            if (this.dot != undefined) {
                this.gfx1.fill(0, 0, 0, 1);
                if (new Date().getMilliseconds() % 2 == 0) { // only half the time
                    this.gfx1.rect(0, 0, this.gfx1.width, this.gfx1.height); // fade older dots
                }
                this.dot.draw(); // dot draws to gfx1 buffer
                this.gfx2.clear();
                if (this.showCalcLines) {
                    this.calcLine.draw();
                }
                this.p.image(this.gfx1, 0, 0);
                this.p.image(this.gfx2, 0, 0);
            }
        };
        this.clear = () => {
            this.gfx1.fill(0);
            this.gfx1.rect(0, 0, this.gfx1.width, this.gfx1.height);
        };
        this.p = p;
        this.gfx1 = p.createGraphics(p.width, p.height);
        this.gfx2 = p.createGraphics(p.width, p.height);
        // calculate corner locations from size.
        this.corners.push(new Dot(centreX, centreY - size, this.p, this.gfx1));
        this.corners.push(new Dot(centreX + size * 0.866, centreY + size * 0.5, this.p, this.gfx1)); // sin(30)=0.5, cos(30)=0.866
        this.corners.push(new Dot(centreX - size * 0.866, centreY + size * 0.5, this.p, this.gfx1));
    }
}
const sketch = (p) => {
    let chkShowCalcLines; //p5.Element;
    let chkColourSelect; //p5.Element;
    let btnPause;
    let btnReset; //p5.Element; 
    let paragraph;
    let st;
    let running = false;
    p.setup = () => {
        let canvas = p.createCanvas(400, 400);
        canvas.parent("canvasContainer");
        p.background(0);
        st = new SierpinskiTriangle(p, p.width / 2, p.height * (3 / 5), 200);
        // add some controls
        chkShowCalcLines = p.createCheckbox("Show Calulation Lines", true);
        chkColourSelect = p.createCheckbox("Random coloured dots", false);
        btnReset = p.createButton("Reset");
        btnPause = p.createButton("Pause/Start");
        btnReset.mousePressed(() => {
            running = false;
            st.clear();
            p.background(0);
        });
        btnPause.mousePressed(() => {
            running = !running;
        });
        paragraph = p.createP(`
        <pre>
        Algorithm:
            1. Start with a random point.
            2. Randomly select on of the corners of the trianle
            3. Half way between the point and the corner, draw a new point
            4. GOTO step 2 starting from this new point
        </pre>
        `);
        p.fill(0, 180, 0);
        p.textSize(16);
        p.textFont("monospace");
        p.text("Click anywhere to add the first dot.", 10, p.height / 2);
    };
    p.draw = () => {
        st.showCalcLines = chkShowCalcLines.checked();
        st.randomiseColour = chkColourSelect.checked();
        if (running) {
            st.draw();
            st.newDot();
        }
    };
    p.mousePressed = () => {
        if (!running) {
            if (p.mouseX > 0 &&
                p.mouseX <= p.width &&
                p.mouseY > 0 &&
                p.mouseY <= p.height) {
                st.addDot(p.mouseX, p.mouseY);
                running = true; // prevent user from adding dots while running
            }
        }
    };
};
const sketchP = new p5(sketch);
//# sourceMappingURL=build.js.map