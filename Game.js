const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

function sizes(figure1, figure2) {
    const rightestStart = Math.max(figure1._x, figure2._x);
    const leftestEnd = Math.min(figure1._x + figure1._width, figure2._x + figure2._width);
    const hightestStart = Math.max(figure1._y, figure2._y);
    const lowestEnd  = Math.min(figure1._y + figure1._height, figure2._y + figure2._height);
    return (rightestStart <= leftestEnd && hightestStart <= lowestEnd);
}

function gameOver(score) {
    document.body.style.backgroundColor = "yellow";
    let over = document.createElement("div");
    over.style.width = "250px";
    over.style.height = "150px";
    over.style.backgroundColor = "red";
    over.style.position = `absolute`;
    over.style.top = "50%";
    over.style.right = "50%";
    

    over.innerHTML = `<h1>Game Over</h1> <br> <p><b>your score is ${score}</b></p>`;
    
    canvas.remove();
    if(!(document.body.hasAttribute("div"))) { 
    document.body.append(over);
    }
    let button = document.createElement("button");
    button.innerHTML = "<p><b> Try Again </b></p>"
    button.style.width = "100px";
    button.style.height = "50px";
    button.style.backgroundColor = "green";
    button.style.top = "40%";
    button.style.position = "absolute";
    button.style.right = "20%";
    button.onclick = function() {
        over.remove();
        location.reload(true);
    }
    over.appendChild(button);
}

class GameObj {
    constructor(y) {
        this._y = y;
        this._img = document.createElement("img");
        this._speed = 0;
    }
    draw() {
        context.drawImage(this._img, this._x, this._y, this._width, this._height);
    }
    update() {
        this._y += this._speed;
    }
    go() {
        this._speed = 5;
    }
    stop() {
        this._speed = 0;
    }
}

class Argelq extends GameObj {
    constructor (y) {
        super(y);
        this._x = Math.random()*10 - 5 > 0? canvas.width/3 - 100: 2*canvas.width/3 +100;
        this._height = 70;
        this._width = 70;
        this._img1 = document.createElement("img");
        this._img1.src = "https://opengameart.org/sites/default/files/tree_cartoon_big.png";
        this._img2 = document.createElement("img");
        this._img2.src = "https://i.pinimg.com/originals/4d/40/db/4d40dbef4879e329e9e9309ca3320470.png";
        this._img = Math.random()*10 - 5 > 0? this._img1: this._img2;
        this._speed = 0;
    }
    
}

class road extends GameObj {
    constructor(y, speed) {
        super(y);
        this._x = canvas.width/3;
        this._width = canvas.width/3;
        this._height = canvas.height;
        this._img = document.createElement("img");
        this._img.src = "https://i.stack.imgur.com/rUzr3.png"; 
        this._speed = speed;
    }
}

class Car extends GameObj {
    constructor(y) {
        super(y);
        this.rand = Math.random()*5;
        this._x = (this.rand > 0 && this.rand <= 1) ? 430 : (this.rand > 1 && this.rand <= 2) ? 530 : (this.rand > 2 && this.rand <= 3) ? 640: 730;
        this._height = 130;
        this._width = 60;
        this._img = document.createElement("img");
        this._img.src = "car.png";
        this._speed = 0;
    }
    go() {
        this._speed = 10;
    }
}

class Hero extends GameObj{
    constructor() {
        super();
        this._x = canvas.width/2;
        this._y = canvas.height - 150;
        this._width = 60;
        this._height = 130;
        this._img.src = "y6HviX.png";
        this._sideSpeed = 0;
    }
    update() {
        this._x += this._sideSpeed;
    }
    goLeft() {
        this._sideSpeed = -10;
    }
    goRight() {
        this._sideSpeed = 10;
    }
    stop() {
        this._sideSpeed = 0;
    }
}

let score = 0;


let data = {
    roads: [new road(0, 5)],
    cars: [new Car(-130)],
    args: [new Argelq(-50)],
    hero: new Hero()
};



