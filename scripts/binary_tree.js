let maze_element = document.getElementById("binary_tree_maze");
let canvas = maze_element.querySelector("canvas");
let ctx = canvas.getContext("2d");
let play = maze_element.querySelector(".play");
let step = maze_element.querySelector(".step");
let reset = maze_element.querySelector(".reset");

let WIDTH = 500;
let HEIGHT = 500;

let width = 30;
let height = 30;
let temp_width = 0;
let temp_height = 0;
let multiplier = 0;
while(temp_width < WIDTH && temp_height < HEIGHT){
    multiplier++;
    temp_width = multiplier * (2 * width + 1);
    temp_height = multiplier * (2 * height + 1);
}

WIDTH = temp_width;
HEIGHT = temp_height;

maze_element.style.maxWidth = `${WIDTH}px`;
maze_element.style.maxHeight = `${HEIGHT + 50}px`;
canvas.width = WIDTH;
canvas.height = HEIGHT;


function make_maze_binary_tree(width, height){
    if(counter < width * height - 1){
        let rand = Math.round(Math.random());
        let x = multiplier * (2 * (counter % width) + 1);
        let y = multiplier * (2 * Math.floor(counter / width) + 1);
        ctx.fillRect(x, y, multiplier, multiplier);
        if(counter % width == width - 1){
            rand = 1;
        }
        if(counter >= width * (height - 1)){
            rand = 0;
        }
        if(rand == 0){
            ctx.fillRect(x + multiplier, y, multiplier, multiplier);
        }else{
            ctx.fillRect(x, y + multiplier, multiplier, multiplier);
        }
        counter++;
    }else if(counter == width * height -1){
        let x = multiplier * (2 * (counter % width) + 1);
        let y = multiplier * (2 * Math.floor(counter / width) + 1);
        ctx.fillRect(x, y, multiplier, multiplier);
        finished = true;
        play.textContent = "play";
    }
}

function maze_reset(){
    counter = 0;
    finished = false 
    paused = true;
    play.textContent = "play";
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
}

let counter = 0;
let finished = false;
let paused = true;
maze_reset();
let interval = 1;
function render(){
    if(!paused){
        make_maze_binary_tree(width, height);
    }
}
setInterval(render, interval);

play.addEventListener("click", ()=>{
    paused = !paused;
    if(finished){
        maze_reset();
        paused = false;
    }
    play.textContent = paused? "play": "pause";
});

step.addEventListener("click", ()=>{
    if(paused){
        make_maze_binary_tree(width, height);

    }
});

reset.addEventListener("click", ()=>{
    maze_reset();
})