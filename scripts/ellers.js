import {graph as make_graph, shuffle, render_maze} from './graph.js'
let maze_element = document.getElementById("ellers_maze");
let canvas = document.getElementById("ellers_canvas");
let ctx = canvas.getContext("2d");

let WIDTH = 500;
let HEIGHT = 500;

// need to get this to work for each individual node
// use some sort of state
function make_maze_ellers(grid, width, height, sets){
    // somehow have some collection of sets
    let i = counter;
    if(counter < width - 1){
        for(let j = 0; j < width - 1; j++){
            // merge between two indices if random is 1 or if in same set
            let num = Math.round(Math.random());
            let index = i * width + j; 
            if(num == 1 || sets[index] == sets[index + 1]){
                grid[index].right = true;
                grid[index + 1].left = true;
            }else{
                // need to merge all indices in set not just this one
                let set_index = sets[index + 1];
                for(let z = 0; z < width * height; z++){
                    if(sets[z] == set_index){
                        sets[z] = sets[index];
                    }
                }
            }
        }
        let used = [];
        for(let j = 0; j < width * height; j++){
            used[j] = false;
        }
        for(let j = 0; j < width; j++){
            let num = Math.round(Math.random());
            let index = i * width + j;
            let last_index = 0;
            for(let z = i * width; z < (i + 1) * width; z++){
                if(sets[z] == sets[index]){
                    last_index = z;
                }
            }
            let last = last_index == index && !used[sets[last_index]]? true: false;
            if(num == 0 || last){
                // add to set
                // and flag that this set has been used
                used[sets[index]] = true;
                let set_index = sets[index + width];
                for(let z = 0; z < width * height; z++){
                    if(sets[z] == set_index){
                        sets[z] = sets[index];
                    }
                }
                // need to merge sets
            }else{
                // add a wall
                grid[index].bottom = true;
                grid[index + width].top = true;
            }
            sets[index] = -1;
        }
    }else if(counter == width - 1){
        for(let i = (height - 1) * width; i < height * width - 1; i++){
            // join all sets together
            if(sets[i] != sets[i + 1]) continue;
            grid[i].right = true;
            grid[i + 1].left = true;
        }
    }
    counter++;
}



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

let sets = [];
let grid = [];
let visited = [];
for(let i = 0; i < width * height; i++){
    grid[i] = {top:false, left:false, right:false, bottom:false};
    if(i < width) grid[i].top = true;
    if(i % width == 0) grid[i].left = true;
    visited[i] = "visited";
    sets[i] = i;
}

let counter = 0;
let interval = 1;
ctx.fillStyle = "black";
ctx.strokeStyle = "black";
ctx.fillRect(0, 0, WIDTH, HEIGHT);
function render(){
    make_maze_ellers(grid, width, height, sets);
    render_maze(ctx, grid, width, height, visited, WIDTH, HEIGHT, false);
}

setInterval(render, interval);