import {set_color} from "./graph.js"
let maze_element = document.getElementById("recursive_division_maze");
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

function choose_horizontal(width, height){
    if(width > height){
        return false;
    }else if(width < height){
        return true;
    }else{
        return Math.floor(Math.random()) == 1;
    }
}

function pos_to_coord(num){
    return multiplier * (2 * num);
}

function get_pos_range(index, bound){
    let num = Math.floor(Math.random() * bound);
    return index + num;
}

function make_maze_recursive_division(stack){
    // TODO: don't let random holes include start or end point
    if(stack.length > 0){
        let item = stack.pop();
        let x = item.x;
        let y = item.y;
        let width = item.width;
        let height = item.height;
        let horizontal = item.horizontal;
        if(width < 2 || height < 2) return;
        if(horizontal){
            let new_y = 1 + get_pos_range(y, height - 1);

            stack.push({x:x, y:y, width:width, height:new_y - y, horizontal: choose_horizontal(width, new_y - y)});
            let screen_x = pos_to_coord(x);
            let screen_y = pos_to_coord(new_y);
            ctx.fillRect(screen_x, screen_y, pos_to_coord(width), multiplier);

            let temp_x = pos_to_coord(get_pos_range(x, width)) + multiplier;
            set_color(ctx, "white");
            ctx.fillRect(temp_x, screen_y, multiplier, multiplier);
            set_color(ctx, "black");
            stack.push({x:x, y:new_y, width:width, height:height - new_y + y, horizontal:choose_horizontal(width, height - new_y + y)});
        }else if(!horizontal){
            let new_x = 1 + get_pos_range(x, width - 1);

            stack.push({x:x, y:y, width:new_x - x, height:height, horizontal:choose_horizontal(new_x - x, height)});
            let screen_x = pos_to_coord(new_x);
            let screen_y = pos_to_coord(y); 

            ctx.fillRect(screen_x, screen_y, multiplier, pos_to_coord(height));
            let temp_y = pos_to_coord(get_pos_range(y, height)) + multiplier;
            set_color(ctx, "white");
            ctx.fillRect(screen_x, temp_y, multiplier, multiplier);
            set_color(ctx, "black");

            stack.push({x:new_x, y:y, width:x + width - new_x, height:height, horizontal:choose_horizontal(x + width - new_x, height)});
        }
    }else{
        finished = true;
        play.textContent = "play";
        set_color(ctx, "white");
        ctx.fillRect(0, multiplier, multiplier, multiplier);
        ctx.fillRect(WIDTH - multiplier, HEIGHT - 2 * multiplier, multiplier, multiplier);
        set_color(ctx, "black");
    }
}

function maze_reset(){
    stack.length = 0;
    stack.push({x:0, y:0, width:width, height:height, horizontal:choose_horizontal(width, height)});
    set_color(ctx, "white");
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    set_color(ctx, "black");
    paused = true;
    finished = false;
    play.textContent = "play";
    ctx.fillRect(0, 0, WIDTH, multiplier);
    ctx.fillRect(WIDTH - multiplier, 0, multiplier, HEIGHT);
    ctx.fillRect(0, HEIGHT - multiplier, WIDTH, multiplier);
    ctx.fillRect(0, 0, multiplier, HEIGHT);
}

let stack = [];

let paused = true;
let finished = false

let interval = 1;
maze_reset();
function render(){
    if(!paused && !finished){
        make_maze_recursive_division(stack);
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
        make_maze_recursive_division(stack);
    }
});

reset.addEventListener("click", ()=>{
    maze_reset();
});