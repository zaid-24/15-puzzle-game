let width = 4;
let height = 4;
let container = document.getElementById('board-container');
let finalcolor = "#a11902", finalfontcolor = "fff";
let initialcolor = "#000000", initialfontcolor = "fff";
let time = 0, flag = false, moves = 0;
let time_interval;
update_bestScore();

function update_bestScore() {
    let besttime = localStorage.getItem('time');
    let leastmoves = localStorage.getItem('leastmoves');
    if (besttime != null && leastmoves != null) {
        besttime = parseInt(besttime);
        let mins = parseInt(besttime / 60);
        let seconds = besttime % 60;
        if (mins < 10) mins = "0" + String(mins);
        else mins = String(mins);
        if (seconds < 10) seconds = "0" + String(seconds);
        else seconds = String(seconds);
        document.getElementById("besttime").innerText = mins + " : " + seconds;
        document.getElementById("leastmoves").innerText = leastmoves;
    }
    else {
        document.getElementById("oldstats").style.display = "none";
    }
}
function swaptiles(id1, id2) {
    let temp = document.getElementById(id2).className;
    document.getElementById(id2).className = document.getElementById(id1).className;
    document.getElementById(id1).className = temp;
    temp = document.getElementById(id2).innerText;
    document.getElementById(id2).innerText = document.getElementById(id1).innerText;
    document.getElementById(id1).innerText = temp;
    moves++;
    if (flag == false) {
        time_calculator();
        flag = true;
    }
}

function input_size() {
    timeron = 1;
    height = parseInt(document.getElementById('getheight').value);
    width = (document.getElementById('getwidth').value);
    if (height > 9 || width > 9 || height < 2 || width < 2) {
        alert('The values of height and width should be in the range 2 to 9');
        return;
    }
    createcells(width, height);
    shuffle();
    window.clearInterval(time_interval);
    moves = 0;
    time = 0;
    flag = false;
    document.getElementById('num').innerText = String(width * height - 1);
    addEvent();
    document.getElementById('inputlenghts').style.display = 'none';
    document.getElementById('won').style.display = 'none';
    document.getElementById('reset').style.display = 'block';
    document.getElementById('stats').style.display = 'flex';
    document.getElementById('oldstats').style.display = 'flex';
    document.getElementById('board-container').style.display = 'flex';
}


function shuffle() {
    timeron=1;
    for (let row = 1; row <= height; row++) {
        for (let column = 1; column <= width; column++) {

            var row2 = Math.floor(Math.random() * height + 1);
            var column2 = Math.floor(Math.random() * width + 1);
            swaptiles("row" + row + "column" + column, "row" + row2 + "column" + column2);
        }
    }
}
function createcells(width, height) {
    let id = 1;
    for (let i = 1; i <= height; i++) {
        let row = document.createElement('div');
        row.classList.add('row');
        row.id = "row" + (i);
        container.appendChild(row);
        for (let j = 1; j <= width; j++) {
            let cell = document.createElement('span');
            cell.classList.add('cell');
            cell.id = "row" + i + "column" + j;
            cell.innerHTML = String(id);
            if (i < height || j < width)
                cell.classList.add("Tile" + id);
            row.appendChild(cell);
            id++;
        }
    }
    document.getElementById('row' + height + 'column' + width).classList.add("empty");
    document.getElementById('row' + height + 'column' + width).innerText = "";
}

