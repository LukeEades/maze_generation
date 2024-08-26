import {graph as make_graph, shuffle, set_color} from './graph.js'
let max_width = 500;
let max_height = 500;
let WIDTH = 0;
let HEIGHT = 0;
let canvas = document.getElementById("kruskals_canvas");
let ctx = canvas.getContext("2d");
let maze_element = document.getElementById("kruskals_maze");
let reset = maze_element.querySelector(".reset");
let play = maze_element.querySelector(".play");
let step = maze_element.querySelector(".step");
let dimensions_range = maze_element.querySelector(".dimensions");
let dimensions = maze_element.querySelector(".dimensions_label>div");
dimensions_range.addEventListener("input", (event)=>{
    dimensions.textContent = event.target.value;
});

let width = Number(dimensions.textContent);
let height = width;
let multiplier = 0;

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

function maze_make_kruskals(new_graph, visited, edges){
    // iterate through graph and select smallest edge at each iteration
    let cont = true;
    while(edges.length){
        if(!cont) return;
        let edge = edges.pop();
        let index = edge.a;
        let neighbor = edge.b;
        let x = multiplier * (2 * (index % width) + 1);
        let y = multiplier * (2 * Math.floor(index / width) + 1);
        new_graph.nodes[index].push({index:neighbor});
        new_graph.nodes[neighbor].push({index:index});
        if(has_cycle(new_graph, index)){
            new_graph.nodes[index].pop();
            new_graph.nodes[neighbor].pop();
        }else{
            if(visited[index] != "visited"){
                ctx.fillRect(x, y, multiplier, multiplier);
            }

            if(visited[neighbor] != "visited"){
                let n_x = multiplier * (2 * (neighbor % width) + 1);
                let n_y = multiplier * (2 * Math.floor(neighbor / width) + 1);
                ctx.fillRect(n_x, n_y, multiplier, multiplier);
            }
            visited[index] = "visited";
            visited[neighbor] = "visited";
            if(neighbor == index + 1){
                ctx.fillRect(x + multiplier, y, multiplier, multiplier);
            }else if(neighbor == index - 1){
                ctx.fillRect(x - multiplier, y, multiplier, multiplier);
            }else if(neighbor == index + width){
                ctx.fillRect(x, y + multiplier, multiplier, multiplier);
            }else if(neighbor == index - width){
                ctx.fillRect(x, y - multiplier, multiplier, multiplier);
            }
            cont = false;
        }
    }
    if(!edges.length){
        finished = true;
        paused = true;
        play.textContent = "play";
        ctx.fillRect(0, multiplier, multiplier, multiplier);
        ctx.fillRect(WIDTH - multiplier, HEIGHT - 2 * multiplier, multiplier, multiplier);
    }
}

function set_dimensions(){
    width = Number(dimensions.textContent);
    height = width;
    graph = make_graph(width, height);
    temp_graph = make_graph(width, height);
    multiplier = 0;
    let temp_width = 0;
    let temp_height = 0;
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
    edges.length = 0;
    for(let i = 0; i < graph.size; i++){
        visited[i] = "unvisited";
        let node = graph.nodes[i];
        for(let j = 0; j < node.length; j++){
            edges.push({a:i, b:node[j].index});
        }
        temp_graph.nodes[i].length = 0;
    }
    shuffle(edges);
    finished = false;
    paused = true;
    set_color(ctx, "black");
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    set_color(ctx, "white");
    play.textContent = "play";
}


let visited = [];
let edges = [];
let finished = true;
let paused = true;
let graph = make_graph(width, height);
let temp_graph = make_graph(width, height);
maze_reset();
finished = true;

let interval = 1;
function render(){
    if(!paused && !finished){
        maze_make_kruskals(temp_graph, visited, edges);
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
        maze_make_kruskals(temp_graph, visited, edges);
    }
});