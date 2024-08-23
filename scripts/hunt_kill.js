import {graph as make_graph, shuffle} from "./graph.js"

let maze_element = document.getElementById("hunt_and_kill_maze");
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


function make_maze_hunt(width, height, indices, visited, graph){
    // add each index onto a stack
    // pop an index off the stack and if it is not yet visited do a dfs from that point until it dead-ends
    if(indices.length > 0){
        // pop one off and if is visited skip it
        // else visit it and add random child to stack 
        let index = indices.pop();
        while(visited[index] == "visited"){
            if(indices.length == 0){
                return;
            }
            index = indices.pop();
        }
        let x = multiplier * (2 * (index % width) + 1);
        let y = multiplier * (2 * Math.floor(index / width) + 1);
        if(visited[index] == "stack"){
            // draw old connection
            if(index == 0){
            }
            else if(index < width){
                ctx.fillRect(x - multiplier, y, multiplier, multiplier);
            }else{
                ctx.fillRect(x, y - multiplier, multiplier, multiplier);
            }
        }
        visited[index] = "visited";
        ctx.fillRect(x, y, multiplier, multiplier);
        let nodes = graph.nodes[index];
        shuffle(nodes);
        for(let i = 0; i < nodes.length; i++){
            let new_index = nodes[i].index;
            if(visited[new_index] == "stack" || visited[new_index] == "unvisited"){
                indices.push(new_index);
                visited[new_index] = "unvisited";
                let new_x = multiplier * (2 * (new_index % width) + 1);
                let new_y = multiplier * (2 * Math.floor(new_index / width) + 1);
                ctx.fillRect(new_x, new_y, multiplier, multiplier);
                if(new_index == index + 1){
                    ctx.fillRect(new_x - multiplier, new_y, multiplier, multiplier);
                }else if(new_index == index - 1){
                    ctx.fillRect(new_x + multiplier, new_y, multiplier, multiplier);
                }else if(new_index == index + width){
                    ctx.fillRect(new_x, new_y - multiplier, multiplier, multiplier);
                }else if(new_index == index - width){
                    ctx.fillRect(new_x, new_y + multiplier, multiplier, multiplier);
                }
                // draw connection through wall
                break;
            }
        }
    }else{
        finished = true;
        play.textContent = "play";
        ctx.fillRect(0, multiplier, multiplier, multiplier);
        ctx.fillRect(WIDTH - multiplier, HEIGHT - 2 * multiplier, multiplier, multiplier);
    }
}

function maze_reset(){
    indices.length = 0;
    for(let i = width * height - 1; i >= 0; i--){
        indices.push(i);
        visited[i] = "stack";
    }

    paused = true;
    finished = false;
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
}


let visited = [];
let indices = [];
let graph = make_graph(width, height);
for(let i = width * height - 1; i >= 0; i--){
    indices.push(i);
    visited[i] = "stack";
}

let finished = false;
let paused = true;

let interval = 1;
ctx.fillStyle = "black";
ctx.strokeStyle = "black";
ctx.fillRect(0, 0, WIDTH, HEIGHT);
ctx.fillStyle = "white";
ctx.strokeStyle = "white";
function render(){
    if(!paused && !finished){
        make_maze_hunt(width, height, indices, visited, graph);
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


reset.addEventListener("click", ()=>{
    maze_reset();
    play.textContent = "play";
});


step.addEventListener("click", ()=>{
    if(paused){
        make_maze_hunt(width, height, indices, visited, graph);
    }
});