function colorchanger() {
    let num = 1, success = 0;
    for (let i = 1; i <= height; i++) {
        for (let j = 1; j <= width; j++) {
            let text = document.getElementById('row' + i + 'column' + j).innerText;
            text = parseInt(text);
            if (text == num) {
                document.getElementById('row' + i + 'column' + j).style.backgroundColor = finalcolor;
                document.getElementById('row' + i + 'column' + j).style.color = finalfontcolor;
                success++;
            }
            else {
                document.getElementById('row' + i + 'column' + j).style.backgroundColor = initialcolor;
                document.getElementById('row' + i + 'column' + j).style.color = initialfontcolor;
            }
            num++;
        }
    }
    return success;
}
function addEvent() {
    for (let i = 1; i <= height; i++) {
        for (let j = 1; j <= width; j++) {
            let id = "row" + i + "column" + j;
            document.getElementById(id).addEventListener('click', function () {
                let emptytile = (document.getElementsByClassName('empty'))[0];
                let emptyid = emptytile.id;
                let emptyrow = emptyid[3], emptycol = emptyid[10];
                let currentrow = (this.id)[3], currentcolumn = (this.id)[10];
                if (currentrow == emptyrow) {
                    if (currentcolumn > emptycol) {
                        let swapid = "row" + emptyrow + "column" + String(parseInt(emptycol) + 1);
                        swaptiles(emptyid, swapid);
                    }
                    else if (currentcolumn < emptycol) {
                        let swapid = "row" + emptyrow + "column" + String(parseInt(emptycol) - 1);
                        swaptiles(emptyid, swapid);
                    }
                }
                else if (currentcolumn == emptycol) {
                    if (currentrow > emptyrow) {
                        let swapid = "row" + String(parseInt(emptyrow) + 1) + "column" + emptycol;
                        swaptiles(emptyid, swapid);
                    }
                    else if (currentrow < emptyrow) {
                        let swapid = "row" + String(parseInt(emptyrow) - 1) + "column" + emptycol;
                        swaptiles(emptyid, swapid);
                    }
                }
                ifwon(colorchanger());
                document.getElementById('moves').innerText = String(moves);
            });
        }
    }
    document.onkeydown = function (e) {
        let emptytile = (document.getElementsByClassName('empty'))[0];
        let emptyid = emptytile.id;
        let emptyrow = emptyid[3], emptycol = emptyid[10];
        switch (e.code) {
            case "ArrowLeft":
                if (parseInt(emptycol) + 1 <= width) {
                    let swapid = "row" + emptyrow + "column" + String(parseInt(emptycol) + 1);
                    swaptiles(emptyid, swapid);
                    ifwon(colorchanger());
                }
                break;
            case "ArrowUp":
                if (parseInt(emptyrow) + 1 <= height) {
                    let swapid = "row" + String(parseInt(emptyrow) + 1) + "column" + emptycol;
                    swaptiles(emptyid, swapid);
                    ifwon(colorchanger());
                }
                break;
            case "ArrowRight":
                if (parseInt(emptycol) - 1 > 0) {
                    let swapid = "row" + emptyrow + "column" + String(parseInt(emptycol) - 1);
                    swaptiles(emptyid, swapid);
                    ifwon(colorchanger());
                }
                break;
            case "ArrowDown":
                if (parseInt(emptyrow) - 1 > 0) {
                    let swapid = "row" + String(parseInt(emptyrow) - 1) + "column" + emptycol;
                    swaptiles(emptyid, swapid);
                    ifwon(colorchanger());
                }
                break;
        }
        document.getElementById('moves').innerText = String(moves);
    };
}
function time_calculator() {
    if (timeron == 1) {
    time_interval = setInterval(() => {
            time = time + 1;
            let mins = parseInt(time / 60);
            let seconds = time % 60;
            if (mins < 10) mins = "0" + String(mins);
            else mins = String(mins);
            if (seconds < 10) seconds = "0" + String(seconds);
            else seconds = String(seconds);
            document.getElementById("time").innerText = mins + " : " + seconds;
            
        }, 2000);
    }
}
function newgame() {
    window.clearInterval(time_interval);
    shuffle();
    colorchanger();
    document.getElementById('won').style.display = 'none';
    time = 0;
    moves = 0;
    document.getElementById('moves').innerText = String(moves);
    flag = false;
}
function ifwon(number) {
    timeron=0;
    if (number >= width * height - 1) {
        window.clearInterval(time_interval);
        document.getElementById("won").style.display = 'flex';
        document.getElementById("won").innerHTML = "Congratulations! You have won. <br> <div>Number of moves taken : <span class='result'>" + moves + "</span></div><div>Time taken : <span class='result'>" + document.getElementById("time").innerText + "</span> mins</div>";
        document.getElementById("board-container").style.fontSize = "3rem";
        document.getElementById("board-container").style.color = "#ff0000";
        //updating localstorage
        besttime = localStorage.getItem('time');
        leastmoves = localStorage.getItem('leastmoves');
        if (besttime == null || leastmoves == null) {
            localStorage.setItem('time', String(time));
            localStorage.setItem('leastmoves', String(moves));
        }
        else {
            if (parseInt(besttime) > time) {
                localStorage.removeItem('time');
                localStorage.setItem('time', String(time));
            }
            if (parseInt(leastmoves) > moves) {
                localStorage.removeItem('leastmoves')
                localStorage.setItem('leastmoves', String(moves));
            }
        }
    }
}
