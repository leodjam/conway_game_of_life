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
    activateCell(2,3);
    //killCell(2,3);
    checkNeibourghs(2,3);
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

function fillCell(c1, c2, color)
{
    c1= c1 * cellUnit - cellUnit;
    c2= c2 * cellUnit - cellUnit;
    ctx.fillStyle = color;
    ctx.fillRect(c1 + 0.5 , c2 + 0.5 , cellUnit - 1, cellUnit - 1);
}

function activateCell(c1,c2)
{
    fillCell(c1, c2, "black");
    cells[c1+'-'+c2] = 1;
}

function killCell(c1,c2)
{
    fillCell(c1, c2, "white");
    cells[c1+'-'+c2] = 0;
}

function checkNeibourghs(x,y)
{
    //SIDES
    activateCell(x + 1 ,y); //left-side
    activateCell(x - 1 ,y); //right-side
    activateCell(x ,y - 1); //top-side
    activateCell(x ,y + 1); //bottom-side

    //DIAGONALS
    activateCell(x + 1 ,y - 1); //top-left
    activateCell(x - 1 ,y - 1); //top-right
    activateCell(x - 1 ,y + 1); //bottom-left
    activateCell(x + 1 ,y + 1); //bottom-right



    //For every live cell and for every of its adjacent cells, check how many lives neibourghs has this cells
    //Finaly check live cell for life or death condition.

    //death conditions
    //if current cell has < 2 N
    //if current cell has > 3 N

    //life conditions
    //if current cell has >= 2 N && cell has <= 3 N
    //if cell is dead and has 3 N
}

};
