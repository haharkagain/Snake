window.addEventListener("load", snake, false);
function snake() {
    canv = document.getElementById("snake");
    ctx = canv.getContext("2d");
    let unit = canv.width / 24;
    let edge = 23; // one less than number of units for proper edge detection
    playing = false;
    init = true; // for starting screen
    reset();
    draw();
    init = false;
    AI = false;
    window.addEventListener("keydown", keyInput);
    fps = setInterval(function() {
        if (playing) { // stops interval if paused
            draw();
            move();
            collision();
        }
    }, 50)
    function reset() { // runs when someone dies 
        if (playing) {
            playing = false;
            draw();
        }  
        posX = 12;
        posY = posX;
        appleX = Math.floor(Math.random() * edge);
        appleY = Math.floor(Math.random() * edge);
        tail = 5;
        trail = [];
        velX = 1;
        velY = 0;;
        updated = true;
    }
    function right() {
        if ((velX != -1) && (updated)) {
            velX = 1;
            velY = 0;
            updated = false;
        }
    }
    function up() {
        if ((velY != 1) && (updated)) {
            velX = 0;
            velY = -1;
            updated = false;
        }
    }
    function left() {
        if ((velX != 1) && (updated)) {
            velX = -1;
            velY = 0;
            updated = false;
        }
    }
    function down() {
        if ((velY != -1) && (updated)) {
            velX = 0;
            velY = 1;
            updated = false;
        }
    }
    function bruteForceAI() {
        if (velY == 0) {
            if (posX == edge) {
                down();
                return;
            }
            if (posX == 1) {
                if (posY == edge) {
                   return; 
                }
                else if (velX != 1) {
                    down();
                } 
                return;
            }
            if (posX == 0) {
                up();
                return;
            }
        }
        else {
            if (posX == edge) {
                left();
                return;
            }
            if (posX == 1) {
                right();
                return;
            }
            if (posY == 0) {
                right();
                return;
            }
        }  
    }
    function keyInput(evt) {
        switch(evt.keyCode) {
            case 37: // left
                if (!AI) {
                    left();
                }
                break;
            case 38: // up
                if (!AI) {
                    up();
                }
                break;
            case 39: // right
                if (!AI) {
                    right();
                }
                break;
            case 40: // down
                if (!AI) {
                    down();
                }
                break;
            case 65: // left
                if (!AI) {
                    left();
                }
                break;
            case 87: // up
                if (!AI) {
                    up();
                }
                break;
            case 68: // right
                if (!AI) {
                    right();
                }
                break;
            case 83: // down
                if (!AI) {
                    down();
                }
                break;  
            case 32: // space for pause
                if (playing) {
                    playing = false;
                    draw();
                }
                else {
                    playing = true;
                }
                break;
            case 66: // b for bruteforce    
                if (!playing) {
                    posX = 12;
                    posY = 12;
                    AI = true;
                    clearInterval(fps);
                    playing = true;
                    fps = setInterval(function() {
                        if (playing) { // stops interval if paused
                            draw();
                            bruteForceAI();
                            move();
                            collision();
                        }
                    }, 0)
                }
                break;
                 
        }   
    }
    function move() {
        posX += velX;
        posY += velY;
        updated = true; // make sure snake moved before new movement input is registered
        trail.push({x:posX, y:posY}); // drawing tail
        while (trail.length > tail) {
            trail.shift();
        }
    }
    function collision() {
        if ((posX > edge) || (posX < 0) || (posY > edge) || (posY < 0)) { // edge detection
            reset();
        }
        if ((posX == appleX) && (posY == appleY)) { // apple collision
            tail += 1;
            appleX = Math.floor(Math.random() * edge);
            appleY = Math.floor(Math.random() * edge);
        }
        for (var i = trail.length - 1; i >= 0; i--) { 
            if ((trail[i].x == appleX) && (trail[i].y == appleY)) { // reposition apple if it is inside the tail
                appleX = Math.floor(Math.random() * edge);
                appleY = Math.floor(Math.random() * edge);
            }
            if (i < trail.length - 1) { // checking tail collision
                if ((posX == trail[i].x) && (posY == trail[i].y)) {
                    reset();
                }
            }                         
        }
    }
    function draw() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canv.width, canv.height); // background
        if (init == false) { // draws apple and snake if it is not the first open
            ctx.fillStyle = "red";
            ctx.fillRect(appleX * unit, appleY * unit, unit - 1, unit - 1);
            ctx.fillStyle = "lime";
            for (var i = trail.length - 1; i >= 0; i--) {
                ctx.fillRect(trail[i].x * unit, trail[i].y * unit, unit - 1, unit - 1);                        
            } 
        }
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        if (init == false) {
            ctx.fillText("Tail Length: " + tail, canv.width/2, canv.height/4); 
        }
        if (playing == false) {
            ctx.fillText('Press "space" to start!', canv.width/2, canv.height/2);
            ctx.fillText('Use the Arrow Keys to move', canv.width / 2, canv.height / 3 * 2);
            ctx.fillText('Press "b" to use the AI!', canv.width/2, canv.height/5 * 4);  
        }
    }    
}