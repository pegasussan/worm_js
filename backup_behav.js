function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function calcBlock() {
	block = [parseInt(Math.random()*770)+15,parseInt(Math.random()*570)+15];
	for (var j = 0; j < coords.length; j++) {
		if (Math.sqrt(Math.pow(coords[j][0]-block[0],2)+Math.pow(coords[j][1]-block[1])) < 5) {
			calcBlock();
			break;
		}
	}
}

function calcSuperBlock() {
	superBlock = [parseInt(Math.random()*760)+20,parseInt(Math.random()*560)+20];
	for (var j = 0; j < coords.length; j++) {
		if (Math.sqrt(Math.pow(coords[j][0]-superBlock[0],2)+Math.pow(coords[j][1]-superBlock[1])) < 10) {
			calcSuperBlock();
			break;
		}
	}
}

function gameOver() {
	notGameOver = false;
	$('#messages').text("Game Over");
}

function pause() {
	if (continuar) {
		continuar = false;
		$('#messages').text("Pause");
	} else {
		continuar = true;
		$('#messages').text("");
	}
}

function desenha() {
	var bb = document.getElementById("blackboard");
	var cw = bb.width;
	var ch = bb.height;
	var ctx = bb.getContext("2d");
	ctx.clearRect(0, 0, cw, ch);
	ctx.strokeStyle = '#ffffff';
	ctx.fillStyle = '#ffffff';
	ctx.lineWidth = 1;
	ctx.font = "10px Courier";
	ctx.beginPath();
	//Arena
	for (var i=0;i<6;i++) {
		ctx.moveTo(1+i,1+i);
		ctx.lineTo(800-i,1+i);
		ctx.moveTo(800-i,1+i);
		ctx.lineTo(800-i,600-i);
		ctx.moveTo(800-i,600-i);
		ctx.lineTo(1+i,600-i);
		ctx.moveTo(1+i,600-i);
		ctx.lineTo(1+i,1+i);
	}
	ctx.stroke();
	//Block
	ctx.strokeStyle = '#0000ff';
	ctx.fillStyle = '#0000ff';
	ctx.beginPath();
  ctx.arc(block[0],block[1],5,0,2*Math.PI);
  ctx.fill();
	ctx.stroke();
	//Super Block
	if (superCounterGone > 300) {
		superCounter = 0;
		superCounterGone = 0;
	}
	if (superCounter >= 10) {
		superCounterGone++;
		ctx.beginPath();
		ctx.drawImage(ideias_pic,superBlock[0]-12,superBlock[1]-12);
		ctx.stroke();
	}
	//Calculos - Worm
	var temp_worm = coords;
	coords = [];
	coords.push([temp_worm[0][0]+move[0],temp_worm[0][1]+move[1]]);
	for (var i = 0; i < compr - 1; i++) {
		coords.push([temp_worm[i][0],temp_worm[i][1]]);
	}
	//Calculos - Px Color
	var next_pixel = [];
	var theForth = [
		[-3,-3],
		[-3,2],
		[2,-3],
		[2,2]
	];
	for (var i = 0; i < 4; i++) {
		next_pixel.push(ctx.getImageData(coords[0][0]+theForth[i][0], coords[0][1]+theForth[i][1], 1, 1).data);
	}
	var hex_next_pixel = [];
	for (var i = 0; i < 4; i++) {
		hex_next_pixel.push("#" + ("000000" + rgbToHex(next_pixel[i][0], next_pixel[i][1], next_pixel[i][2])).slice(-6));
	}
	//Colisões
  var newPiece = compr;
	for (var i = 1; i < coords.length; i++) {
		if (Math.sqrt(Math.pow(coords[i][0]-coords[0][0],2)+Math.pow(coords[i][1]-coords[0][1],2)) < 4) {
			gameOver();
		}
	}
	if ($.inArray("#ffffff", hex_next_pixel) != -1) {
		gameOver();
	} else if ($.inArray("#0000ff", hex_next_pixel) != -1) {
		compr++;
		score += 100;
		superCounter++;
		calcBlock();
	} else if ($.inArray("#e6e63e", hex_next_pixel) != -1 || $.inArray("#010101", hex_next_pixel) != -1) {
		compr++;
		score += 1000;
		calcSuperBlock();
		superCounter = 0;
		superCounterGone = 0;
	}
	//Worm
  ctx.strokeStyle = '#ffa500';
  ctx.fillStyle = '#ffa500';
  ctx.beginPath();
  ctx.arc(coords[0][0],coords[0][1],3,0,2*Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = '#000000';
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  if (move[0] == step && move[1] == 0) {
    ctx.fillRect(coords[0][0]+1,coords[0][1]-2,1,1);
    ctx.fillRect(coords[0][0]+1,coords[0][1]+1,1,1);
  } else if (move[0] == -step && move[1] == 0) {
    ctx.fillRect(coords[0][0]-2,coords[0][1]-2,1,1);
    ctx.fillRect(coords[0][0]-2,coords[0][1]+1,1,1);
  } else if (move[0] == 0 && move[1] == step) {
    ctx.fillRect(coords[0][0]+1,coords[0][1]+1,1,1);
    ctx.fillRect(coords[0][0]-2,coords[0][1]+1,1,1);
  } else if (move[0] == 0 && move[1] == -step) {
    ctx.fillRect(coords[0][0]+1,coords[0][1]-2,1,1);
    ctx.fillRect(coords[0][0]-2,coords[0][1]-2,1,1);
  }
  ctx.stroke();
  ctx.strokeStyle = '#ff0000';
  ctx.fillStyle = '#ff0000';
	for (var i = 1; i < newPiece; i++) {
    ctx.beginPath();
    ctx.arc(coords[i][0],coords[i][1],2,0,2*Math.PI);
    ctx.fill();
    ctx.stroke();
	}
	//Pontuação
	score += 0.02;
	$('#score').text(parseInt(score));
	if (score > 10000) {
		speed = 10;
	}
	return 0;
}

var continuar = false;
var start = true;
var notGameOver = true;
var step = 4;
var speed = 20;
var compr = 2;
var coords = [
  [400,300],
  [396,300]
];
var move = [step,0];
var block = [];
var superBlock = [];
var superCounter = 0;
var superCounterGone = 0;
var score = 0;
var ideias_pic = new Image();
ideias_pic.src = "icon_ideias.png";
calcBlock();
calcSuperBlock();

$(function() {
	window.setInterval(function(){
		if (continuar && notGameOver) {
			desenha();
		}
	}, speed);
	$('html').keydown(function(e){
		e.preventDefault();
		if (e.which == 37) {
			if (move[0] != step && move[1] != 0) {
				move = [-step,0];
			}
		} else if (e.which == 38) {
			if (move[0] != 0 && move[1] != step) {
				move = [0,-step];
			}
		} else if (e.which == 39) {
			if (move[0] != -step && move[1] != 0) {
				move = [step,0];
			}
		} else if (e.which == 40) {
			if (move[0] != 0 && move[1] != -step) {
				move = [0,step];
			}
		} else if (e.which == 81) {
			gameOver();
		} else if (e.which == 82) {
			location.reload();
		} else if (e.which == 83) {
			if (start) {
				start = false;
				continuar = true;
			}
		} else if (e.which == 80) {
			pause();
		}
  });

  $(window).swipe({
    tap:function() {
      if (start) {
				start = false;
				continuar = true;
			}
      if (!start && notGameOver) {
        pause();
      }
    },
    doubleTap:function() {
      location.reload();
    },
    swipeLeft:function() {
      if (move[0] != step && move[1] != 0) {
				move = [-step,0];
			}
    },
    swipeRight:function() {
      if (move[0] != -step && move[1] != 0) {
				move = [step,0];
			}
    },
    swipeUp:function() {
      if (move[0] != 0 && move[1] != step) {
				move = [0,-step];
			}
    },
    swipeDown:function() {
      if (move[0] != 0 && move[1] != -step) {
				move = [0,step];
			}
    }
  });
});
