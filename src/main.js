window.onload = function() {
	let canvas = document.getElementById("canvas");
	let width = canvas.width = window.innerWidth;
	let height = canvas.height = window.innerHeight;

	let ctx = canvas.getContext("2d");

	spritesheet = new SpriteSheet('res/player.png', 51.3, 103);
	walk = new Animation(spritesheet, 15, 5, 8);

	let posx = null;
	let posy = null;
	let diamond_counter = 0;
	let player_speed = 3;
	let difficulty =sessionStorage.getItem("difficulty"); 
	let doom = 7 * difficulty;
	doom = Math.floor(doom);
	let moving = true;
	//load tilesets
	let background = new Image();
	background.src = "res/png/elements/background.png";
	let images = [];

	for (let i = 0; i < map.tilesets[0].tilecount; i++) {
		images.push(new Image());
		images[i].src = map.tilesets[0].tiles[i].image;

	}
	for (let i = 0; i < map.tilesets[1].tilecount; i++) {
		images.push(new Image());
		images[i + map.tilesets[0].tilecount].src = map.tilesets[1].tiles[i].image;

	}
	function between(x, min, max) {
  		return x >= min && x <= max;
	}	


	function getTile(col, row) {
		return map.layers[0].data[row * map.width + col] - 1;
	}
		let running = true;

	function handle_object_collision(x, y) {
		for (let i = 0; i < map.layers[1].objects.length; i++) {
			if (map.layers[1].objects[i].gid == 31) {
				if (between(x,map.layers[1].objects[i].x,map.layers[1].objects[i].x+5 )&& between(y, map.layers[1].objects[i].y - 31, map.layers[1].objects[i].y - 31 + 15)) {

					map.layers[1].objects.splice(i, 1);
					diamond_counter +=1;
					if (diamond_counter >= doom) {
						player_speed *= 2;
						doom += 3;
					}

					
				}
				
			} else if(map.layers[1].objects[i].gid == 41) {
				if (between(x,map.layers[1].objects[i].x,map.layers[1].objects[i].x+5 )&& between(y, map.layers[1].objects[i].y - 31, map.layers[1].objects[i].y - 31 + 15)) {
					map.layers[1].objects.splice(i, 1);

					running = false;
				}
				
			}
		}

	}

	function drawTile(tile, x, y) {
		ctx.drawImage(images[tile], x, y);
	};


	let offset = height - map.height * 32;
	let offsetx = 0;
	let offsety = 0;
	let movingLeft = false;
	let jump = false;

	function handleStart() {
		jump = true;
	}
	canvas.addEventListener("touchstart", handleStart, false);

	document.body.addEventListener("keydown", function (event) {

		switch (event.keyCode) {
			case 32: //Space
				jump = true;
				break;
			case 68: //D
				movingLeft = true;
				break;
			default:
				break;
		}
	});


	function collides(x,y) {
		return !(getTile(x,y) == -1);
	}


	update();
	
	function update() {
		if (running) {
			requestAnimationFrame(update);
		} else {
			sessionStorage.setItem("score", diamond_counter);
			window.open("game_over.html", "_self");
		}
		


		ctx.save();
		let off = offsetx + width/3;
		ctx.translate(off,0);
		ctx.clearRect(-off,-offsety, width, height);

		ctx.drawImage(background,-off, 2 * offsety);
		ctx.font = "18px Arial";
		ctx.fillStyle = "grey";
		ctx.fillText("Diamonds: " + diamond_counter,posx - width/3 + 30, 40);
		ctx.font = "15px Arial";
		ctx.fillStyle = "grey";
		ctx.fillText("Doom in : " + doom,posx - width/3 + 30, 65);
		for (let c = 0; c < map.width; c++) {
			for (let r = 0; r < map.height; r++) {
				let tile = getTile(c, r);

				let x = (c * 32);
				let y = (r * 32);
				y += offset;
				if (tile >= 0) {

					drawTile(tile,x,y);
				}
			}
		}
		//draw objects
		for (let i = 0; i < map.layers[1].objects.length; i++) {
			if (map.layers[1].objects[i].gid != undefined) {
		
				drawTile(map.layers[1].objects[i].gid -1 , map.layers[1].objects[i].x , map.layers[1].objects[i].y -32 + offset);
			} else {
				posx = map.layers[1].objects[0].x;
				posy = map.layers[1].objects[0].y - 31.3 + offset;
			}
			
		}

		//walk.update();
		walk.draw(posx, posy - 14, ctx);
		
		ctx.restore();
		let x = Math.round((map.layers[1].objects[0].x)/ 32);
		let y = Math.round((map.layers[1].objects[0].y) / 32);
		handle_object_collision(map.layers[1].objects[0].x, map.layers[1].objects[0].y);
		
		if (!collides(x,y) && moving) {
			map.layers[1].objects[0].x += player_speed;
			offsetx -=player_speed;
		} else {
	

			moving = false;
		}

	
		if (!collides(x, Math.round((map.layers[1].objects[0].y +4) / 32))) {
			map.layers[1].objects[0].y += 4;
			offsety -= 4;


		} else {
			if (jump) {
				moving = true;

				map.layers[1].objects[0].y -= 50;
				offsety +=50;
			
				
				jump = false;
			}
		}

	}

}