
class Grid{
    constructor({
        width = 0,
        height = 0,
        cell_size,
        canvas,
        shift_x = width/2,
        shift_y = height/2,
        fullscreen = false,
        clickable = false,
        background_color = "rgba(0, 0, 0, 0)",
        grid_color = "rgba(0, 0, 0, 0)"
    } = {}){
        // initialization
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.cell_size = cell_size;
        this.ctx = this.canvas.getContext("2d");
        this.shift_x = shift_x;
        this.shift_y = shift_y;
        this.grid_color = grid_color;
        this.background_color = background_color;

        // add ui
        if (clickable){
            canvas.addEventListener('click', (event) => {
                this.on_click(
                    Math.floor((event.pageX - this.canvas.offsetLeft - canvas.width/2)/cell_size + this.shift_x),
                    Math.floor((event.pageY - this.canvas.offsetTop - canvas.height/2)/cell_size + this.shift_y)
                );
            }, false);
        }

        if (fullscreen){
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            window.addEventListener('resize', ()=>{
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
                this.redraw();
            }, false)
        }
    }

    on_click(x, y){
        console.log(x, y);
    }

    redraw(){

    }

    draw_square(cell, color, margin){
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            (cell.x - this.shift_x) * this.cell_size + margin/2*this.cell_size + this.canvas.width/2,
            (cell.y - this.shift_y) * this.cell_size + margin/2*this.cell_size + this.canvas.height/2,
            this.cell_size - margin*this.cell_size,
            this.cell_size - margin*this.cell_size
            );
    }

    draw_circle(cell, color, margin){

        // set values
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = 1;

        // draw
        this.ctx.beginPath();
        this.ctx.arc(
            (cell.x + 0.5 - this.shift_x) * this.cell_size + this.canvas.width/2,
            (cell.y + 0.5 - this.shift_y) * this.cell_size + this.canvas.height/2,
            this.cell_size * (1-margin)/2,
            0, 2 * Math.PI
            );
        this.ctx.fill();
        this.ctx.closePath();
    }

    // requires linked list
    draw_line(cells, color, margin){

        // set values
        this.ctx.strokeStyle = color;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        this.ctx.lineWidth = this.cell_size * (1 - margin);

        // draw
        this.ctx.beginPath();
        this.ctx.moveTo(
            (cells.value.x + 0.5 - this.shift_x) * this.cell_size + this.canvas.width/2,
            (cells.value.y + 0.5 - this.shift_y) * this.cell_size + this.canvas.height/2
            );
        var running_cells = cells;
        while(running_cells != null){
            this.ctx.lineTo(
                (running_cells.value.x + 0.5 - this.shift_x) * this.cell_size + this.canvas.width/2,
                (running_cells.value.y + 0.5 - this.shift_y) * this.cell_size + this.canvas.height/2
                );
            running_cells = running_cells.next;
        }

        this.ctx.stroke();
        this.ctx.closePath();
    }

    // requires array
    draw_blob(cells, color, margin){

    }

    clear(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = this.background_color;
        this.ctx.fillRect(
            0, 0, this.canvas.width, this.canvas.height
        )
        
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(
            this.canvas.width/2 - this.shift_x * this.cell_size,
            this.canvas.height/2 - this.shift_y * this.cell_size,
            this.width * this.cell_size,
            this.height * this.cell_size
        )
    }
}