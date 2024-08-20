import {graph as make_graph, shuffle} from "./graph.js"

let maze_element = document.getElementById("wilsons_maze");
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

canvas.width = WIDTH;
canvas.height = HEIGHT;
maze_element.style.maxWidth = `${WIDTH}px`;
maze_element.style.maxHeight = `${HEIGHT + 50}px`;



// need to have a subroutine to render a set
function render_set(set){
    let last = undefined;
    for(const value of set){
        let index_x = value % width;
        let index_y = Math.floor(value / width);
        let x = multiplier * (2 * index_x + 1);
        let y = multiplier * (2 * index_y + 1);
        ctx.fillRect(x, y, multiplier, multiplier);
        if(last == undefined){
            last = value;
            continue;
        }
        if(value == last + 1){
            ctx.fillRect(x - multiplier, y, multiplier, multiplier);
        }else if(value == last - 1){
            ctx.fillRect(x + multiplier, y, multiplier, multiplier);
        }else if(value == last - width){
            ctx.fillRect(x, y + multiplier, multiplier, multiplier);
        }else if(value == last + width){
            ctx.fillRect(x, y - multiplier, multiplier, multiplier);
        }
        last = value;
    }
}
function make_maze_wilsons(width, height, visited, walk, indices, graph){
    // start from a random spot and do a randm walk to a random location
    // add each index to a set and check if it already has it
    // if it does then delete everything in the set after that index
    // at each index check if it's visited
    // if so then change status of all items in set to visited and select a new random index
    if(walk.size > 0){
        let nodes = graph.nodes[[...walk][walk.size - 1]];
        shuffle(nodes);
        let node = nodes[0].index;
        if(walk.has(node)){
            // delete all following it
            let rem = false;
            let last = undefined;
            ctx.fillStyle = "black";
            ctx.strokeStyle = "black";
            for(const value of walk){
                if(value == node){
                    rem = true;
                    last = value;
                    continue;
                }
                if(rem){
                    walk.delete(value);
                    if(visited[value] == "visited"){
                        last = value;
                        continue;
                    }
                    let x = multiplier * (2 * (value % width) + 1);
                    let y = multiplier * (2 * Math.floor(value / width) + 1);
                    ctx.fillRect(x, y, multiplier, multiplier);
                    if(visited[last] == "visited"){
                        last = value;
                        continue;
                    }
                    if(last == undefined){
                        last = value;
                        continue;
                    }
                    if(last == value - 1){
                        ctx.fillRect(x - multiplier, y, multiplier, multiplier);
                    }else if(last == value + 1){
                        ctx.fillRect(x + multiplier, y, multiplier, multiplier);
                    }else if(last == value + width){
                        ctx.fillRect(x, y + multiplier, multiplier, multiplier);
                    }else if(last == value - width){
                        ctx.fillRect(x, y - multiplier, multiplier, multiplier);
                    }
                    last = value;
                }
                last = value;
            }
            ctx.fillStyle = "white";
            ctx.strokeStyle = "white";
            return;
        }
        walk.add(node);
        render_set(walk);
        if(visited[node] == "visited"){
            // mark all as visited and draw
            for(const value of walk){
                visited[value] = "visited";
            }
            walk.clear();
            let temp = 0;
            while(temp < width * height && visited[indices[temp]] == "visited"){
                temp++;
            }
            if(temp >= width * height){
                return;
            }
            walk.add(indices[temp]);
            return;
        }
    }else{
        finished = true;
        play.textContent = "play";
        paused = true;
    }
}

function maze_reset(){
    paused = true;
    finished = false;
    for(let i = 0; i < width * height; i++){
        visited[i] = "unvisited";
        indices[i] = i;
    }
    shuffle(indices);
    start = Math.floor(Math.random() * width * height);
    target = Math.floor(Math.random() * width * height);
    while(start == target){
        target = Math.floor(Math.random() * width * height);
    }
    walk.clear();
    walk.add(start);
    visited[target] = "visited";
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.fillRect(0,0, WIDTH, HEIGHT);
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
    play.textContent = "play";
    started = false;
}

let paused = true;
let finished = false;
let started = false;
let visited = [];
let indices = [];
let graph = make_graph(width, height);
let walk = new Set();
let start = Math.floor(Math.random() * width * height);
let target = Math.floor(Math.random() * width * height);

let interval = 1;
maze_reset();
function render(){
    if(!paused){
        make_maze_wilsons(width, height, visited, walk, indices, graph);
    }
}
setInterval(render, interval);


step.addEventListener("click", ()=>{
    make_maze_wilsons(width, height, visited, walk, indices, graph);
});

play.addEventListener("click", ()=>{
    paused = !paused;
    if(finished){
        maze_reset();
        paused = false;
    }
    if(!started){
        started = true;
        ctx.fillRect(multiplier * (2 * (target % width) + 1), multiplier * (2 * Math.floor(target / width) + 1), multiplier, multiplier);
    }
    play.textContent = paused? "play": "pause";
});

reset.addEventListener("click", ()=>{
    maze_reset();
});