export function graph(width, height){
    let nodes = [];
    let size = width * height;
    for(let i = 0; i < size; i++){
        nodes[i] = [];
    }
    for(let i = 0; i < size; i++){
        let top = i - width;
        let left = i - 1;
        let right = i + 1;
        let bottom = i + width;

        if(top >= 0){
            nodes[i].push({index:top});
        }
        if(left >= 0 && left % width < i % width){
            nodes[i].push({index:left});
        }
        if(right < size && right % width > i % width){
            nodes[i].push({index:right});
        }
        if(bottom < size){
            nodes[i].push({index:bottom});
        }
    }
    return {nodes, width, height, size};
}

export function shuffle(array) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
}
// change so that it only renders new objects
export function render_maze(context, maze, width, height, visited, canvas_width, canvas_height, finished){
    let cell_width = canvas_width/(2 * width + 1);
    let cell_height = canvas_height/(2 * height + 1);
    let count_y = 0;
    context.fillStyle = "white";
    context.strokeStyle = "white";
    for(let i = 0; i < height; i++){
        let count_x = 0;
        count_x++;
        for(let x = 0; x < width; x++){
            if(count_x == 1 && count_y == 0 && finished){
                context.fillRect(count_x++ * cell_width, count_y * cell_height, cell_width, cell_height);
                continue;
            }
            if(!maze[i * width + x].top){
                context.fillRect(count_x++ * cell_width, count_y * cell_height, cell_width, cell_height);
            }else{
                count_x++;
            }
            count_x++;
        }
        count_x = 0;
        count_y++;
        for(let x = 0; x < width; x++){
            if(!maze[i * width + x].left){
                context.fillRect(count_x++ * cell_width, count_y * cell_height, cell_width, cell_height);
            }else{
                count_x++;
            }
            if(visited[i * width + x] == "visited"){
                context.fillRect(count_x++ * cell_width, count_y * cell_height, cell_width, cell_height);
            }else if(visited[i * width + x] == "backtracking"){
                context.fillStyle = "blue";
                context.strokeStyle = "blue";
                context.fillRect(count_x++ * cell_width, count_y * cell_height, cell_width, cell_height);
                context.fillStyle = "white";
                context.strokeStyle = "white";
            }else{
                count_x++;
            }

        }
        if(count_y == height * 2 - 1 && finished){
            context.fillRect(count_x * cell_width, count_y * cell_height, cell_width, cell_height);
        }
        count_y++;
    }
}