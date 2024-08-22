import {graph as make_graph, shuffle} from "./graph.js"
let maze_element = document.getElementById("growing_tree_maze");
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

function make_maze_growing_tree(width, height, visited, nodes, graph){
    // can configure to be different
    if(nodes.length > 0){
        let node_index = nodes.length - 1;
        node_index = Math.floor(Math.random() * nodes.length);
        let index = nodes[node_index];
        ctx.fillRect(multiplier * (2 * (index % width) + 1), multiplier * (2 * Math.floor(index / width) + 1), multiplier, multiplier);
        let graph_nodes = graph.nodes[index];
        shuffle(graph_nodes);
        for(let i = 0; i < graph_nodes.length; i++){
            let new_index = graph_nodes[i].index;
            if(visited[new_index] == "unvisited"){
                // draw passage
                visited[new_index] = "visited";
                nodes.push(new_index);
                let x = multiplier * (2 * (new_index % width) + 1);
                let y = multiplier * (2 * Math.floor(new_index / width) + 1);
                ctx.fillRect(x, y, multiplier, multiplier);
                if(new_index == index + 1){
                    ctx.fillRect(x - multiplier, y, multiplier, multiplier);
                }else if(new_index == index - 1){
                    ctx.fillRect(x + multiplier, y, multiplier, multiplier);
                }else if(new_index == index + width){
                    ctx.fillRect(x, y - multiplier, multiplier, multiplier);
                }else if(new_index == index - width){
                    ctx.fillRect(x, y + multiplier, multiplier, multiplier);
                }
                return;
            }
            if(i == graph_nodes.length - 1){
                nodes.splice(node_index, 1);
            }
        }
        // remove index from array
    }else{
        finished = true;
        play.textContent = "play";
    }
}
function maze_reset(){
    for(let i = 0; i < width * height; i++){
        visited[i] = "unvisited";
    }
    nodes.length = 0;

    let start = Math.floor(Math.random() * width * height);
    nodes.push(start);
    visited[start] = "visited";
    paused = true;
    finished = false;
    play.textContent = "play";
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
}
let visited = [];
for(let i = 0; i < width * height; i++){
    visited[i] = "unvisited";
}
let nodes = [];
let graph = make_graph(width, height);

let paused = true;
let finished = false;
maze_reset();
let interval = 1;
function render(){
    if(!paused){
        make_maze_growing_tree(width, height, visited, nodes, graph);
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
        make_maze_growing_tree(width, height, visited, nodes, graph);
    }
});

reset.addEventListener("click", ()=>{
    maze_reset();
});