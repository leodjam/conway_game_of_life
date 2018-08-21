window.onload = function(){

var canvas = document.getElementById('my_canvas');
var ctx = canvas.getContext('2d');
var cellUnit = 20;
var numOfLines = canvas.width /cellUnit;
var cells = {};
var state = {};
render();

function render()
{
    drawGrid();
    createFirstGeneration();
}

function drawGrid()
{
    var spaceBetweenLines = cellUnit;

    for(var i=0 ; i < numOfLines ; i++)
    {
        ctx.beginPath();
        ctx.moveTo(0, spaceBetweenLines);
        ctx.lineTo(canvas.width, spaceBetweenLines);
        ctx.stroke();
            
        ctx.beginPath();
        ctx.moveTo(spaceBetweenLines, 0);
        ctx.lineTo(spaceBetweenLines, canvas.height);
        ctx.stroke();

        spaceBetweenLines += cellUnit;
    }
}

function fillCell(x, y, color)
{
    x= x * cellUnit - cellUnit;
    y= y * cellUnit - cellUnit;
    ctx.fillStyle = color;
    ctx.fillRect(x + 0.5 , y + 0.5 , cellUnit - 1, cellUnit - 1);
}

function activateCell(x,y)
{
    fillCell(x, y, "black");
    cells[getCellID(x,y)] = 1;
}

function killCell(x,y)
{
    fillCell(x, y, "white");
    cells[getCellID(x,y)] = 0;
}

function updateCellState(x, y)
{
    var activeCells = getActiveNeibourghs(x, y);

    if(activeCells == 2){
        return;
    }
    else if(activeCells < 2 || activeCells > 3){
        if(isCellActive(x,y)){
            state[getCellID(x,y)] = 0;
        }
    }
    else{
        if(!isCellActive(x,y)){
            state[getCellID(x,y)] = 1;
        }
    }
}

function triggerGenerationState()
{
    for (let cell in state) {
        if(state[cell] == 1 ){
            activateCell(parseInt(cell[0]), parseInt(cell.slice(-1)));
        }
        else{
            killCell(parseInt(cell[0]), parseInt(cell.slice(-1)));
        }
    }
    state = {};
}

function getActiveNeibourghs(x, y)
{
    var activeCells = 0;

    //SIDES
    activeCells += isCellActive(x + 1 ,y); //left-side
    activeCells += isCellActive(x - 1 ,y); //right-side
    activeCells += isCellActive(x ,y - 1); //top-side
    activeCells += isCellActive(x ,y + 1); //bottom-side

    //DIAGONALS
    activeCells += isCellActive(x + 1 ,y - 1); //top-left
    activeCells += isCellActive(x - 1 ,y - 1); //top-right
    activeCells += isCellActive(x - 1 ,y + 1); //bottom-left
    activeCells += isCellActive(x + 1 ,y + 1); //bottom-right

    return activeCells;
}

function isCellActive(x, y)
{
    if(cells.hasOwnProperty(getCellID(x,y))){
        return cells[getCellID(x,y)];
    }
    else{
        return 0;
    }
}

function updateNeibourghs(x,y)
{
    //SIDES
    updateCellState(x + 1 ,y); //left-side
    updateCellState(x - 1 ,y); //right-side
    updateCellState(x ,y - 1); //top-side
    updateCellState(x ,y + 1); //bottom-side

    //DIAGONALS
    updateCellState(x + 1 ,y - 1); //top-left
    updateCellState(x - 1 ,y - 1); //top-right
    updateCellState(x - 1 ,y + 1); //bottom-left
    updateCellState(x + 1 ,y + 1); //bottom-right
}

function updateLiveCellAndAllNeibourghs(x,y)
{
    updateNeibourghs(x,y);
    updateCellState(x,y);
}

function nextGeneration()
{
    for (let cell in cells) {
        if(cells[cell] == 1 ){
            updateLiveCellAndAllNeibourghs(parseInt(cell[0]), parseInt(cell.slice(-1)));
        }
    }
    triggerGenerationState();
}

function createFirstGeneration()
{
    activateCell(3,3);
    activateCell(3,4);
    activateCell(3,2);

    window.setInterval(function(){
        nextGeneration();
    }, 200);
}

function getCellID(x,y)
{
    return x+'-'+y;
}

};

