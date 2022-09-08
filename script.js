
const size_x = 16;
const size_y = 16;

const start_x = 0;
const start_y = 0;

const end_x = 15;
const end_y = 15;

var obstacles = [
    {x:5,y:0}
];
var open_nodes = [];
var closed_nodes = [];

class Node extends List{
    constructor(value){
        super(value);

        // dont initialize node if at same place as obstacle or closed node
        for(var node of closed_nodes) if (node.value.x == value.x && node.value.y == value.y) return;
        for(var cell of obstacles) if (cell.x == value.x && cell.y == value.y) return;

        // initialize node
        this.g_cost = this.next == null ? 0 : this.next.g_cost + 1;
        this.h_cost = Math.abs(this.value.x - end_x) + Math.abs(this.value.y - end_y);
        this.f_cost = this.g_cost + this.h_cost;

        // check if other path was optimized
        for(var i in open_nodes){
            var node = open_nodes[i];
            if (node.value.x == value.x && node.value.y == value.y){
                if (this.f_cost < node.f_cost){
                    open_nodes.splice(i, 1);
                    break;
                } else {
                    return;
                }
            }
        }

        // sort node in at right place in open_nodes
        for (var i in open_nodes) {
            if (this.f_cost < open_nodes[i].h_cost){
                open_nodes.splice(i, 0, this);
                return;
            }
        }
        open_nodes.push(this);
    }

    explore(){

        // check if end is reached
        if (this.value.x == end_x && this.value.y == end_y) return true;

        // create neighbors
        new Node({x:this.value.x-1, y:this.value.y}).next = this;
        new Node({x:this.value.x+1, y:this.value.y}).next = this;
        new Node({x:this.value.x, y:this.value.y-1}).next = this;
        new Node({x:this.value.x, y:this.value.y+1}).next = this;

        // close node
        open_nodes.splice(open_nodes.indexOf(this), 1);
        closed_nodes.push(this);
        return false;
    }
}

$(document).ready(function(){

    const canvas = $("#canvas")[0];
    canvas.width = 1500;
    canvas.height = 750;
    const grid = new Grid(size_x, size_y, 24, canvas);
    const start = new Node({x:start_x, y:start_y}, null);

    requestAnimationFrame(function Update(){
        grid.clear();

        // draw everything
        for(cell of obstacles) grid.draw_square(cell, "white", 0.1);
        for(node of open_nodes) grid.draw_square(node.value, "green", 0.1);
        for(node of closed_nodes) grid.draw_square(node.value, "blue", 0.1);
        grid.draw_square({x:start_x, y:start_y}, "lightblue", 0.1);
        grid.draw_square({x:end_x, y:end_y}, "lightblue", 0.1);

        console.log(open_nodes);
        var found = open_nodes[0].explore();

        if (!found) setTimeout(()=>requestAnimationFrame(Update), 20);
    });
})