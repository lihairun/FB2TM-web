// Engineer: jWilliamDunn 2020

// First-person camera control w/ HUD
// Mouse: left/right : pan
//        up/down : tilt
//        click : move forward

//  Keys: a/d : left/right
//        w/s : forward/backward
//        e/q : up/down
//        space : jump    <----------- extended behavior
//        h : help

// update 20191014 tweaks for better behavior
// update 20200626 incorporate pointerLock and new roverCam API

// Ported to JS from github.com/jrc03c/queasycam/tree/master/examples/MazeRunner
class Block {
  constructor(x, y, z, w, h, d) {
    this.position = createVector(x, y, z);
    this.dimensions = createVector(w, h, d);
    //方块颜色
    // this.fillColor = color(random(150, 200));
    this.fillColor = color(0);
    this.visited = false;
  }

  update() {
    let playerLeft = player.position.x - player.dimensions.x / 2;
    let playerRight = player.position.x + player.dimensions.x / 2;
    let playerTop = player.position.y - player.dimensions.y / 2;
    let playerBottom = player.position.y + player.dimensions.y / 2;
    let playerFront = player.position.z - player.dimensions.z / 2;
    let playerBack = player.position.z + player.dimensions.z / 2;

    let boxLeft = this.position.x - this.dimensions.x / 2;
    let boxRight = this.position.x + this.dimensions.x / 2;
    let boxTop = this.position.y - this.dimensions.y / 2;
    let boxBottom = this.position.y + this.dimensions.y / 2;
    let boxFront = this.position.z - this.dimensions.z / 2;
    let boxBack = this.position.z + this.dimensions.z / 2;

    let boxLeftOverlap = playerRight - boxLeft;
    let boxRightOverlap = boxRight - playerLeft;
    let boxTopOverlap = playerBottom - boxTop;
    let boxBottomOverlap = boxBottom - playerTop;
    let boxFrontOverlap = playerBack - boxFront;
    let boxBackOverlap = boxBack - playerFront;

    if (
      ((playerLeft > boxLeft && playerLeft < boxRight) ||
        (playerRight > boxLeft && playerRight < boxRight)) &&
      ((playerTop > boxTop && playerTop < boxBottom) ||
        (playerBottom > boxTop && playerBottom < boxBottom)) &&
      ((playerFront > boxFront && playerFront < boxBack) ||
        (playerBack > boxFront && playerBack < boxBack))
    ) {
      let xOverlap = max(min(boxLeftOverlap, boxRightOverlap), 0);
      let yOverlap = max(min(boxTopOverlap, boxBottomOverlap), 0);
      let zOverlap = max(min(boxFrontOverlap, boxBackOverlap), 0);

      if (xOverlap < yOverlap && xOverlap < zOverlap) {
        if (boxLeftOverlap < boxRightOverlap) {
          player.position.x = boxLeft - player.dimensions.x / 2;
        } else {
          player.position.x = boxRight + player.dimensions.x / 2;
        }
      } else if (yOverlap < xOverlap && yOverlap < zOverlap) {
        if (boxTopOverlap < boxBottomOverlap) {
          player.position.y = boxTop - player.dimensions.y / 2;
          player.velocity.y = 0;
          player.grounded = true;
        } else {
          player.position.y = boxBottom + player.dimensions.y / 2;
        }
      } else if (zOverlap < xOverlap && zOverlap < yOverlap) {
        if (boxFrontOverlap < boxBackOverlap) {
          player.position.z = boxFront - player.dimensions.x / 2;
        } else {
          player.position.z = boxBack + player.dimensions.x / 2;
        }
      }
    }
  }

  display() {
    push();
    translate(this.position.x, this.position.y, this.position.z);
    fill(this.fillColor);
    box(this.dimensions.x, this.dimensions.y, this.dimensions.z);
    pop();
  }

  //1的高度
  moveDown() {
    this.position.y += 10;
  }
}

