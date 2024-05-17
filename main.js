const COLUMNS = 40;
const ROWS = 24;

//Возвращает случайное число в зависимости от аргументов функции
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


//Создание матрицы полей на карте
function setUpMap() {
    var fieldElement = new Array(COLUMNS);
    var container = document.querySelector(".field-box > .field");
    var indentColumn = 0;
    for(var i = 0; i < COLUMNS; i++){
        fieldElement[i] = new Array(ROWS);
        var indentRow = 0;
        for(var j = 0; j < ROWS; j++){
            fieldElement[i][j] = document.createElement("div");
            fieldElement[i][j].setAttribute("class", "tile");
            fieldElement[i][j].style.left = indentColumn + 'px';
            fieldElement[i][j].style.top = indentRow + 'px';
            container.appendChild(fieldElement[i][j]);
            indentRow += 50;
        }
        indentColumn += 50;
    }

    return fieldElement;
}

//Добавление к каждому элементу матрицы класс "стены"(.tileW)
function fillWithWall (matrix) {
    for(var i = 0; i < COLUMNS; i++){
        for(var j = 0; j < ROWS; j++){
            matrix[i][j].classList.add("tileW");
        }
    }
}

//Удаляет .tileW 
//от случайного элемента (координат) матрицы 
//до случайной ширины и высоты комнаты
function inputRoom(matrix, width, height){
    
    var i = random(0, COLUMNS - width - 1);
    var j = random(0, ROWS - height - 1);
    
    var endColumn = i + width;
    var endRow = j + height;
    
    while (i < endColumn){
    
        while(j < endRow){
            matrix[i][j].classList.remove("tileW");
            j++;
        }
        j -= height;
        i++;
    }
    
}


//Генерирует случайное кол-во комнат и ее размеры, далее "вставляет" их
function createRooms(matrix) {
    for(var i = 0; i < random(5, 10); i++){
        var roomWidth = random(3, 8);
        var roomHeight = random(3, 8);
        inputRoom(matrix, roomWidth, roomHeight);
    }
    
}


//Создание проходов 
function createRoads(matrix) {
    for(var i = 0; i <= random(3, 5); i++){
        var line = random(0, COLUMNS - 1);
        for(var j = 0; j < ROWS; j++) {
            matrix[line][j].classList.remove("tileW");
        }
    }

    for(var i = 0; i <= random(3, 5); i++){
        var line = random(0, ROWS - 1);
        for(var j = 0; j < COLUMNS; j++) {
            matrix[j][line].classList.remove("tileW");
        }
    }
   
}


//Проверка на пустоту поля
function isEmptyField(element) {
    if(element.classList.contains("tileW") ||
        element.classList.contains("tileP") ||
        element.classList.contains("tileE") ||
        element.classList.contains("tileSW") ||
        element.classList.contains("tileHP")){
            return false;
    } else return true;

}


//Создает и возвращает массив пустых полей карты
function freeSpace(matrix) {
    var array = [];
    var length = 0;
    for(var i = 0; i < COLUMNS; i++){
        for(var j = 0; j < ROWS; j++){
            if(isEmptyField(matrix[i][j])){
                array[length++] = [i, j];
            }
        }
    }
    return array;
}

//Возвращает случайное пустое поле (элемент массива пустых ячеек)
function randomPosition(matrix, array){
    var pos = 0; 
    do{
        pos = random(0, array.length - 1);
    } while(!isEmptyField(matrix[array[pos][0]][array[pos][1]]))

    return pos;
}

//Генерация зелий здоровья и мечей
function createHpAndSw(matrix) {
    for(var i = 0; i < 10; i++){
        var array = freeSpace(matrix);
        var pos = randomPosition(matrix, array);
        matrix[array[pos][0]][array[pos][1]].classList.add("tileHP");
    }

    for(var i = 0; i < 2; i++){
        var array = freeSpace(matrix);
        var pos = randomPosition(matrix, array);
        matrix[array[pos][0]][array[pos][1]].classList.add("tileSW");
    }
}

//Создание игрока
function createPlayer(matrix) {
    var array = freeSpace(matrix);
    var pos = randomPosition(matrix, array);
    matrix[array[pos][0]][array[pos][1]].classList.add("tileP");
    var health = document.createElement("div");
    health.setAttribute("class", "health");
    health.style.width = "100%";
    matrix[array[pos][0]][array[pos][1]].appendChild(health);
    var player = new Player(array[pos][0], array[pos][1]);
    return player;
    
}

//Создание противников
function createEnemy(matrix) {
    var enemies = [];
    for(var i = 0; i < 10; i++){
        var array = freeSpace(matrix);
        var pos = randomPosition(matrix, array);
        matrix[array[pos][0]][array[pos][1]].classList.add("tileE");
        var health = document.createElement("div");
        health.setAttribute("class", "health");
        health.style.width = "100%";
        matrix[array[pos][0]][array[pos][1]].appendChild(health);
        var enemy = new Enemy(array[pos][0], array[pos][1]);
        enemies[i] = enemy;
    }

    return enemies;
}

