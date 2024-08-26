import {graph as make_graph, shuffle, set_color} from "./graph.js"
let maze_element = document.getElementById("aldous_broder_maze");
let canvas = maze_element.querySelector("canvas");
let ctx = canvas.getContext("2d");
let step = maze_element.querySelector(".step");
let play = maze_element.querySelector(".play");
let reset = maze_element.querySelector(".reset");
let max_width = 500;
let max_height = 500;
let WIDTH = 500;
let HEIGHT = 500;
let width = 30;
let height = 30;
let multiplier = 0;

let dimensions_range = maze_element.querySelector(".dimensions");
let dimensions = maze_element.querySelector(".dimensions_label>div");
dimensions_range.addEventListener("input", (event)=>{
    dimensions.textContent = event.target.value;
});

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
        set_color(ctx, "blue");
        ctx.fillRect((2 * (node_index % width) + 1) * multiplier, (2 * (Math.floor(node_index/width)) + 1) * multiplier, multiplier, multiplier);
        set_color(ctx, "white");
        index = node_index;
    }else if(count == width * height - 1){
        ctx.fillRect((2 * (index % width) + 1) * multiplier, (2 * (Math.floor(index/width)) + 1) * multiplier, multiplier, multiplier);
        finished = true;
        paused = true;
        ctx.fillRect(0, multiplier, multiplier, multiplier);
        ctx.fillRect(WIDTH - multiplier, HEIGHT - 2 * multiplier, multiplier, multiplier);
    }
}

function set_dimensions(){
    width = Number(dimensions.textContent);
    height = width;
    graph = make_graph(width, height);
    let temp_width = 0;
    let temp_height = 0;
    multiplier = 0;
    while(temp_width < max_width && temp_height < max_height){
        multiplier++;
        temp_width = multiplier * (2 * width + 1);
        temp_height = multiplier * (2 * height + 1);
    }
    WIDTH = temp_width;
    HEIGHT = temp_height;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    maze_element.style.maxWidth = `${WIDTH}px`;
    maze_element.style.maxHeight = `${HEIGHT + 75}px`;
}

function maze_reset(){
    set_dimensions();
    for(let i = 0; i < width * height; i++){
        visited[i] = "unvisited";
    }
    finished = false;
    paused = true;
    play.textContent = "play";
    index = Math.floor(Math.random() * (width * height - 1));
    visited[index] = "visited";
    count = 0;
    set_color(ctx, "black");
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    set_color(ctx, "white");
}

let visited = [];

let graph = make_graph(width, height);
let interval = 1;
let finished = false;
let paused = true;
let index = Math.floor(Math.random() * (width * height - 1));
visited[index] = "visited";
let count = 0;
maze_reset();
finished = true;
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