class Maze {
  constructor(size) {
    this.blocks = new Array(size);

    for (let i = 0; i < size; i++) {
      this.blocks[i] = new Array(size);
      for (let j = 0; j < size; j++) {
        let x = i * 10;
        let y = 0;
        let z = j * 10;
        this.blocks[i][j] = new Block(x, y, z, 10, 10, 10);
      }
    }

    this.start = this.blocks[1][1];
    //开始点
    // this.blocks[1][1].fillColor = color(63, 127, 63);
    var m = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    for (let i = 1; i < size - 1; i++)
      for (let j = 1; j < size - 1; j++)
        if (m[i][j]) this.blocks[i][j].moveDown();
        else this.blocks[i][j].fillColor = color(127);
    //终点
    // this.blocks[3][3].fillColor = color(127, 63, 63);
  }

  update() {
    for (let i = 0; i < this.blocks.length; i++) {
      for (let j = 0; j < this.blocks[i].length; j++) {
        this.blocks[i][j].update();
      }
    }
  }

  display() {
    for (let i = 0; i < this.blocks.length; i++) {
      for (let j = 0; j < this.blocks[i].length; j++) {
        this.blocks[i][j].display();
      }
    }
  }

  //起始高度和位置
  setPlayerAtStart(player) {
    player.position = p5.Vector.add(
      this.start.position,
      createVector(45, -15, 45)
    );
  }
}

class Player extends RoverCam {
  constructor() {
    super();
    this.dimensions = createVector(1, 3, 1);
    this.velocity = createVector(0, 0, 0);
    this.gravity = createVector(0, 0.03, 0);
    this.grounded = false;
    this.pointerLock = false;
    this.sensitivity = 0.002;
    this.speed = 0.04;
  }

  controller() {
    // override
    if (player.pointerLock) {
      this.yaw(movedX * this.sensitivity); // mouse left/right
      this.pitch(movedY * this.sensitivity); // mouse up/down
      if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) this.moveY(0.01); // a
      if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) this.moveY(-0.01); // d
    } else {
      // otherwise yaw/pitch with keys
      if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) this.yaw(-0.02); // a
      if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) this.yaw(0.02); // d
      if (keyIsDown(82)) this.pitch(-0.02); // r
      if (keyIsDown(70)) this.pitch(0.02); // f
    }
    if (keyIsDown(87) || keyIsDown(UP_ARROW)) this.moveX(this.speed); // w
    if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) this.moveX(-this.speed); // s
    if (keyIsDown(69)) this.moveZ(0.05); // e
  }

  update() {
    if (keyIsPressed && key == "e") {
      this.grounded = false;
      return;
    }
    this.velocity.add(this.gravity);
    this.position.add(this.velocity);

    if (this.grounded && keyIsPressed && keyCode == 32) {
      // space
      this.grounded = false;
      this.velocity.y = -1.5;
      this.position.y -= 0.2;
    }
  }
}

// this is needed to catch the exit from pointerLock when user presses ESCAPE
function onPointerlockChange() {
  if (
    document.pointerLockElement === canvas.elt ||
    document.mozPointerLockElement === canvas.elt
  )
    console.log("locked");
  else {
    console.log("unlocked");
    player.pointerLock = false;
  }
}
document.addEventListener("pointerlockchange", onPointerlockChange, false);

var player,
  maze,
  f,
  help = false,
  canvas;

function drawAxes(){
	push();
      noStroke();
	  fill(127,0,0); // X red
	  translate(75,0.5,0.5);
	  box(150,1,1);
	pop();
	push();
      noStroke();
	  fill(0,127,0); // Y green
	  translate(0.5,75,0.5);
	  box(1,150,1);
	pop();
	push();
      noStroke();
	  fill(0,0,127); // Z blue
	  translate(0.5,0.5,75);
	  box(1,1,150);
	pop();
}
