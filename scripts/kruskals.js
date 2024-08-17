import {graph as make_graph, shuffle, render_maze} from './graph.js'
let WIDTH = 500;
let HEIGHT = 500;
let canvas = document.getElementById("kruskals_canvas");
let ctx = canvas.getContext("2d");
let maze_element = document.getElementById("kruskals_maze");
let reset = maze_element.querySelector(".reset");
let play = maze_element.querySelector(".play");
let step = maze_element.querySelector(".step");

let width = 30;
let height = 30;
let multiplier = 1;
let temp_width = 0;
let temp_height = 0;

// maybe here?
function has_cycle(graph, index, parent = -1, visited = null){
    if(visited == null){
        visited = [];
        for(let i = 0; i < graph.size; i++){
            visited[i] = false;
        }
    }
    visited[index] = true;
    let node = graph.nodes[index];
    for(let i = 0; i < node.length; i++){
        if(!visited[node[i].index]){
            if(has_cycle(graph, node[i].index, index, visited)){
                return true;
            }
        }else if(node[i].index != parent){
            return true;
        }
    }
    return false;
}

function maze_make_kruskals(grid, new_graph, visited, edges){
    // iterate through graph and select smallest edge at each iteration
    let cont = true;
    while(edges.length){
        if(!cont) return;
        let edge = edges.pop();
        let index = edge.a;
        let neighbor = edge.b;
        new_graph.nodes[index].push({index:neighbor});
        new_graph.nodes[neighbor].push({index:index});
        if(has_cycle(new_graph, index)){
            new_graph.nodes[index].pop();
            new_graph.nodes[neighbor].pop();
        }else{
            visited[index] = "visited";
            visited[neighbor] = "visited";
            if(neighbor == index + 1){
                grid[index].right = false;
                grid[neighbor].left = false;
            }else if(neighbor == index - 1){
                grid[index].left = false;
                grid[neighbor].right = false;
            }else if(neighbor == index + new_graph.width){
                grid[index].bottom = false;
                grid[neighbor].top = false;
            }else if(neighbor == index - new_graph.width){
                grid[index].top = false;
                grid[neighbor].bottom = false;
            }
            cont = false;
        }
    }
    if(!edges.length){
        finished = true;
        paused = true;
        play.textContent = "play";
    }
}

function maze_reset(graph, new_graph, grid, visited, edges){
    edges.length = 0;
    for(let i = 0; i < new_graph.size; i++){
        new_graph.nodes[i].length = 0;
        grid[i] = {top:true, left:true, right:true, bottom:true};
        visited[i] = "unvisited";
        let node = graph.nodes[i];
        for(let j = 0; j < node.length; j++){
            edges.push({a:i, b:node[j].index});
        }
    }
    shuffle(edges);
    finished = false;
    paused = true;
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    play.textContent = "play";
}

while(temp_width < WIDTH && temp_height < HEIGHT){
    multiplier++;
    temp_width = multiplier * (2 * width + 1);
    temp_height = multiplier * (2 * height + 1);
}
WIDTH = temp_width;
HEIGHT = temp_height;

canvas.width = WIDTH;
canvas.height = HEIGHT;
maze_element.style.maxWidth = `${WIDTH}px`;
maze_element.style.maxHeight = `${HEIGHT + 50}px`;

let new_graph = make_graph(width, height);
let grid = [];
let visited = [];
let edges = [];
let finished = false;
let paused = true;
let temp_graph = make_graph(new_graph.width, new_graph.height);
maze_reset(new_graph, temp_graph, grid, visited, edges);
paused = true;
shuffle(edges);

let interval = 1;
function render(){
    if(!paused){
        maze_make_kruskals(grid, temp_graph, visited, edges);
    }
    if(!finished && !paused){
        render_maze(ctx, grid, width, height, visited, WIDTH, HEIGHT, false);
    }
}
setInterval(render, interval);


reset.addEventListener('click', ()=>{
    maze_reset(new_graph, temp_graph, grid, visited, edges);
});

play.addEventListener('click', ()=>{
    paused = !paused;
    if(finished){
        maze_reset(new_graph, temp_graph, grid, visited, edges);
        paused = false;
    }
    play.textContent = paused? "play": "pause";
});

step.addEventListener('click', ()=>{
    if(paused){
        maze_make_kruskals(grid, temp_graph, visited, edges);
        render_maze(ctx, grid, width, height, visited, WIDTH, HEIGHT, false);
    }
});