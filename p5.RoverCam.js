/*
 *
 * The p5.RoverCam library - First-Person 3D CameraControl for p5.js and WEBGL.
 *
 *   Copyright © 2020 by p5.RoverCam authors
 *
 *   Source: https://github.com/freshfork/p5.RoverCam
 *
 *   MIT License: https://opensource.org/licenses/MIT
 *
 *
 * explanatory note:
 *
 * p5.RoverCam is a derivative of the QueasyCam Library by Josh Castle,
 * ported to JavaScript for p5.js from github.com/jrc03c/queasycam
 *
 * updates
 * 20200628 incorporate pointerLock and overridable controller method
 * 20200629 add support for switching between multiple cameras
 * 20200701 v1.1.0 fix registerMethod and allow for p5js instance mode 
 */

// First-person camera control
// Mouse:
//       left/right : yaw
//       up/down : pitch
//       click : enter/leave pointerLock

// Keys: a/d : yaw or left/right if pointerLock
//       w/s : forward/backward
//       e/q : up/down

class RoverCam {
  constructor(instance) {
    this.sensitivity = 0.02;
    this.friction = 0.8;
    this.speed = 0.1;
    this.reset();
    this.active = true; // use the setActive method
    this.enableControl = true; // used to enable/disable controls
    if(instance !== undefined) this.p5 = instance; 
    else this.p5 = p5.instance;
    if(this.p5 !== null) 
      this.p5.registerMethod('post', () => {if (this.active) this.draw();});
  }

  // Application can override the following method
  controller() { // default behavior
    if (!this.enableControl) return;
    if (RoverCam.pointerLock) {
      this.yaw(this.p5.movedX * this.sensitivity / 10); // mouse left/right
      this.pitch(this.p5.movedY * this.sensitivity / 10); // mouse up/down
      if (this.p5.keyIsDown(65) || this.p5.keyIsDown(this.p5.LEFT_ARROW)) this.moveY(this.speed); // a
      if (this.p5.keyIsDown(68) || this.p5.keyIsDown(this.p5.RIGHT_ARROW)) this.moveY(-this.speed); // d
    } else { // otherwise yaw/pitch with keys
      if (this.p5.keyIsDown(65) || this.p5.keyIsDown(this.p5.LEFT_ARROW)) this.yaw(-this.sensitivity); // a
      if (this.p5.keyIsDown(68) || this.p5.keyIsDown(this.p5.RIGHT_ARROW)) this.yaw(this.sensitivity); // d
      if (this.p5.keyIsDown(82)) this.pitch(-this.sensitivity); // r
      if (this.p5.keyIsDown(70)) this.pitch(this.sensitivity); // f
    }
    if (this.p5.keyIsDown(87) || this.p5.keyIsDown(this.p5.UP_ARROW)) this.moveX(this.speed); // w
    if (this.p5.keyIsDown(83) || this.p5.keyIsDown(this.p5.DOWN_ARROW)) this.moveX(-this.speed); // s
    if (this.p5.keyIsDown(69)) this.moveZ(this.speed); // e
    if (this.p5.keyIsDown(81)) this.moveZ(-this.speed); // q

    if (this.p5.keyIsDown(107) || this.p5.keyIsDown(187)) this.fov(-this.sensitivity / 10); // +
    if (this.p5.keyIsDown(109) || this.p5.keyIsDown(189)) this.fov(this.sensitivity / 10); // -

    // test roll TBD
    //if(this.p5.keyIsDown(90)) this.roll(this.sensitivity);  // z
    //if(this.p5.keyIsDown(67)) this.roll(-this.sensitivity); // c
  }

