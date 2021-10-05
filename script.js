let c = document.getElementById("canvas");
let ctx = c.getContext("2d");

class Point{
    constructor(x, y, val){
        this.x = x;
        this.y = y;
        this.val = val
    }

    draw(r){
        ctx.beginPath();
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctx.fillStyle = "cyan";
        ctx.fill();
    }
}


let width = ctx.canvas.width;
let height = ctx.canvas.height;

let points = [];

function setup() {
    let ammount = 4
    for(let i = 0; i < ammount; i++){
        points.push(new Point
            (
                ((width - (width/ammount))/ammount) * (i+1),
                (Math.random()*(height-20)) + 10,
                i+1
            )     
        )
    }
    draw();
}

function draw() {
    ctx.clearRect(0, 0, width, height);
    for(let p of points){
        p.draw(10);
    }

    for (let i = 0; i < 1.0001; i+=.01){
        spline(i, points).draw(1);; 
    }
}



function lerp(val, p1, p2) {
    let x = p1.x + (p2.x - p1.x) * val
    let y = p1.y + (p2.y - p1.y) * val
    return new Point(x, y)
}

function quadratic(val, p1, p2, p3){
    let x = lerp(val, p1, p2)
    let y = lerp(val, p2, p3)
    let l = lerp(val, x, y)
    return new Point(l.x, l.y)
}

function cubic(val, p1, p2, p3, p4) {
    let x = quadratic(val, p1, p2, p3)
    let y = quadratic(val, p2, p3, p4)

    // let x = lerp(val, 
    //             lerp(val, p1, p2, p3),
    //             lerp(val, p2, p3, p4)
    // )

    let l = lerp(val, x, y)
    return new Point(l.x, l.y)
}

function quartic(val, p1, p2, p3, p4, p5) {
    let x = cubic(val, p1, p2, p3, p4)
    let y = cubic(val, p2, p3, p4, p5)

    // let x = lerp( val, 
    //             lerp( val, 
    //                 lerp( val, p1, p2 ),  
    //                 lerp( val, p2, p3)) ,
    //             lerp( val, 
    //                 lerp( val, p3, p4 ),  
    //                 lerp( val, p4, p5))
    // )

    let l = lerp(val, x, y)
    return new Point(l.x, l.y)
}

function spline(val, points) {
    
    if(points.length == 2){
        return lerp(val, points[0], points[1])
    }

    let start = points.slice(0, points.length - 1);
    let stop = points.slice(1, points.length);
    let x = spline(val, start)
    let y = spline(val, stop)
    let l = lerp(val, x, y);
    return new Point(l.x, l.y);
     
}
