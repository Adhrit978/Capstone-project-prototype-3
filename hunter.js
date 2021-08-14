class Hunter {
    constructor(x, y, w, h) {
        this.width=w;
        this.height=h;

        this.image=loadImage("hunter.png");

        this.body=Bodies.rectangle(x, y, this.width, this.height);

        World.add(world, this.body);
    }

    display() {
        var pos=this.body.position;
        var angle=this.body.angle;
        
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        imageMode(CENTER);
        image(this.image, 0, 0, this.width, this.height);
        pop();
    }

    move() {
        Matter.Body.setVelocity(this.body, {x:-5, y:-0.3});
    }
}