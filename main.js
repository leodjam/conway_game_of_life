window.onload = function(){

var canvas = document.getElementById('my_canvas');
var ctx = canvas.getContext('2d');
var cellUnit = 20;
var numOfLines = canvas.width /cellUnit;
var cells = {};
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

function updateCellStatus(x, y)
{
    var activeCells = getActiveNeibourghs(x, y);

    if(activeCells < 2 || activeCells > 3){
        if(isCellActive(x,y)){
            killCell(x, y);
        }
    }
    else{
        if(!isCellActive(x,y)){
            activateCell(x,y);
        }
    }
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
    updateCellStatus(x + 1 ,y); //left-side
    updateCellStatus(x - 1 ,y); //right-side
    updateCellStatus(x ,y - 1); //top-side
    updateCellStatus(x ,y + 1); //bottom-side

    //DIAGONALS
    updateCellStatus(x + 1 ,y - 1); //top-left
    updateCellStatus(x - 1 ,y - 1); //top-right
    updateCellStatus(x - 1 ,y + 1); //bottom-left
    updateCellStatus(x + 1 ,y + 1); //bottom-right
}

function updateLiveCellAndAllNeibourghs(x,y)
{
    updateNeibourghs(x,y);
    updateCellStatus(x,y);
}

function nextGeneration()
{
    for (let cell in cells) {
        if(cells[cell] == 1 ){
            updateLiveCellAndAllNeibourghs(parseInt(cell[0]), parseInt(cell.slice(-1)));
        }
    }
}

function createFirstGeneration()
{
    activateCell(3,3);
    activateCell(3,4);
    activateCell(3,2);

    nextGeneration();

    //window.setInterval(function(){
    //}, 100);


    ;
    //killCell(2,3);
    //checkNeibourghs(2,3);
}

function getCellID(x,y)
{
    return x+'-'+y;
}

};

    //For every live cell and for every of its adjacent cells, check how many lives neibourghs has this cells
    //Finaly check live cell for life or death condition.

    //death conditions
    //if current cell has < 2 N
    //if current cell has > 3 N

    //life conditions
    //if current cell has >= 2 N && cell has <= 3 N
    //if cell is dead and has 3 N
