let maze_element = document.getElementById("ellers_maze");
let canvas = document.getElementById("ellers_canvas");
let ctx = canvas.getContext("2d");
let step = maze_element.querySelector(".step");
let play = maze_element.querySelector(".play");
let reset = maze_element.querySelector(".reset");

let max_width = 500;
let max_height = 500;
let WIDTH = 500;
let HEIGHT = 500;

let dimensions_range = maze_element.querySelector(".dimensions");
let dimensions = maze_element.querySelector(".dimensions_label>div");
dimensions_range.addEventListener("input", (event)=>{
    dimensions.textContent = event.target.value;
});

// need to get this to work for each individual node
// use some sort of state
function make_maze_ellers_step(width, height, sets, used, visited){
    // somehow have some collection of sets
    let i = Math.floor(counter / width);
    let j = counter % width;
    if(counter < width * height - 1){
        visited[counter] = "visited";
        if(state == "row"){
            let num = Math.round(Math.random());
            let index = i * width + j; 
            if(num == 1 || sets[index] == sets[index + 1]){
                ctx.fillRect(pos_x * multiplier, pos_y * multiplier, multiplier, multiplier);
                pos_x += 2;
                ctx.fillRect(pos_x * multiplier, pos_y * multiplier, multiplier, multiplier);

            }else{
                // need to merge all indices in set not just this one
                ctx.fillRect(pos_x * multiplier, pos_y * multiplier, multiplier, multiplier);
                pos_x++;
                ctx.fillRect(pos_x * multiplier, pos_y * multiplier, multiplier, multiplier);
                pos_x++;
                ctx.fillRect(pos_x * multiplier, pos_y * multiplier, multiplier, multiplier);
                let set_index = sets[index + 1];
                for(let z = 0; z < width * height; z++){
                    if(sets[z] == set_index){
                        sets[z] = sets[index];
                    }
                }
            }
            if(j + 1 >= width - 1){
                state = "floor";
                pos_x = 1;
                counter -= width - 1;
                for(let z = 0; z < width * height; z++){
                    used[z] = false;
                }
            }
        }else if(state == "floor"){
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
                ctx.fillRect(pos_x * multiplier, pos_y * multiplier, multiplier, multiplier);
                ctx.fillRect(pos_x * multiplier, (pos_y + 1) * multiplier, multiplier, multiplier);
                ctx.fillRect(pos_x * multiplier, (pos_y + 2) * multiplier, multiplier, multiplier);
                used[sets[index]] = true;
                let set_index = sets[index + width];
                for(let z = 0; z < width * height; z++){
                    if(sets[z] == set_index){
                        sets[z] = sets[index];
                    }
                }
            }else{
                ctx.fillRect(pos_x * multiplier, pos_y * multiplier, multiplier, multiplier);
            }
            pos_x += 2;
            sets[index] = -1;
            if(j + 1 >= width){
                state = "row";
                pos_y+= 2;
                pos_x = 1;
                if(counter + 1 >= width * height - width){
                    state = "bottom";
                }
            }
        }else if(state == "bottom"){
            // join all sets together
            if(sets[counter] != sets[counter + 1]){
                ctx.fillRect((pos_x) * multiplier, pos_y * multiplier, multiplier, multiplier);
                ctx.fillRect((pos_x + 1) * multiplier, pos_y * multiplier, multiplier, multiplier);
                ctx.fillRect((pos_x + 2) * multiplier, pos_y * multiplier, multiplier, multiplier);

                let set_index = sets[counter + 1];
                for(let z = 0; z < width * height; z++){
                    if(sets[z] == set_index){
                        sets[z] = sets[counter];
                    }
                }
            }
            pos_x += 2;
        }
        counter++;
    }else if(counter == width * height - 1){
        finished = true;
        visited[counter] = "visited";
        paused = true;
        play.textContent = "play";
        ctx.fillRect(0, multiplier, multiplier, multiplier);
        ctx.fillRect(WIDTH - multiplier, HEIGHT - 2 * multiplier, multiplier, multiplier);
    }
}

function set_dimensions(){
    width = Number(dimensions.textContent);
    height = width;
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
        sets[i] = i;
        used[i] = false;
    }
    finished = false;
    paused = true;
    counter = 0;
    play.textContent = "play";
    state = "row";
    pos_x = 1;
    pos_y = 1;
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
}


let width = 30;
let height = 30;
let temp_width = 0;
let temp_height = 0;
let multiplier = 0;


let pos_x = 1;
let pos_y = 1;
let sets = [];
let state = "row";
let visited = [];
let paused = true;
let finished = false;
let used = [];
let counter = 0;
let interval = 1;
maze_reset();
finished = true;
function render(){
    if(!paused && !finished){
        make_maze_ellers_step(width, height, sets, used, visited);
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
});

step.addEventListener("click", ()=>{
    if(paused){
        make_maze_ellers_step(width, height, sets, used, visited);
    }
});