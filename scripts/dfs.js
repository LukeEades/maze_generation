import {graph, shuffle, render_maze} from './graph.js'
let WIDTH = 500;
let HEIGHT = 500;
const dfs_canvas = document.getElementById("dfs_canvas");
const ctx = dfs_canvas.getContext("2d");
const maze_element  = document.getElementById("dfs_maze");
const reset = document.querySelector("#dfs_maze>.reset");
const play = document.querySelector("#dfs_maze>.play");
const maze_step = document.querySelector("#dfs_maze>.step");

// TODO: make it so this can be done in steps and then rendered
function make_maze_dfs(grid, graph, stack, visited){
    if(stack.length > 0){
        // shuffle array
        let index = stack.pop();
        visited[index] = "visited";
        let node = graph.nodes[index];
        shuffle(node);
        for(let i = 0; i < node.length; i++){
            if(visited[node[i].index] == "unvisited"){
                stack.push(index);
                visited[index] = "backtracking";
                let neighbor = node[i].index;
                stack.push(neighbor);
                visited[neighbor] = "visited"; 
                if(neighbor == index + 1){
                    grid[index].right = false;
                    grid[neighbor].left = false;
                }else if(neighbor == index + graph.width){
                    grid[index].bottom = false;
                    grid[neighbor].top = false;
                }else if(neighbor == index - graph.width){
                    grid[index].top = false;
                    grid[neighbor].bottom = false;
                }else if(neighbor == index - 1){
                    grid[index].left = false;
                    grid[neighbor].right = false;
                }
                break;
            }
        }
    }else{
        finished = true;
        paused = true;
        play.textContent = "play";     
    }
}

function maze_reset(grid, width, height, stack, visited){
    for(let i = 0; i < width * height; i++){
        grid[i] = {top:true, left:true, right:true, bottom:true};
        visited[i] = "unvisited";
    }
    stack.length = 0;
    let index = Math.floor(Math.random() * width * height);
    stack.push(index);
    finished = false;
    paused = true;
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
}
let width = 30;
let height = 30;
let new_graph = graph(width, height);
let temp_width = 0;
let temp_height = 0;
let multiplier = 1;
while(temp_width < WIDTH && temp_height < HEIGHT){
    temp_width = multiplier * (width * 2 + 1);
    temp_height = multiplier * (height * 2 + 1);
    multiplier++;
}
WIDTH = temp_width;
HEIGHT = temp_height;
maze_element.style.maxWidth = `${WIDTH}px`;
maze_element.style.maxHeight = `${HEIGHT + 50}px`;
dfs_canvas.width = WIDTH;
dfs_canvas.height = HEIGHT;
let grid = [];
let stack = [];
let visited = [];
let finished = false;
let paused = true;
maze_reset(grid, width, height, stack, visited);
paused = true;
let interval = 1;
function render(){
    // do a step of the maze gen
    if(!paused){
        make_maze_dfs(grid, new_graph, stack, visited);
    }
    if(!finished && !paused){
        render_maze(ctx, grid, width, height, visited, WIDTH, HEIGHT, finished);
    }
}
setInterval(render, interval);

reset.addEventListener('click', ()=>{
    maze_reset(grid, width, height, stack, visited);
    play.textContent = paused? "play": "pause";
});

play.addEventListener('click', ()=>{
    paused = !paused;
    if(finished){
        maze_reset(grid, width, height, stack, visited);
        paused = false;
    }
    play.textContent = paused? "play": "pause";
});

maze_step.addEventListener('click', ()=>{
    if(paused){
        make_maze_dfs(grid, new_graph, stack, visited);
        render_maze(ctx, grid, width, height, visited, WIDTH, HEIGHT, finished);
    }
});

// mazes to implement: (incomplete)
// randomized dfs - done
// randomized prims - done
// randomized kruskals - done
// ellers algorithm - done
// aldous-broder algorithm
// recursive division method
// fractal tessellation
// wilson's algorithm
// cellular automation algos?
// binary tree algorithm
// sidewinder algorithm
// hunt and kill
// growing tree algorithm
// possibly labyrinth