function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "green";
    context.fillRect(0, 0, canvas.width ,canvas.height);
    context.fillStyle = "grey";
    context.fillRect(canvas.width - canvas.width/6, 0 ,canvas.width/6, canvas.height);
    context.fillStyle = "grey";
    context.fillRect(0, 0, canvas.width/6, canvas.height);
    context.font = "20px arial";
    context.fillStyle = "black";
    context.fillText(`${score}`, 20, 20);
    
    data.roads.forEach((obj) => {obj.draw()});
    data.args.forEach((obj) => {obj.draw()});
    data.cars.forEach((obj) => {obj.draw()});
    data.hero.draw();
}

function update() {
    data.roads.forEach((obj) => {obj.update()});
    data.args.forEach((obj) => {obj.update()});
    data.cars.forEach((obj) => {obj.update()});
    data.hero.update();

    if(data.roads.length > 2) {
        data.roads.shift();
    }
    if(data.args.length > 7) {
        data.args.shift();
    }

    if(data.roads[data.roads.length - 1]._y >= 0) {
        data.roads.push(new road(data.roads[data.roads.length - 1]._y - data.roads[data.roads.length - 1]._height + 10, 5));
    } 
    if(data.args[data.args.length - 1]._y >= 0) {
        data.args.push(new Argelq(-canvas.height/6));
    } 

    if(data.cars.length > 4) {
        data.cars.shift();
    }

    if(data.cars.length != 0)
     {if(data.cars[data.cars.length - 1]._y >= 0) {
        data.cars.push(new Car(-canvas.height/3));
    }} 
    data.cars.forEach((car) => {
        if(sizes(car, data.hero)) {
            data.roads.forEach((obj) => obj.stop());
            data.args.forEach((obj) => obj.stop());
            data.cars.forEach((obj) => obj.stop());
            data.cars.shift();
            gameOver(score);
        }
    });
    if(data.hero._x < canvas.width/3 || data.hero._x + data.hero._width > 2*canvas.width/3) {
        data.roads.forEach((obj) => obj.stop());
        data.args.forEach((obj) => obj.stop());
        data.cars.forEach((obj) => obj.stop());
        data.cars.shift();
        debugger;
        gameOver(score);

    }
}

function loop() {
    requestAnimationFrame(loop);
    update();
    draw();
}
loop();

let ans = confirm("Are you ready motherfucker??")

if(ans == true) {
    data.roads.forEach((obj) => obj.go());
    data.args.forEach((obj) => obj.go());
    data.cars.forEach((obj) => obj.go());
} else {
    data.roads.forEach((obj) => {obj.stop()});
    data.args.forEach((obj) => {obj.stop()});
}

document.addEventListener("keydown", (ev) => {
    if(ev.code == "ArrowUp") {
        data.roads.forEach((obj) => obj.go());
        data.args.forEach((obj) => obj.go());
        data.cars.forEach((obj) => obj.go());
        score += 2;
    } 
    if(ev.code == "ArrowLeft") {
         data.hero.goLeft();
         if(ev.code == "ArrowUp") {
            data.roads.forEach((obj) => obj.go());
            data.args.forEach((obj) => obj.go());
            data.cars.forEach((obj) => obj.go());
        } 
         
    } else if(ev.code == "ArrowRight") {
         data.hero.goRight();
         if(ev.code == "ArrowUp") {
            data.roads.forEach((obj) => obj.go());
            data.args.forEach((obj) => obj.go());
            data.cars.forEach((obj) => obj.go());
        } 
    }
    if(ev.code == "Space") {
        data.cars.forEach((obj) => {obj.stop()});
        data.roads.forEach((obj) => {obj.stop()});
        data.args.forEach((obj) => {obj.stop()});
    }
});
document.addEventListener("keyup", (ev) => {
    ans == false;
    data.hero.stop();
});