  // Primitive internal camera control methods
  moveX(speed) {
    this.velocity.add(p5.Vector.mult(this.forward, speed));
  }
  moveY(speed) {
    this.velocity.add(p5.Vector.mult(this.right, speed));
  }
  moveZ(speed) {
    this.velocity.add(p5.Vector.mult(this.up, -speed));
  }
  yaw(angle) {
    this.pan += angle;
  }
  pitch(angle) {
    this.tilt += angle;
    this.tilt = this.clamp(this.tilt, -Math.PI / 2.01, Math.PI / 2.01);
    if (this.tilt == Math.PI / 2.0) this.tilt += 0.001;
  }
  roll(angle) { // TBD: useful for flight sim or sloped racetracks
    this.rot += angle;
  }
  fov(angle) {
    this.fovy += angle;
    this.width = 0; // trigger a perspective call in the draw loop
  }
  reset() {
    this.pan = 0.0;
    this.tilt = 0.0;
    this.rot = 0.0;
    this.fovy = 1.0;
    this.width = 0; // trigger a perspective call in the draw loop
    this.height = 0;
    this.position = new p5.Vector(0, 0, 0);
    this.velocity = new p5.Vector(0, 0, 0);
    this.up = new p5.Vector(0, 1, 0);
    this.right = new p5.Vector(1, 0, 0);
    this.forward = new p5.Vector(0, 0, 1);
  }
  setActive(active){ // method to switch between multiple cameras
    this.active = active;
    if(active) this.width=0; // trigger a perspective call in the draw loop
  }
  setState(state){ // state object can have fov,active,rotation,position
    if(state.fov !== undefined) {
      this.fovy = state.fov;
      this.width = 0; // trigger a perspective call in the draw loop;
    }
    if(state.active !== undefined) this.active = state.active;
    if(state.rotation !== undefined) {
      this.pan = state.rotation[0];
      this.tilt = state.rotation[1];
      this.rot = state.rotation[2];
    }
    if(state.position !== undefined) this.position = new p5.Vector(state.position[0],state.position[1],state.position[2]);
  }

  // This method is called after the main p5.js draw loop 
  draw() {
    if (this.p5.width !== this.width || this.p5.height !== this.height) {
      this.p5.perspective(this.fovy, this.p5.width / this.p5.height, 0.01, 1000.0);
      this.width = this.p5.width;
      this.height = this.p5.height;
    }

    // Call the potentially overridden controller method
    this.controller();

    this.forward = new p5.Vector(Math.cos(this.pan), Math.tan(this.tilt), Math.sin(this.pan));
    this.forward.normalize();
    this.right = new p5.Vector(Math.cos(this.pan - Math.PI / 2.0), 0, Math.sin(this.pan - Math.PI / 2.0));
    // TBD: handle roll command (using this.rot)

    this.velocity.mult(this.friction);
    this.position.add(this.velocity);
    let center = p5.Vector.add(this.position, this.forward);
    this.p5.camera(this.position.x, this.position.y, this.position.z, center.x, center.y, center.z, this.up.x, this.up.y, this.up.z);
  }

  clamp(aNumber, aMin, aMax) {
    return (aNumber > aMax ? aMax :
      aNumber < aMin ? aMin :
      aNumber);
  }
}
RoverCam.version = "1.1.0";
// Optional pointerLock applies to all RoverCam instances 
RoverCam.pointerLock = false;
RoverCam.usePointerLock = (instance) => {
  if(instance === undefined) instance = p5.instance;
  if(instance === null) return;
  RoverCam.canvas = instance._renderer.elt;
  // ffd8 - click into pointerlock example based on:
  // https://p5js.org/reference/#/p5/exitPointerLock
  document.addEventListener('click', () => {
    if (!RoverCam.pointerLock) {
      RoverCam.pointerLock = true;
      instance.requestPointerLock();
    } else {
      instance.exitPointerLock();
      RoverCam.pointerLock = false;
    }
  }, false);
  document.addEventListener('pointerlockchange', RoverCam.onPointerlockChange, false);
}
// handle exit from pointerLock when user presses ESCAPE
RoverCam.onPointerlockChange = () => {
  if (document.pointerLockElement !== RoverCam.canvas &&
      document.mozPointerLockElement !== RoverCam.canvas) RoverCam.pointerLock = false;
}
p5.prototype.createRoverCam = function(){
  return new RoverCam(this);
}