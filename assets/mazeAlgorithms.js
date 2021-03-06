let visitedList = [];
let started = false;
let redGuy = {
    current: undefined
}
let goal = undefined;
let range = 18;
for(var i = 0;i < range;i++){
    let newRow = $(`<div class="row"></div>`);
    for(var j = 0;j < 12;j++){
        let newColumn = $(`<div class="cell col-md-1" id="${j}-${i}" opened="false"></div>`);
        newRow.append(newColumn);
    }
    $(".container").append(newRow);
}
function arrayize(div){
    let idArray = div.id.split("-");
    return idArray
}
function get(array){
    return document.getElementById(`${parseInt(array[0])}-${parseInt(array[1])}`);
}
function getAbove(div){
    let array = arrayize(div);
    return document.getElementById(`${parseInt(array[0])}-${parseInt(array[1]) - 1}`);
}
function getBelow(div){
    let array = arrayize(div);
    return document.getElementById(`${parseInt(array[0])}-${parseInt(array[1]) + 1}`);
}
function getLeft(div){
    let array = arrayize(div);
    return document.getElementById(`${parseInt(array[0]) - 1}-${parseInt(array[1])}`);
}
function getRight(div){
    let array = arrayize(div);
    return document.getElementById(`${parseInt(array[0]) + 1}-${parseInt(array[1])}`);
}
function getPrevious(div){
    let array = $(div).attr("previd").split("-");
    return document.getElementById(`${parseInt(array[0])}-${parseInt(array[1])}`);
}
let randomI = Math.floor(Math.random() * range);
let randomJ = Math.floor(Math.random() * 12);
let randCell = get([randomJ, randomI]);
randCell.setAttribute("opened", "true");
console.log($(randCell).attr("opened"));
console.log(randCell.id);
function recursiveBacktrack(first, cell){
    if(cell){
        console.log(cell.id);
    } else {
        console.log(first.id);
    }
    let current = cell ? cell : first;
    let directionsArray = ["up", "down", "left", "right"];
    if(!getAbove(current) || $(getAbove(current)).attr("opened") === "true"){
        directionsArray.splice(directionsArray.indexOf("up"), 1);
    }
    if(!getBelow(current) || $(getBelow(current)).attr("opened") === "true"){
        directionsArray.splice(directionsArray.indexOf("down"), 1);
    }
    if(!getLeft(current) || $(getLeft(current)).attr("opened") === "true"){
        directionsArray.splice(directionsArray.indexOf("left"), 1);
    }
    if(!getRight(current) || $(getRight(current)).attr("opened") === "true"){
        directionsArray.splice(directionsArray.indexOf("right"), 1);
    }
    if(directionsArray.length < 1){
        console.log("return");
        if(current.id != first.id){
            recursiveBacktrack(first, getPrevious(current));
        } else {
            //finished!
            startGame();
            return;
        }
    } else {
        setTimeout(function(){
            let randomDirection = directionsArray[Math.floor(Math.random()*directionsArray.length)];
            console.log(randomDirection);
            switch(randomDirection){
                case "up":
                    current.classList.add("up");
                    getAbove(current).setAttribute("opened", "true");
                    getAbove(current).setAttribute("previd", current.id);
                    getAbove(current).classList.add("down");
                    recursiveBacktrack(first, getAbove(current));
                    break;
                case "down":
                    current.classList.add("down")
                    getBelow(current).setAttribute("opened", "true");
                    getBelow(current).setAttribute("previd", current.id);
                    getBelow(current).classList.add("up");
                    recursiveBacktrack(first, getBelow(current));
                    break;
                case "left":
                    current.classList.add("left");
                    getLeft(current).setAttribute("opened", "true");
                    getLeft(current).setAttribute("previd", current.id);
                    getLeft(current).classList.add("right");
                    recursiveBacktrack(first, getLeft(current));
                    break;
                case "right":
                    current.classList.add("right");
                    getRight(current).setAttribute("opened", "true");
                    getRight(current).setAttribute("previd", current.id);
                    getRight(current).classList.add("left");
                    recursiveBacktrack(first, getRight(current));
                    break;
                default:
                    break;
            }
        }, 100);
    }
}

