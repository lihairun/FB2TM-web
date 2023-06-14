let floorTexture;
let skyTexture;
let topPanelTexture;

let earthBookTextureIn;
let earthBookTextureOut;

let moonBookTextureIn1;
let moonBookTextureIn2;
let moonBookTextureIn3;
let moonBookTextureIn4;
let moonBookTextureIn5;
let moonBookTextureIn6;
let moonBookTextureIn7;
let moonBookTextureIn8;
let moonBookTextureOut1;
let moonBookTextureOut2;
let moonBookTextureOut3;
let moonBookTextureOut4;
let moonBookTextureOut5;
let moonBookTextureOut6;
let moonBookTextureOut7;
let moonBookTextureOut8;

let earthBook;
let earthLine;
let moonLine;

let audio;
let guideTexture;

let showPanel = true;

function preload() {
  // f = loadFont("inconsolata.otf");

  floorTexture = loadImage("links/MoonTexture_1.png");
  skyTexture = loadImage("links/sky_3.png");

  // moonBook = loadModel("links/3D model_moon.obj", true);
  // moonBook2 = loadModel("links/3D model_moon_2.obj", true);
  earthBook = loadModel("links/earthBook_2.obj", true);
  earthLine = loadModel("links/earthLine.obj", true);
  moonLine = loadModel("links/moonLine.obj", true);

  guideTexture = loadImage("links/Guideline_3.png");
  // guideTexture = createVideo(['links/Guideline_3.webm']);
  // guideTexture.hide();
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  strokeWeight(0.04);
  // textFont(f);
  // textSize(10);
  player = new Player();
  maze = new Maze(12);
  maze.setPlayerAtStart(player);
  frameRate(60);
  // strokeWeight(2);
  noStroke();

  audio = createAudio("links/audio_low.mp3");
  audio.loop();

  // guideTexture.hide();
  // guideTexture.loop();
  // guideTexture.autoplay();
  // guideTexture.volume(0);

  topPanelTexture = loadImage("links/topPanel_low.png");

  earthBookTextureIn = loadImage("links/earthIn.png");
  earthBookTextureOut = loadImage("links/earthOut.png");

  moonBookTextureIn1 = loadImage("links/moonBookTexture_1.png");
  moonBookTextureIn2 = loadImage("links/moonBookTexture_2.png");
  moonBookTextureIn3 = loadImage("links/moonBookTexture_3.png");
  moonBookTextureIn4 = loadImage("links/moonBookTexture_4.png");
  moonBookTextureIn5 = loadImage("links/moonBookTexture_5.png");
  moonBookTextureIn6 = loadImage("links/moonBookTexture_6.png");
  moonBookTextureIn7 = loadImage("links/moonBookTexture_7.png");
  moonBookTextureIn8 = loadImage("links/moonBookTexture_8.png");
  moonBookTextureOut1 = loadImage("links/moonBookTexture_out_1.png");
  moonBookTextureOut2 = loadImage("links/moonBookTexture_out_2.png");
  moonBookTextureOut3 = loadImage("links/moonBookTexture_out_3.png");
  moonBookTextureOut4 = loadImage("links/moonBookTexture_out_4.png");
  moonBookTextureOut5 = loadImage("links/moonBookTexture_out_5.png");
  moonBookTextureOut6 = loadImage("links/moonBookTexture_out_6.png");
  moonBookTextureOut7 = loadImage("links/moonBookTexture_out_7.png");
  moonBookTextureOut8 = loadImage("links/moonBookTexture_out_8.png");
}

function keyPressed() {
  if (key == "h") {
    // help = !help;
    showPanel = true;
  }
  if (key == "+") {
    player.pov.fovy -= 0.1;
    player.updatePOV();
  }
  if (key == "-") {
    player.pov.fovy += 0.1;
    player.updatePOV();
  }
  showPanel = false;
}

