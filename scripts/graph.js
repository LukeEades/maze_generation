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

export function set_color(ctx, color){
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
}