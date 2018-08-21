window.onload = function(){

var canvas = document.getElementById('my_canvas');
var ctx = canvas.getContext('2d');
canvas.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
canvas.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

var cellUnit = 3;
var numOfLines = canvas.width /cellUnit;
var cells = {};
var state = {};
render();

function render()
{
    blackBackground();
    //createFirstGeneration();
    randomSpawn(45);    

    window.setInterval(function(){
        nextGeneration();
    }, 200);
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

function blackBackground()
{
    ctx.fillStyle = "black";
    ctx.fillRect(0 , 0, canvas.width, canvas.height);
}

function fillCell(x, y, color)
{
    x= x * cellUnit - cellUnit;
    y= y * cellUnit - cellUnit;
    ctx.fillStyle = color;
    ctx.fillRect(x , y, cellUnit, cellUnit);
}

function activateCell(x,y)
{
    fillCell(x, y, "white");
    cells[getCellID(x,y)] = 1;
}

function killCell(x,y)
{
    fillCell(x, y, "black");
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
        var cellName = cell.split('-');
        if(state[cell] == 1 ){
            activateCell(parseInt(cellName[0]), parseInt(cellName[1]));
        }
        else{
            killCell(cellName[0], parseInt(cellName[1]));
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
            var cellName = cell.split('-');
            updateLiveCellAndAllNeibourghs(parseInt(cellName[0]), parseInt(cellName[1]));
        }
    }
    triggerGenerationState();
}

function createFirstGeneration()
{
    /*Blink
    activateCell(0,0);
    activateCell(3,2);
    activateCell(3,3);
    */

    /*Glider
    activateCell(20,2);
    activateCell(21,3);
    activateCell(21,4);
    activateCell(20,4);
    activateCell(19,4);
    */
}

function randomCoordinate()
{
    return Math.floor(Math.random() * numOfLines) + 1;
}

function randomSpawn(power)
{
    for (var i=0; i <  numOfLines * power; i++) {
        activateCell(randomCoordinate(),randomCoordinate());
    }
}

function getCellID(x,y)
{
    return x+'-'+y;
}

};

