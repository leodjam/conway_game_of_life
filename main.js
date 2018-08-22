window.onload = function()
{
var canvas = document.getElementById('my_canvas');
var ctx = canvas.getContext('2d');
canvas.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
canvas.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

//Options
var cellUnit = 3;
var speed = 200;
var spawn = 45;
var cellColors = ['#27fdf5', '#a8f6f8', '#d7fffe', '#f98dc9', '#f765b8'];
var backgroundColor = '#000000';
//
  
var numOfLines = canvas.width / cellUnit;
var cells = {};
var state = {};
render();

function render()
{
    setBackgroundColor();
    randomSpawn(spawn);   

    window.setInterval(function(){
        nextGeneration();
    }, speed);
}

function drawGrid()
{
    var spaceBetweenLines = cellUnit;

    for(var i = 0 ; i < numOfLines ; i++)
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

function setBackgroundColor()
{
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function fillCell(x, y, color)
{
    x = x * cellUnit - cellUnit;
    y = y * cellUnit - cellUnit;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, cellUnit, cellUnit);
}

function activateCell(x, y)
{
    fillCell(x, y, getCellColor());
    cells[getCellID(x, y)] = 1;
}

function killCell(x, y)
{
    fillCell(x, y, backgroundColor);
    cells[getCellID(x, y)] = 0;
}

function isCellActive(x, y)
{
    if(cells.hasOwnProperty(getCellID(x, y))){
        return cells[getCellID(x, y)];
    }
    else{
        return 0;
    }
}

function getCellID(x, y)
{
    return x + '-' + y;
}

function getCellColor()
{
    return cellColors[Math.floor(Math.random() * cellColors.length)];
}

function updateCellState(x, y)
{
    var activeCells = getActiveNeibourghs(x, y);

    if(activeCells == 2)
    {
        return;
    }
    else if(activeCells < 2 || activeCells > 3)
    {
        if(isCellActive(x, y))
        {
            state[getCellID(x, y)] = 0;
        }
    }
    else
    {
        if(!isCellActive(x, y))
        {
            state[getCellID(x, y)] = 1;
        }
    }
}

function triggerGenerationState()
{
    for (let cell in state) 
    {
        var cellName = cell.split('-');
        if(state[cell] == 1 )
        {
            activateCell(parseInt(cellName[0]), parseInt(cellName[1]));
        }
        else
        {
            killCell(cellName[0], parseInt(cellName[1]));
        }
    }
    state = {};
}

function getActiveNeibourghs(x, y)
{
    var activeCells = 0;

    //SIDES
    activeCells += isCellActive(x + 1 , y); //left-side
    activeCells += isCellActive(x - 1 , y); //right-side
    activeCells += isCellActive(x, y - 1); //top-side
    activeCells += isCellActive(x, y + 1); //bottom-side

    //DIAGONALS
    activeCells += isCellActive(x + 1, y - 1); //top-left
    activeCells += isCellActive(x - 1, y - 1); //top-right
    activeCells += isCellActive(x - 1, y + 1); //bottom-left
    activeCells += isCellActive(x + 1, y + 1); //bottom-right

    return activeCells;
}

function updateNeibourghs(x, y)
{
    //SIDES
    updateCellState(x + 1, y); //left-side
    updateCellState(x - 1, y); //right-side
    updateCellState(x, y - 1); //top-side
    updateCellState(x, y + 1); //bottom-side

    //DIAGONALS
    updateCellState(x + 1, y - 1); //top-left
    updateCellState(x - 1, y - 1); //top-right
    updateCellState(x - 1, y + 1); //bottom-left
    updateCellState(x + 1, y + 1); //bottom-right
}

function updateLiveCellAndAllNeibourghs(x, y)
{
    updateNeibourghs(x, y);
    updateCellState(x, y);
}

function nextGeneration()
{
    for (let cell in cells) 
    {
        if(cells[cell] == 1 )
        {
            var cellName = cell.split('-');
            updateLiveCellAndAllNeibourghs(parseInt(cellName[0]), parseInt(cellName[1]));
        }
    }
    triggerGenerationState();
}

function randomCoordinate()
{
    return Math.floor(Math.random() * numOfLines) + 1;
}

function randomSpawn(power)
{
    for (var i = 0; i < numOfLines * power; i++) {
        activateCell(randomCoordinate(), randomCoordinate());
    }
}

};

