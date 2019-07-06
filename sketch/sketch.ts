
const sketch = (p: p5) => {

    let chkShowCalcLines:any; //p5.Element;
    let chkColourSelect:any; //p5.Element;
    let btnPause:any;
    let btnReset:any; //p5.Element; 
    let paragraph:any;
    let st:SierpinskiTriangle;
    let running:boolean = false;
    
    p.setup = () => {
        let canvas = p.createCanvas(400, 400);
        canvas.parent("canvasContainer");
        p.background(0);

        st = new SierpinskiTriangle(p, p.width/2, p.height*(3/5), 200);
        
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
        `)
       
        p.fill(0, 180, 0);
        p.textSize(16);
        p.textFont("monospace")
        p.text("Click anywhere to add the first dot.", 10, p.height/2);
    }

    p.draw = () => {
        st.showCalcLines = chkShowCalcLines.checked();
        st.randomiseColour = chkColourSelect.checked();
        if(running){
            st.draw();
            st.newDot();
        } 
        
    } 
    
    p.mousePressed = () => {
        if(!running){
            if(
                p.mouseX > 0 && 
                p.mouseX <= p.width &&
                p.mouseY > 0 &&
                p.mouseY <= p.height
                ){
                st.addDot(p.mouseX, p.mouseY);
                running = true; // prevent user from adding dots while running
            }
        } 
    }

}

const sketchP = new p5(sketch);