import {graph, shuffle, set_color} from './graph.js'
let WIDTH = 500;
let HEIGHT = 500;
let canvas = document.getElementById("dfs_canvas");
let ctx = canvas.getContext("2d");
let maze_element  = document.getElementById("dfs_maze");
let reset = document.querySelector("#dfs_maze>.reset");
let play = document.querySelector("#dfs_maze>.play");
let step = document.querySelector("#dfs_maze>.step");

function make_maze_dfs(graph, stack, visited){
    if(stack.length > 0){
        let index = stack.pop();
        let x = multiplier * (2 * (index % width) + 1);
        let y = multiplier * (2 * Math.floor(index / width) + 1);
        if(visited[index] == "start"){
            set_color(ctx, "blue");
            ctx.fillRect(x, y, multiplier, multiplier);
            set_color(ctx, "white");
        }
        let nodes = graph.nodes[index];
        shuffle(nodes);
        for(let i = 0; i < nodes.length; i++){
            let neighbor = nodes[i].index;
            if(visited[neighbor] == "unvisited"){
                stack.push(index);
                stack.push(neighbor);
                visited[neighbor] = "visited"; 
                if(neighbor == index + 1){
                    ctx.fillRect(x + multiplier, y, multiplier, multiplier);
                    set_color(ctx, "blue");
                    ctx.fillRect(x + 2 * multiplier, y, multiplier, multiplier);
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
                }else if(neighbor == index - 1){
                    ctx.fillRect(x - multiplier, y, multiplier, multiplier);
                    set_color(ctx, "blue");
                    ctx.fillRect(x - 2 * multiplier, y, multiplier, multiplier);
                    set_color(ctx, "white");
                }
                break;
            }
            if(i == nodes.length - 1){
                ctx.fillRect(x, y, multiplier, multiplier);
            }
        }
    }else{
        finished = true;
        paused = true;
        play.textContent = "play";     
    }
}

function maze_reset(){
    for(let i = 0; i < width * height; i++){
        visited[i] = "unvisited";
    }
    stack.length = 0;
    let index = Math.floor(Math.random() * width * height);
    stack.push(index);
    visited[index] = "start";
    finished = false;
    paused = true;
    play.textContent = "play";    
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
}

let width = 30;
let height = 30;
let new_graph = graph(width, height);
let temp_width = 0;
let temp_height = 0;
let multiplier = 0;
while(temp_width < WIDTH && temp_height < HEIGHT){
    multiplier++;
    temp_width = multiplier * (width * 2 + 1);
    temp_height = multiplier * (height * 2 + 1);
}
WIDTH = temp_width;
HEIGHT = temp_height;
maze_element.style.maxWidth = `${WIDTH}px`;
maze_element.style.maxHeight = `${HEIGHT + 50}px`;
canvas.width = WIDTH;
canvas.height = HEIGHT;

let stack = [];
let visited = [];
let finished = false;
let paused = true;
maze_reset();
paused = true;
let interval = 1;
function render(){
    if(!paused){
        make_maze_dfs(new_graph, stack, visited);
    }
}

setInterval(render, interval);

reset.addEventListener('click', ()=>{
    maze_reset();
});

play.addEventListener('click', ()=>{
    paused = !paused;
    if(finished){
        maze_reset();
        paused = false;
    }
    play.textContent = paused? "play": "pause";
});

step.addEventListener('click', ()=>{
    if(paused){
        make_maze_dfs(new_graph, stack, visited);
    }
});
