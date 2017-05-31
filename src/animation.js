function SpriteSheet(path, frameWidth, frameHeight) {
		this.image = new Image();
		this.frameWidth = frameWidth;
		this.frameHeight = frameHeight;

		// calculate the number of frames in a row after the image loads
		var self = this;
		this.image.onload = function() {
			self.framesPerRow = Math.floor(self.image.width / self.frameWidth);
		};

		this.image.src = path;
	}

function Animation(spritesheet, frameSpeed, startFrame, endFrame) {
	var animationSequence = []; 
	var currentFrame = 0; 
	var counter = 0; 
	for (var frameNumber = startFrame; frameNumber <= endFrame; frameNumber++)
		animationSequence.push(frameNumber);

	this.update = function() {
		if (counter == (frameSpeed - 1))
			currentFrame = (currentFrame + 1) % animationSequence.length;
		counter = (counter + 1) % frameSpeed;
	};


	this.draw = function(x, y, ctx) {
		var row = Math.floor(animationSequence[currentFrame] / spritesheet.framesPerRow);
		var col = Math.floor(animationSequence[currentFrame] % spritesheet.framesPerRow);

		ctx.drawImage(
			spritesheet.image,
			col * spritesheet.frameWidth, row * spritesheet.frameHeight,
			spritesheet.frameWidth, spritesheet.frameHeight,
			x, y,
			spritesheet.frameWidth, spritesheet.frameHeight -25);
	};
}