function huntAndKill(cell){
    let current = cell;
    if(!visitedList.includes(current.id)){
        visitedList.push(current.id);
    }
    let directionsArray = ["up", "left", "right", "down"];
    if(!getAbove(current) || visitedList.includes(getAbove(current).id)){
        directionsArray.splice(directionsArray.indexOf("up"), 1);
    }
    if(!getBelow(current) || visitedList.includes(getBelow(current).id)){
        directionsArray.splice(directionsArray.indexOf("down"), 1);
    }
    if(!getLeft(current) || visitedList.includes(getLeft(current).id)){
        directionsArray.splice(directionsArray.indexOf("left"), 1);
    }
    if(!getRight(current) || visitedList.includes(getRight(current).id)){
        directionsArray.splice(directionsArray.indexOf("right"), 1);
    }
    if(directionsArray.length > 0){
        let randomDirection = directionsArray[Math.floor(Math.random()*directionsArray.length)];
        console.log(randomDirection);
        switch(randomDirection){
            case "up":
                current.classList.add("up");
                visitedList.push(getAbove(current).id);
                getAbove(current).classList.add("down");
                huntAndKill(getAbove(current));
                break;
            case "down":
                current.classList.add("down")
                visitedList.push(getBelow(current).id);
                getBelow(current).classList.add("up");
                huntAndKill(getBelow(current));
                break;
            case "left":
                current.classList.add("left");
                visitedList.push(getLeft(current).id);
                getLeft(current).classList.add("right");
                huntAndKill(getLeft(current));
                break;
            case "right":
                current.classList.add("right");
                visitedList.push(getRight(current).id);
                getRight(current).classList.add("left");
                huntAndKill(getRight(current));
                break;
            default:
                break;
        }
    } else {
        let isComplete = true;
        for(var j = 0;j < 12;j++){
            for(var i = 0;i < range;i++){
                if(!visitedList.includes(`${j}-${i}`)){
                    isComplete = false;
                    let visitedArray = [];
                    if(visitedList.includes(`${j - 1}-${i}`)){
                        visitedArray.push("left");
                    }
                    if(visitedList.includes(`${j + 1}-${i}`)){
                        visitedArray.push("right");
                    }
                    if(visitedList.includes(`${j}-${i - 1}`)){
                        visitedArray.push("up");
                    }
                    if(visitedList.includes(`${j}-${i + 1}`)){
                        visitedArray.push("down");
                    }
                    if(visitedArray.length > 0){
                        let newCell = get([j, i]);
                        let ranDirection = visitedArray[Math.floor(Math.random()*visitedArray.length)];
                        switch(ranDirection){
                            case "up":
                                newCell.classList.add("up");
                                getAbove(newCell).classList.add("down");
                                break;
                            case "down":
                                newCell.classList.add("down")
                                getBelow(newCell).classList.add("up");
                                break;
                            case "left":
                                newCell.classList.add("left");
                                getLeft(newCell).classList.add("right");
                                break;
                            case "right":
                                newCell.classList.add("right");
                                getRight(newCell).classList.add("left");
                                break;
                            default:
                                break;
                        }
                        huntAndKill(newCell);
                    }
                }
            }
        }
        if(isComplete){
            //finished!
            startGame();
            return;
        }
    }
}
let zeroOne = Math.floor(Math.random() * 2);
if(zeroOne > 0){
    huntAndKill(randCell);
    document.title = "Maze: Hunt & Kill Algorithm";
} else {
    recursiveBacktrack(randCell);
    document.title = "Maze: Recursive Backtracking Algorithm";
}

function startGame(){
    if(started){
        return;
    }
    let randI = Math.floor(Math.random() * range);
    let randJ = Math.floor(Math.random() * 12);
    goal = randJ + "-" + randI;
    document.getElementById(goal).style.backgroundColor = "green";
    redGuy.current = "0-0";
    document.getElementById(redGuy.current).style.backgroundColor = "red";
    started = true;
}
//alert("Use the arrow keys to move! Find the green cell!");


window.onkeydown = function(event){
    event.preventDefault();
}
window.onkeyup = function(event){
    event.preventDefault();
    if(redGuy.current){
        let div = document.getElementById(redGuy.current);
        switch(event.key){
            case "ArrowUp":
                if(div.classList.contains("up")){
                    div.style.backgroundColor = "";
                    getAbove(div).style.backgroundColor = "red";
                    redGuy.current = getAbove(div).id;
                }
                break;
            case "ArrowDown":
                if(div.classList.contains("down")){
                    div.style.backgroundColor = "";
                    getBelow(div).style.backgroundColor = "red";
                    redGuy.current = getBelow(div).id;
                }
                break;
            case "ArrowLeft":
                if(div.classList.contains("left")){
                    div.style.backgroundColor = "";
                    getLeft(div).style.backgroundColor = "red";
                    redGuy.current = getLeft(div).id;
                }
                break;
            case "ArrowRight":
                if(div.classList.contains("right")){
                    div.style.backgroundColor = "";
                    getRight(div).style.backgroundColor = "red";
                    redGuy.current = getRight(div).id;
                }
                break;
            default:
                break;
        }
        if(redGuy.current === goal){
            alert("you win");
        }
    }
}

