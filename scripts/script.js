
const size_x = 33;
const size_y = 33;

const start_x = 0;
const start_y = 17;

const end_x = 32;
const end_y =17;

var obstacles = [];
var open_nodes = [];
var closed_nodes = [];

class Node extends List{
    constructor(value, next){
        super(value);
        this.next = next;

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
            if (this.f_cost <= open_nodes[i].f_cost){
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
        new Node({x:this.value.x-1, y:this.value.y}, this);
        new Node({x:this.value.x+1, y:this.value.y}, this);
        new Node({x:this.value.x, y:this.value.y-1}, this);
        new Node({x:this.value.x, y:this.value.y+1}, this);
        // close node
        open_nodes.splice(open_nodes.indexOf(this), 1);
        closed_nodes.push(this);
        return false;
    }
}

$(document).ready(function(){

    // setup grid
    const canvas = $("#canvas")[0];
    const grid = new Grid({
        width:      size_x,
        height:     size_y,
        cell_size:  24,
        canvas:     canvas,
        fullscreen: true,
        clickable:  true
    });

    // setup ui
    grid.on_click = (x, y) => {
        for (cell of obstacles)if (cell.x == x && cell.y == y)return;
        for (node of open_nodes)if (node.value.x == x && node.value.y == y)return;
        for (node of closed_nodes)if (node.value.x == x && node.value.y == y)return;
        if (x == start_x && y == start_y) return;
        if (x == end_x && y == end_y) return;
        obstacles.push({x:x, y:y});
    }
    var start = new Node({x:start_x, y:start_y}, null);

    var mode = "Pause";
    $("#pause").click(()=>{mode = "Pause"})
    $("#run").click(()=>{mode = "Run"})
    $("#restart").click(()=>{
        open_nodes = [];
        closed_nodes = [];
        start = new Node({x:start_x, y:start_y}, null);
    })
    $("#reset").click(()=>{
        open_nodes = [];
        closed_nodes = [];
        obstacles = [];
        start = new Node({x:start_x, y:start_y}, null);
    })

    grid.redraw = ()=>{
        grid.clear();
        for(cell of obstacles) grid.draw_square(cell, "crimson", 0.2);
        for(node of open_nodes) grid.draw_square(node.value, "green", 0.2);
        for(node of closed_nodes) grid.draw_square(node.value, "blue", 0.2);
        grid.draw_square({x:start_x, y:start_y}, "lightblue", 0.2);
        grid.draw_square({x:end_x, y:end_y}, "lightblue", 0.2);
        grid.draw_line(open_nodes[0], "lightblue", 0.5);
    }

    // define modes
    function Pause(){
        grid.redraw();
        Start();
    }
    
    function Run(){
        grid.redraw();
        // if path done: go to pause mode
        var found = open_nodes[0].explore();
        if (found) mode = "Pause"

        Start();
    };

    // start
    function Start(){
        switch(mode){
            case "Pause":
                requestAnimationFrame(Pause);
                break;
            case "Run":
                requestAnimationFrame(Run);
                break;
        }
    }

    Start();
})