class Person {
    constructor(posColumn, posRow){
        this.hp = 100;
        this.posColumn = posColumn;
        this.posRow = posRow;
    }
    isFullHP(){
        return this.hp === 100 ? true : false;
    }
}

class Player extends Person{
    constructor(posColumn, posRow){
        super(posColumn, posRow);
        this.dmg = 50;
        this.isSword = false;
    }
}

class Enemy extends Person{
    constructor(posColumn, posRow){
        super(posColumn,posRow);
        this.dmg = 10;
    }
}

function playerMove(matrix, posC, posR){
    matrix[player.posColumn][player.posRow].classList.remove('tileP');
    matrix[player.posColumn][player.posRow].innerHTML = "";
    player.posColumn = posC;
    player.posRow = posR;
    matrix[player.posColumn][player.posRow].classList.add('tileP');
    matrix[player.posColumn][player.posRow].innerHTML = "";
    var health = document.createElement("div");
    health.setAttribute("class", "health");
    health.style.width = player.hp + "%";
    matrix[player.posColumn][player.posRow].appendChild(health);
}

window.onkeydown = function (e) {
  if (e.keyCode === 65) { //A
    if((player.posColumn - 1) >= 0 && isAbleToGo(fieldElement[player.posColumn - 1][player.posRow])){
        playerMove(fieldElement, player.posColumn - 1, player.posRow);
    }
    enemyStep();
  } else if (e.keyCode === 68) { //D
    if((player.posColumn + 1) <= (COLUMNS - 1) && isAbleToGo(fieldElement[player.posColumn + 1][player.posRow])){
        playerMove(fieldElement, player.posColumn + 1, player.posRow);
    }
    enemyStep();
  } else if (e.keyCode === 87) { //W
    if((player.posRow - 1) >= 0 && isAbleToGo(fieldElement[player.posColumn][player.posRow - 1])){
        playerMove(fieldElement, player.posColumn, player.posRow - 1);
    }
    enemyStep();
  } else if (e.keyCode === 83) { //S
    if((player.posRow + 1) <= (ROWS - 1) && isAbleToGo(fieldElement[player.posColumn][player.posRow + 1])){
        playerMove(fieldElement, player.posColumn, player.posRow + 1);
    }
    enemyStep();
  } else if (e.keyCode === 32) {
    playerAttack(fieldElement);
  }
  enemyStep();
};

function enemyStep(){
    for(let i = 0; i < enemies.length; i++){
        if(isPlayerNear(enemies[i].posColumn, enemies[i].posRow, fieldElement)){
            enemyAttack(enemies[i], fieldElement);
        } else {
            switch(randomDirection(enemies[i].posColumn, enemies[i].posRow, fieldElement)){
                case 1:
                    enemyMove(fieldElement, enemies[i].posColumn - 1, enemies[i].posRow, enemies[i]);
                    break;
                case 2:
                    enemyMove(fieldElement, enemies[i].posColumn, enemies[i].posRow - 1, enemies[i]);
                    break;
                case 3:
                    enemyMove(fieldElement, enemies[i].posColumn + 1, enemies[i].posRow, enemies[i]);
                    break;
                case 4:
                    enemyMove(fieldElement, enemies[i].posColumn, enemies[i].posRow + 1, enemies[i]);
                    break;
            }
        }
    }
}

function isPlayerNear(posC, posR, matrix){
    if ((posC + 1) <= (COLUMNS - 1) && matrix[posC + 1][posR].classList.contains("tileP")){
        return true;
    } else if ((posC - 1) >= 0 && matrix[posC - 1][posR].classList.contains("tileP")){
        return true;
    } else if ((posR + 1) <= (ROWS - 1) && matrix[posC][posR + 1].classList.contains("tileP")){
        return true;
    } else if ((posR - 1) >= 0 && matrix[posC][posR - 1].classList.contains("tileP")){
        return true;
    } else if ((posC - 1) >= 0 && (posR - 1) >= 0 && matrix[posC - 1][posR - 1].classList.contains("tileP")){
        return true;
    } else if ((posC + 1) <= (COLUMNS - 1) && (posR - 1) >= 0 && matrix[posC + 1][posR - 1].classList.contains("tileP")){
        return true;
    } else if ((posC - 1) >= 0 && (posR + 1) <= (ROWS - 1) && matrix[posC - 1][posR + 1].classList.contains("tileP")){
        return true;
    } else if ((posC + 1) <= (COLUMNS - 1) && (posR + 1) <= (ROWS - 1) && matrix[posC + 1][posR + 1].classList.contains("tileP")){
        return true;
    } else 
        return false;
}

