import {graph as make_graph, shuffle} from "./graph.js"
let maze_element = document.getElementById("aldous_broder_maze");
let canvas = maze_element.querySelector("canvas");
let ctx = canvas.getContext("2d");
let step = maze_element.querySelector(".step");
let play = maze_element.querySelector(".play");
let reset = maze_element.querySelector(".reset");
let WIDTH = 500;
let HEIGHT = 500;
let width = 30;
let height = 30;
let temp_width = 0;
let temp_height = 0;
let multiplier = 1;
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
function make_maze_aldous_broder(graph, width, height, visited){
    // pick a random cell in the maze to start
    // pick a random neighbor and if not visited visit it
    // else pick a random neighbor from that cell and visit it
    // repeat until all have been visited
    if(count < width * height - 1){
        let node = graph.nodes[index];
        shuffle(node);
        let x = index % width;
        let y = Math.floor(index / width);
        ctx.fillRect((2 * x + 1) * multiplier, (2 * y + 1) * multiplier, multiplier, multiplier);
        let node_index = node[0].index;
        console.log(node_index);
        if(visited[node_index] == "unvisited"){
            if(node_index == index + 1){
                ctx.fillRect((2 * x + 2) * multiplier, (2 * y + 1) * multiplier, multiplier, multiplier);
                ctx.fillRect((2 * x + 3) * multiplier, (2 * y + 1) * multiplier, multiplier, multiplier);
            }else if(node_index == index - 1){
                ctx.fillRect((2 * x) * multiplier, (2 * y + 1) * multiplier, multiplier, multiplier);
                ctx.fillRect((2 * x - 1) * multiplier, (2 * y + 1) * multiplier, multiplier, multiplier);
            }else if(node_index == index + width){
                ctx.fillRect((2 * x + 1) * multiplier, (2 * y + 2) * multiplier, multiplier, multiplier);
                ctx.fillRect((2 * x + 1) * multiplier, (2 * y + 3) * multiplier, multiplier, multiplier);
            }else if(node_index == index - width){
                ctx.fillRect((2 * x + 1) * multiplier, (2 * y) * multiplier, multiplier, multiplier);
                ctx.fillRect((2 * x + 1) * multiplier, (2 * y - 1) * multiplier, multiplier, multiplier);
            }
            visited[node_index] = "visited";
            count++;
        }
        ctx.fillStyle = "blue";
        ctx.strokeStyle = "blue";
        ctx.fillRect((2 * (node_index % width) + 1) * multiplier, (2 * (Math.floor(node_index/width)) + 1) * multiplier, multiplier, multiplier);
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        index = node_index;
    }else{
        ctx.fillRect((2 * (index % width) + 1) * multiplier, (2 * (Math.floor(index/width)) + 1) * multiplier, multiplier, multiplier);
        finished = true;
        paused = true;
    }
}

function maze_reset(){
    for(let i = 0; i < width * height; i++){
        visited[i] = "unvisited";
    }
    finished = false;
    paused = true;
    play.textContent = "play";
    index = Math.floor(Math.random() * (width * height - 1));
    visited[index] = "visited";
    count = 0;
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

let graph = make_graph(width, height);
let interval = 1;
let finished = false;
let paused = true;
let index = Math.floor(Math.random() * (width * height - 1));
visited[index] = "visited";
let count = 0;
maze_reset();
function render(){
    if(!finished && !paused){
        make_maze_aldous_broder(graph, width, height, visited);
    }
}
setInterval(render, interval);

step.addEventListener("click", ()=>{
    if(paused){
        make_maze_aldous_broder(graph, width, height, visited);
    }
});

play.addEventListener("click", ()=>{
    paused = !paused;
    if(finished){
        maze_reset();
        paused = false;
    }
    play.textContent = paused? "play": "pause";
});

reset.addEventListener("click", ()=>{
    maze_reset();
});