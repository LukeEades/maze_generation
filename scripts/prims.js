import {graph, shuffle, render_maze} from './graph.js'

let WIDTH = 500;
let HEIGHT = 500;
let canvas = document.getElementById('prims_canvas');
let ctx = canvas.getContext("2d");
let maze_element = document.getElementById('prims_maze');
let reset = document.querySelector('#prims_maze>.reset');
let step = document.querySelector('#prims_maze>.step');
let play = document.querySelector('#prims_maze>.play');

function make_maze_prims(grid, graph, visited){
    // while newset is not same length as old set
    let new_set = [];
    for(let i = 0; i < graph.size; i++){
        new_set[i] = i;
    }
    shuffle(new_set);
    if(num_visited < graph.size){
        num_visited++;
        let cont = false;
        for(let i = 0; i < graph.size; i++){
            if(cont) break;
            let index = new_set[i];
            if(visited[index] == "visited"){
                let node = graph.nodes[index];
                shuffle(node);
                for(let j = 0; j < node.length; j++){
                    let neighbor = node[j].index;
                    if(visited[neighbor] == "unvisited"){
                        cont = true;
                        visited[neighbor] = "visited";
                        if(neighbor == index + 1){
                            grid[index].right = false;
                            grid[neighbor].left = false;
                        }else if(neighbor == index - 1){
                            grid[index].left = false;
                            grid[neighbor].right = false;
                        }else if(neighbor == index + graph.width){
                            grid[index].bottom = false;
                            grid[neighbor].top = false;
                        }else if(neighbor == index - graph.width){
                            grid[index].top = false;
                            grid[neighbor].bottom = false;
                        }
                        break;
                    }
                }
            }
        }
    }else{
        finished = true;
        paused = true;
        play.textContent = "play";
    }
}

function reset_maze(grid, width, height, visited){
    for(let i = 0; i < width * height; i++){
        grid[i] = {top:true, left:true, right:true, bottom:true};
        visited[i] = "unvisited";
    }
    let start_index = Math.floor(Math.random() * new_graph.size);
    visited[start_index] = "visited";
    finished = false;
    num_visited = 0;
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
}
let width = 30;
let height = 30;
let new_graph = graph(width, height);
let grid = [];
for(let i = 0; i < new_graph.size; i++){
    grid[i] = {top:true, left:true, right:true, bottom:true};
}
let visited = [];
let num_visited = 0;
let finished = false;
let paused = true;
let started = false;
let multiplier = 1;
let temp_width = 0;
let temp_height = 0;
while(temp_width < WIDTH && temp_height < HEIGHT){
    temp_width = multiplier * (2 * width + 1);
    temp_height = multiplier * (2 * height + 1);
    multiplier++;
}
WIDTH = temp_width;
HEIGHT = temp_height;

maze_element.style.maxWidth = `${WIDTH}px`;
maze_element.style.maxHeight = `${HEIGHT + 50}px`;
canvas.width = WIDTH;
canvas.height = HEIGHT;
reset_maze(grid, width, height, visited);
paused = true;
let interval = 1;
play.textContent = paused? "play": "pause";
function render(){
    if(!paused){
        make_maze_prims(grid, new_graph, visited, num_visited);
    }
    if(!finished && !paused){
        render_maze(ctx, grid, width, height, visited, WIDTH, HEIGHT, finished);
    }
}
setInterval(render, interval);

play.addEventListener('click', ()=>{
    if(finished || !started){
        started = true;
        reset_maze(grid, width, height, visited);
        paused = false;
        play.textContent = "pause";
    }else{
        paused = !paused;
        play.textContent = paused? "play": "pause";
    }
});

reset.addEventListener('click', ()=>{
    reset_maze(grid, width, height, visited);
    started = true;
    paused = false;
    play.textContent = "pause";
});

step.addEventListener('click', ()=>{
    started = true;
    if(!finished && paused){
        make_maze_prims(grid, new_graph, visited, num_visited);
        render_maze(ctx, grid, width, height, visited, WIDTH, HEIGHT, finished);
    }
});