function randomDirection(posC, posR, matrix) {
    var flag = true;
    do {
        const direction = random(1, 4); //1 - left, 2 - top, 3 - right, 4 - bottom
        switch(direction) {
            case 1:
                if((posC - 1) >= 0 && isAbleToGo(matrix[posC - 1][posR])){
                    flag = false;
                    return 1;
                }
                break;
            case 2:
                if((posR - 1) >= 0 && isAbleToGo(matrix[posC][posR - 1])){
                    flag = false;
                    return 2;
                }
                break;
            case 3:
                if((posC + 1) <= (COLUMNS - 1) && isAbleToGo(matrix[posC + 1][posR])){
                    flag = false;
                    return 3;
                }
                break;
            case 4:
                if((posR + 1) <= (ROWS - 1) && isAbleToGo(matrix[posC][posR + 1])){
                    flag = false;
                    return 4;
                }
                break;
        }
    } while (flag)
}

function enemyMove(matrix, posC, posR, enemy){
    matrix[enemy.posColumn][enemy.posRow].classList.remove('tileE');
    matrix[enemy.posColumn][enemy.posRow].innerHTML = "";
    enemy.posColumn = posC;
    enemy.posRow = posR;
    matrix[enemy.posColumn][enemy.posRow].classList.add('tileE');
    matrix[enemy.posColumn][enemy.posRow].innerHTML = "";
    var health = document.createElement("div");
    health.setAttribute("class", "health");
    health.style.width = enemy.hp + "%";
    matrix[enemy.posColumn][enemy.posRow].appendChild(health);
}

function enemyAttack(enemy, matrix){
    player.hp -= enemy.dmg;
    matrix[player.posColumn][player.posRow].innerHTML = "";
    var health = document.createElement("div");
    health.setAttribute("class", "health");
    health.style.width = player.hp + "%";
    matrix[player.posColumn][player.posRow].appendChild(health);
    if(player.hp === 0){
        alert("Died");
    }
}

function playerAttack(matrix){
    if ((player.posColumn + 1) <= (COLUMNS - 1) && matrix[player.posColumn + 1][player.posRow].classList.contains("tileE")){
        attackEnemy(player.posColumn + 1, player.posRow);
    }
    if ((player.posColumn - 1) >= 0 && matrix[player.posColumn - 1][player.posRow].classList.contains("tileE")){
        attackEnemy(player.posColumn - 1, player.posRow);
    }
    if ((player.posRow + 1) <= (ROWS - 1) && matrix[player.posColumn][player.posRow + 1].classList.contains("tileE")){
        attackEnemy(player.posColumn, player.posRow + 1);
    }
    if ((player.posRow - 1) >= 0 && matrix[player.posColumn][player.posRow - 1].classList.contains("tileE")){
        attackEnemy(player.posColumn, player.posRow - 1);
    }
    if ((player.posColumn - 1) >= 0 && (player.posRow - 1) >= 0 && matrix[player.posColumn - 1][player.posRow - 1].classList.contains("tileE")){
        attackEnemy(player.posColumn - 1, player.posRow - 1);
    }
    if ((player.posColumn + 1) <= (COLUMNS - 1) && (player.posRow - 1) >= 0 && matrix[player.posColumn + 1][player.posRow - 1].classList.contains("tileE")){
        attackEnemy(player.posColumn + 1, player.posRow - 1);
    }
    if ((player.posColumn - 1) >= 0 && (player.posRow + 1) <= (ROWS - 1) && matrix[player.posColumn - 1][player.posRow + 1].classList.contains("tileE")){
        attackEnemy(player.posColumn - 1, player.posRow + 1);
    }
    if ((player.posColumn + 1) <= (COLUMNS - 1) && (player.posRow + 1) <= (ROWS - 1) && matrix[player.posColumn + 1][player.posRow + 1].classList.contains("tileE")){
        attackEnemy(player.posColumn + 1, player.posRow + 1);
    }
}

function findEnemyPos(posC, posR){
    var pos;
    for(var i = 0; i < enemies.length; i++){
        if(enemies[i].posColumn === posC && enemies[i].posRow === posR){
            pos = i;
            break;
        }
    }
    return pos;
}

function modifyEnemy(pos){
    var hp = enemies[pos].hp;
    var field = fieldElement[enemies[pos].posColumn][enemies[pos].posRow];
    var hpDiv = field.querySelector(".health");
    if(hp > 0){
        hpDiv.style.width = hp + "%";
    } else {
        field.classList.remove('tileE');
        field.innerHTML = "";
        enemies.splice(pos, 1);
    }
    
}

function attackEnemy(posC, posR){
    var pos = findEnemyPos(posC, posR);
    if(player.isSword){
        enemies[pos].hp -= player.dmg;
        player.isSword = false;
        modifyEnemy(pos);
    } else {
        enemies[pos].hp -= player.dmg;
        modifyEnemy(pos);
    }
}

function isAbleToGo(element) {
    if(element.classList.contains("tileW") ||
        element.classList.contains("tileE") ||
        element.classList.contains("tileP")){
            return false;
    } else return true;

}



var fieldElement = setUpMap();
fillWithWall(fieldElement);
createRooms(fieldElement);
createRoads(fieldElement);
createHpAndSw(fieldElement);
var player = createPlayer(fieldElement);
var enemies = createEnemy(fieldElement);