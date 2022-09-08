

console.log("hello  (:");

$(document).ready(function(){

    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");

    const cell_size = 32;
    const line_width = 1.0;

    const size_x = 128;
    const size_y = 64;

    canvas.height = size_y * cell_size;
    canvas.width = size_x * cell_size;

    function draw_line(squares){
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        //ctx.lineWidth = cell_size * line_width;
        ctx.lineWidth = cell_size * 0.2;
        ctx.beginPath();
        ctx.moveTo((squares[0][0] + 0.5) * cell_size, (squares[0][1] + 0.5) * cell_size);
        for (var square of squares){
            ctx.lineTo((square[0] + 0.5) * cell_size, (square[1] + 0.5) * cell_size);
        }
        ctx.stroke();
        ctx.closePath();
    }

    function draw_tile(square_x, square_y){
       ctx.fillRect(square_x * cell_size, square_y * cell_size, cell_size, cell_size);
    }

    function draw_circle(circle_x, circle_y){
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc((circle_x + 0.5) * cell_size, (circle_y + 0.5) * cell_size, cell_size * line_width/2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    var obstructions = [
    ]

    var start_x = 0;
    var start_y = 0;
    var end_x = size_x - 1;
    var end_y = size_y - 1;

    for (var i = 0; i < size_x * size_y * 0.3; i++){
        var x = Math.floor(Math.random() * size_x);
        var y = Math.floor(Math.random() * size_y);
        if (!(x == start_x && y == start_y) && !(x == end_x && y == end_y)) obstructions.push([x, y]);
    }

    var open_nodes = [];
    var closed_nodes = [];

    var done = false;

    class node{

        constructor(x, y, parent){

            this.x = x;
            this.y = y;
            this.parent = parent;

            this.g_cost = this.parent == null ? 0 : this.parent.g_cost + 1;
            this.h_cost = Math.abs(this.x - end_x) + Math.abs(this.y - end_y);
            this.f_cost = this.g_cost + this.h_cost;

            var possible = true;
            for (var obstruction of obstructions){if (obstruction[0] == x && obstruction[1] == y) {possible = false}}
            for (var closed_node of closed_nodes){if (closed_node.x == x && closed_node.y == y) {possible = false}}

            for (var open_node of open_nodes){if (open_node.x == x && open_node.y == y) {
                possible = false
                if (this.f_cost < open_node.f_cost){
                    possible = true;
                    open_nodes.splice(open_nodes.indexOf(open_node), 1);
                }
            }}
            if (x < 0 || x >= size_x || y < 0 || y >= size_y) possible = false;
            if(possible) open_nodes.push(this);
        }
        explore(){
            open_nodes.splice(open_nodes.indexOf(this), 1);
            closed_nodes.push(this);

            var left = new node(this.x-1, this.y, this);
            var up = new node(this.x, this.y+1, this);
            var right = new node(this.x+1, this.y, this);
            var down = new node(this.x, this.y-1, this);

            if (left.x == end_x && left.y == end_y) return left;
            if (up.x == end_x && up.y == end_y) return up;
            if (right.x == end_x && right.y == end_y) return right;
            if (down.x == end_x && down.y == end_y) return down;
            return null;
        }
    }

    function trace(some_node){
        var path = [];
        while(some_node != null){
            path.push([some_node.x, some_node.y]);
            some_node = some_node.parent;
        }
        ctx.strokeStyle = "slateblue";
        draw_line(path);
    }

    var root = new node(start_x, start_y, null);
    var end_node = null;

    var current = root;
    requestAnimationFrame(function Update(){

        // draw everyghing
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#6b5b95";
        for (var obstruction of obstructions){
            draw_tile(obstruction[0], obstruction[1])
        }

        ctx.fillStyle = "#ff7b25";
        for (var current_node of open_nodes){
            draw_circle(current_node.x, current_node.y);
        }

        ctx.fillStyle = "#feb236";
        for (current_node of closed_nodes){
            draw_circle(current_node.x, current_node.y);
        }

        ctx.fillStyle = "#d64161";
        draw_tile(end_x, end_y);
        draw_tile(start_x, start_y);
        draw_circle(current.x, current.y)

        var running_node = current;
        ctx.strokeStyle = "#d64161";
        var path = [];
        while(running_node != null){
            path.push([running_node.x, running_node.y]);
            running_node = running_node.parent;
        }
        draw_line(path);

        // algorithm

        if (end_node == null){
            current = open_nodes.reduce((prev, curr) => {return prev.f_cost < curr.f_cost ? prev : curr;}); //get node with least cost
            end_node = current.explore();
        } else {
            current = end_node;
        }

        setTimeout(()=>requestAnimationFrame(Update), 0);
    });
})