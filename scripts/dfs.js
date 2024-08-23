import {graph as make_graph, shuffle, set_color} from "./graph.js"
let max_width = 500;
let max_height = 500;
let WIDTH = 500;
let HEIGHT = 500;
let canvas = document.getElementById("dfs_canvas");
let ctx = canvas.getContext("2d");
let maze_element  = document.getElementById("dfs_maze");
let reset = document.querySelector("#dfs_maze>.reset");
let play = document.querySelector("#dfs_maze>.play");
let step = document.querySelector("#dfs_maze>.step");
let width_range = maze_element.querySelector(".width");
let height_range = maze_element.querySelector(".height");
width_range.addEventListener("input", (event)=>{
    width_range.previousElementSibling.textContent = event.target.value;
});

height_range.addEventListener("input", (event)=>{
    height_range.previousElementSibling.textContent = event.target.value;
});

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
        ctx.fillRect(0, multiplier, multiplier, multiplier);
        ctx.fillRect(WIDTH - multiplier, HEIGHT - 2 * multiplier, multiplier, multiplier);
    }
}

function set_dimensions(){
    width = Number(width_range.value);
    height = Number(height_range.value);
    new_graph = make_graph(width, height);
    let temp_width = 0;
    let temp_height = 0;
    multiplier = 0;
    while(temp_width < max_width && temp_height < max_height){
        multiplier++;
        temp_width = multiplier * (width * 2 + 1);
        temp_height = multiplier * (height * 2 + 1);
    }

    maze_element.style.maxWidth = `${temp_width}px`;
    maze_element.style.maxHeight = `${temp_height + 75}px`;
    canvas.width = temp_width;
    canvas.height = temp_height;
    WIDTH = temp_width;
    HEIGHT = temp_height;
}

function maze_reset(){
    set_dimensions();
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

let width = Number(width_range.value);
let height = Number(height_range.value);
let new_graph = make_graph(width, height);
let multiplier = 0;

let stack = [];
let visited = [];
let finished = false;
let paused = true;
maze_reset();
finished = true;
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