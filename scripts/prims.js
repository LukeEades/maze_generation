import {graph, shuffle, set_color} from './graph.js'

let WIDTH = 500;
let HEIGHT = 500;
let maze_element = document.getElementById("prims_maze");
let canvas = document.getElementById("prims_canvas");
let ctx = canvas.getContext("2d");
let reset = maze_element.querySelector(".reset");
let step = maze_element.querySelector(".step");
let play = maze_element.querySelector(".play");

function make_maze_prims(graph, visited, new_set){
    // if just shuffle once at beginning then it will exhaust all options in one node before moving to the next
    if(new_set.length > 0){
        let set_index = Math.floor(Math.random() * new_set.length);
        let index = new_set[set_index];
        let nodes = graph.nodes[index];
        shuffle(nodes);
        let x = multiplier * (2 * (index % width) + 1);
        let y = multiplier * (2 * Math.floor(index / width) + 1);
        ctx.fillRect(x, y, multiplier, multiplier);
        for(let j = 0; j < nodes.length; j++){
            let neighbor = nodes[j].index;
            if(visited[neighbor] == "unvisited"){
                visited[neighbor] = "visited";
                new_set.push(neighbor);
                if(neighbor == index + 1){
                    ctx.fillRect(x + multiplier, y, multiplier, multiplier);
                    set_color(ctx, "blue");
                    ctx.fillRect(x + 2 * multiplier, y, multiplier, multiplier);
                    set_color(ctx, "white");
                }else if(neighbor == index - 1){
                    ctx.fillRect(x - multiplier, y, multiplier, multiplier);
                    set_color(ctx, "blue");
                    ctx.fillRect(x - 2 * multiplier, y, multiplier, multiplier);
                    set_color(ctx, "white");
                }else if(neighbor == index + graph.width){
                    ctx.fillRect(x, y + multiplier, multiplier, multiplier);
                    set_color(ctx, "blue");
                    ctx.fillRect(x, y + 2 * multiplier, multiplier, multiplier);
                    set_color(ctx, "white");
                }else if(neighbor == index - graph.width){
                    ctx.fillRect(x, y - multiplier, multiplier, multiplier);
                    set_color(ctx, "blue");
                    ctx.fillRect(x, y - 2 * multiplier, multiplier, multiplier);
                    set_color(ctx, "white");
                }
                break;
            }
            if(j == nodes.length - 1){
                new_set.splice(set_index, 1);
            }
        }
    }else{
        finished = true;
        paused = true;
        play.textContent = "play";
        ctx.fillRect(0, multiplier, multiplier, multiplier);
        ctx.fillRect(WIDTH - multiplier, HEIGHT - 2 * multiplier, multiplier, multiplier);
    }
}

function reset_maze(){
    for(let i = 0; i < width * height; i++){
        grid[i] = {top:true, left:true, right:true, bottom:true};
        visited[i] = "unvisited";
    }
    new_set.length = 0;
    let start_index = Math.floor(Math.random() * new_graph.size);
    visited[start_index] = "visited";
    new_set.push(start_index);
    finished = false;
    paused = true;
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
    play.textContent = "play";
}
let width = 30;
let height = 30;
let new_graph = graph(width, height);
let grid = [];
let new_set = [];
for(let i = 0; i < new_graph.size; i++){
    new_set[i] = i;
    grid[i] = {top:true, left:true, right:true, bottom:true};
}
let visited = [];
let finished = false;
let paused = true;
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
reset_maze();
let interval = 1;
function render(){
    if(!paused && !finished){
        make_maze_prims(new_graph, visited, new_set);
    }
}
setInterval(render, interval);

play.addEventListener('click', ()=>{
    paused = !paused;
    if(finished){
        reset_maze();
        paused = false;
    }
    play.textContent = paused? "play": "pause";
});

reset.addEventListener('click', ()=>{
    reset_maze();
});

step.addEventListener('click', ()=>{
    if(paused){
        make_maze_prims(new_graph, visited, new_set);
    }
});