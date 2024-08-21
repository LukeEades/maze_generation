let maze_element = document.getElementById("sidewinder_maze");
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

function make_maze_sidewinder(width, height, set){
    if(counter < width * height){
        let i = Math.floor(counter / width);
        let j = counter % width;
        counter++;
        if(i == 0){
            ctx.fillRect(multiplier * (2 * j + 1), multiplier * (2 * i + 1), multiplier, multiplier);
            if(j == 0) return;
            ctx.fillRect(multiplier * (2 * j), multiplier * (2 * i + 1), multiplier, multiplier);
            return;
        }
        let rand = Math.round(Math.random());
        // draw index
        ctx.fillRect(multiplier * (2 * j + 1), multiplier * (2 * i + 1), multiplier, multiplier);
        if(rand == 1){
            // join to set
            set.add(j);
            if(j == 0) return;
            ctx.fillRect(multiplier * (2 * j), multiplier * (2 * i + 1), multiplier, multiplier);
        }else{
            if(set.size == 0){
                set.add(j);
                return;
            }
            let rand_index = Math.floor(Math.random() * set.size);
            let val = [...set][rand_index];
            ctx.fillRect(multiplier * (2 * val + 1), multiplier * (2 * i), multiplier, multiplier);
            set.clear();
            set.add(j);
        }
        if(j == width - 1){
            let rand_index = Math.floor(Math.random() * set.size);
            let val = [...set][rand_index];
            ctx.fillRect(multiplier * (2 * val + 1), multiplier * (2 * i), multiplier, multiplier)
            set.clear();
        }
    }else{
       finished = true;
       play.textContent = "play";
    }
}

function maze_reset(){
    paused = true;
    finished = false;
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
    set.clear();
    counter = 0;
    play.textContent = "play";
}


let interval = 1;
let set = new Set();
let counter = 0;
let finished = false;
let paused = true;
maze_reset();
function render(){
    if(!paused){
        make_maze_sidewinder(width, height, set);
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
        make_maze_sidewinder(width, height, set);
    }
});

reset.addEventListener("click", ()=>{
    maze_reset();
});