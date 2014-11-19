// Screen Size
var WIDTH = 800;
var HEIGHT = 480;

// Fixed time step of 1/60th a second
var TIME_STEP = 1000/60;

// Resources
//----------------------------------
Resource = {
	loading: 0,
	Image: {
	},
	Audio: {
	}
}
function onload() { 
	Resource.loading -= 1; 
}

// Game class
//----------------------------------
var Game = function (canvasId) {
  var myself = this;
  
  // Rendering variables
  this.screen = document.getElementById(canvasId);
  this.screenBounds = this.screen.getBoundingClientRect();
  this.screenContext = this.screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = this.screen.width;
  this.backBuffer.height = this.screen.height;
  this.backBufferContext = this.backBuffer.getContext('2d');
  
  // Parallax variables
  this.cameraOffset = 200;
	
  // Input variables	
	this.inputState = {
		up: false,
		down: false,
		left: false,
		right: false,
		viewportX: 0,
		viewportY: 0,
		leftMouseDown: false,
		rightMouseDown: false,
	};
	
  // Game variables
  //this.gui = new GUI(this);
  
  // Timing variables
  this.elapsedTime = 0.0;
  this.startTime = 0;
  this.lastTime = 0;
  this.gameTime = 0;
  this.fps = 0;
  this.STARTING_FPS = 60;	
}
	
Game.prototype = {

	// Update the game world.  See
	// http://gameprogrammingpatterns.com/update-method.html
	update: function(elapsedTime) {
		console.log("updating");
	},
	
	render: function(elapsedTime) {
		console.log("rendering");
		var self = this;
		
		if(!this.gameOver)
		{
		// Clear the screen
		this.backBufferContext.fillRect(0, 0, WIDTH, HEIGHT);
		
		// Render background
		
		// Render game objects

		// Restore render state
		this.backBufferContext.restore();

		// Render reticule
		
		// Render GUI
		//this.gui.render(this.backBufferContext);
		}
		
		// Flip buffers
		this.screenContext.drawImage(this.backBuffer, 0, 0);
		
	},
	
	keyDown: function(e)
	{
		// Cycle state is set directly 
		switch(e.keyCode){
			case 37: // LEFT
			case 65: // A
				this.inputState.left = true;
				break;
			case 38: // UP
			case 87: // W
				this.inputState.up = true;
				break;
			case 39: // RIGHT
			case 68: // D
				this.inputState.right = true;
				break;
			case 40: // DOWN
			case 83: // S
				this.inputState.down = true;
				break;
		}
	},
	
	keyUp: function(e)
	{
		// Cycle state is set directly 
		switch(e.keyCode){
			case 37: // LEFT
			case 65: // A
				this.inputState.left = false;
				break;
			case 38: // UP
			case 87: // W
				this.inputState.up = false;
				break;
			case 39: // RIGHT
			case 68: // D
				this.inputState.right = false;
				break;
			case 40: // DOWN
			case 83: // S
				this.inputState.down = false;
				break;
		}
	},
	
	mouseMove: function(e) {
		this.inputState.viewportX = e.clientX - this.screenBounds.left;
		this.inputState.viewportY = e.clientY - this.screenBounds.top;
	},
	
	mouseDown: function(e){
		this.mouseMove(e);
		switch(e.button) {
			case 0:
				this.inputState.leftMouseDown = true;
				
				break;
			case 2:
				this.inputState.rightMouseDown = true;
				break;
		};
	},
	
	mouseUp: function(e){
		this.mouseMove(e);
		switch(e.button) {
			case 0:
				this.inputState.leftMouseDown = false;
				
				break;
			case 2:
				this.inputState.rightMouseDown = false;
				break;
		};
	},
	
	start: function() {
		var self = this;
		
		window.onkeydown = function (e) { self.keyDown(e); };
		window.onkeyup = function (e) { self.keyUp(e); };
		window.onmousemove = function (e) { self.mouseMove(e) };
		window.onmousedown = function(e) { self.mouseDown(e) };
		window.onmouseup = function(e) { self.mouseUp(e) };
		this.screen.oncontextmenu = function (e) { return false; };
		
		this.startTime = Date.now();
		
		window.requestNextAnimationFrame(
			function(time) {
				self.loop.call(self, time);
			}
		);
	},

	
	// The game loop.  See
	// http://gameprogrammingpatterns.com/game-loop.html
	loop: function(time) {
		var self = this;
		
		// Don't advance the clock if the game is paused		
		if(this.paused || this.gameOver) this.lastTime = time;
		
		// Calculate additional elapsed time, keeping any
		// unused time from previous frame
		this.elapsedTime += time - this.lastTime; 
		this.lastTime = time;
		
		// The first timestep (and occasionally later ones) are too large
		// causing our processing to take too long (and run into the next
		// frame).  We can clamp to a max of 4 frames to keep that from 
		// happening		
		this.elapsedTime = Math.min(this.elapsedTime, 4 * TIME_STEP);
		
		// We want a fixed game loop of 1/60th a second, so if necessary run multiple
		// updates during each rendering pass
		// Invariant: We have unprocessed time in excess of TIME_STEP
		while (this.elapsedTime >= TIME_STEP) { 
			self.update(TIME_STEP);
			this.elapsedTime -= TIME_STEP;
			
			// add the TIME_STEP to gameTime
			this.gameTime += TIME_STEP;
		}
		
		// We only want to render once
		self.render(this.elapsedTime);
		
		// Repeat the game loop
		window.requestNextAnimationFrame(
			function(time) {
				self.loop.call(self, time);
			}
		);
	}
}
var game = new Game('game');
console.log(game);
function waitForLoad() {
	if(Resource.loading == 0) {
		game.start();
	} else {
		setTimeout(waitForLoad, 1000);
	}
};
waitForLoad();