function draw() {
  background(0, 0, 0);

  text('Loading', 15, 300);

  maze.update();
  maze.display();
  player.update();
  // drawAxes();

  // push();
  // translate(55, 0, 55);
  // rotateY(millis() / 36000);
  // scale(0.1);
  // texture(moonBookTexture);
  // model(moonBook);
  // pop();

  // push();
  // translate(65, 0, 55);
  // scale(0.045);
  // texture(moonBookTexture);
  // model(moonBook2);
  // pop();
  // push();
  // translate(62.5, 0, 47.5);
  // rotateY(PI / 4);
  // scale(0.045);
  // texture(moonBookTexture);
  // model(moonBook2);
  // pop();

  //操作指南
  push();
  translate(57, 3.5, 55);
  rotateY(-PI / 2);
  if (showPanel) {
    texture(guideTexture);
    plane(2, 1.25);
  }
  pop();

  //顶部圆盘
  push();
  translate(55, -18.25, 55);
  rotateX(PI / 2);
  rotateZ(millis() / 36000);
  texture(topPanelTexture);
  ellipse(0, 0, 10.25, 10.25);
  pop();

  //地球线
  push();
  translate(55, -8, 55);
  rotateX(PI);
  rotateY(millis() / 36000);
  scale(0.1015);
  model(earthLine);
  pop();

  //地球线2
  push();
  translate(55, -118.25, 55);
  // rotateX(PI / 2);
  cylinder(0.005, 200);
  pop();

  //月球线
  push();
  translate(55, -37.5, 55);
  rotateX(PI);
  scale(0.330);
  model(moonLine);
  pop();

  //地球书外测
  push();
  translate(55, 2.5, 55);
  rotateX(PI);
  rotateY(millis() / 36000);
  scale(0.05);
  texture(earthBookTextureOut);
  model(earthBook);
  pop();
  //地球书内测
  push();
  translate(55, 2.5, 55);
  rotateX(PI);
  rotateY(millis() / 36000);
  scale(0.0499);
  texture(earthBookTextureIn);
  model(earthBook);
  pop();

  push();
  ellipseMode(CENTER);
    //月球书外侧
    push();
    translate(55 + 11, 0, 55);
    rotateY(PI / 2);
    // rotateY(millis() / 36000);
    texture(moonBookTextureIn1);
    ellipse(0, 0, 9, 9);
    pop();
    push();
    translate(55 + 7.818, 0, 55 - 7.818);
    rotateY(-PI / 4);
    rotateX(PI);
    rotateZ(PI);
    texture(moonBookTextureIn2);
    ellipse(0, 0, 9, 9);
    pop();
    push();
    translate(55, 0, 55 - 11);
    rotateX(PI);
    rotateZ(PI);
    texture(moonBookTextureIn3);
    ellipse(0, 0, 9, 9);
    pop();
    push();
    translate(55 - 7.818, 0, 55 - 7.818);
    rotateY(PI / 4);
    rotateX(PI);
    rotateZ(PI);
    texture(moonBookTextureIn4);
    ellipse(0, 0, 9, 9);
    pop();
    ellipseMode(CENTER);
    push();
    translate(55 - 11, 0, 55);
    rotateY(PI / 2);
    rotateX(PI);
    rotateZ(PI);
    texture(moonBookTextureIn5);
    ellipse(0, 0, 9, 9);
    pop();
    push();
    translate(55 - 7.818, 0, 55 + 7.818);
    rotateY(-PI / 4);
    texture(moonBookTextureIn6);
    ellipse(0, 0, 9, 9);
    pop();
    push();
    translate(55, 0, 55 + 11);
    texture(moonBookTextureIn7);
    ellipse(0, 0, 9, 9);
    pop();
    push();
    translate(55 + 7.818, 0, 55 + 7.818);
    rotateY(PI / 4);
    texture(moonBookTextureIn8);
    ellipse(0, 0, 9, 9);
    pop();
    //月球书内测
    ellipseMode(CENTER);
    push();
    translate(55 + 11 - 0.01, 0, 55);
    rotateZ(PI);
    rotateX(PI);
    rotateY(PI / 2);
    texture(moonBookTextureOut1);
    ellipse(0, 0, 9, 9);
    pop();
    push();
    translate(55 + 7.818 - 0.01, 0, 55 - 7.818 + 0.01);
    rotateY(-PI / 4);
    texture(moonBookTextureOut2);
    ellipse(0, 0, 9, 9);
    pop();
    push();
    translate(55, 0, 55 - 11 + 0.01);
    texture(moonBookTextureOut3);
    ellipse(0, 0, 9, 9);
    pop();
    push();
    translate(55 - 7.818 + 0.01, 0, 55 - 7.818 + 0.01);
    rotateY(PI / 4);
    texture(moonBookTextureOut4);
    ellipse(0, 0, 9, 9);
    pop();
    ellipseMode(CENTER);
    push();
    translate(55 - 11 + 0.01, 0, 55);
    rotateY(PI / 2);
    texture(moonBookTextureOut5);
    ellipse(0, 0, 9, 9);
    pop();
    push();
    translate(55 - 7.818 + 0.01, 0, 55 + 7.818 - 0.01);
    rotateZ(PI);
    rotateX(PI);
    rotateY(-PI / 4);
    texture(moonBookTextureOut6);
    ellipse(0, 0, 9, 9);
    pop();
    push();
    translate(55, 0, 55 + 11 - 0.01);
    rotateZ(PI);
    rotateX(PI);
    texture(moonBookTextureOut7);
    ellipse(0, 0, 9, 9);
    pop();
    push();
    translate(55 + 7.818 - 0.01, 0, 55 + 7.818 - 0.01);
    rotateZ(PI);
    rotateX(PI);
    rotateY(PI / 4);
    texture(moonBookTextureOut8);
    ellipse(0, 0, 9, 9);
    pop();
  pop();

  push();
  translate(55, 4.9, 55);
  rotateX(PI / 2);
  texture(floorTexture);
  plane(100, 100);
  pop();

  push();
  translate(55, 2, 55);
  rotateY(-PI / 2);
  texture(skyTexture);
  sphere(50);
  pop();

  // if (help || frameCount < 400) { // Heads Up Display extension by jWilliam
  //   push(); // this affects the frame rate
  //   camera(0, 0, (height / 2.0) / tan(PI * 30.0 / 180.0), 0, 0, 0, 0, 1, 0);
  //   ortho(-width / 2, width / 2, -height / 2, height / 2, 0, 1000);
  //   fill(0, 0, 0, 200);
  //   noStroke();
  //   translate(-380, -380, 0);
  //   scale(2);
  //   rect(0, 0, 140, 85);
  //   fill(127);
  //   text('mouse: left/right : pan', 10, 10);
  //   text('       up/down : tilt', 10, 20);
  //   text('       click : ptrlock', 10, 30);
  //   text(' keys: a/d : left/right', 10, 40);
  //   text('       w/s : fwd/bkwd', 10, 50);
  //   text('       e/q : up/down', 10, 60);
  //   text('       space : jump', 10, 70);
  //   text('       h : help', 10, 80);
  //   pop();
  // }
}

function mouseClicked() {
  if (!player.pointerLock) {
    player.pointerLock = true;
    requestPointerLock();
  } else {
    exitPointerLock();
    player.pointerLock = false;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
