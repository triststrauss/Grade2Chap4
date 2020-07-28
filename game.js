var config = {
    type: Phaser.AUTO,
    width: 1120,
    height: 480,
    parent: document.getElementById("phaser"),
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 200}
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);


const SPEED = 3;

const GRID_CELL_SIZE = 80;
const TOTAL_GRID_CELLS  = 12;

const PLAY_BLOCK_HEIGHT = 50;
const PLAY_BLOCK_WIDTH = 100;

const ARROW_BLOCK_HEIGHT = 25;
const ARROW_BLOCK_WIDTH = 50;

const PLAYER_START_X = 40;
const PLAYER_START_Y = 285;

const CURRENCY_POS_Y = 295;

const BANK_POS_X = 1080;
const BANK_POS_Y = 285;

const DISTANCE_TO_TRAVEL = GRID_CELL_SIZE;
const GRID_WIDTH = 100;
const GRID_HEIGHT = 100;

const ACTION_LEFT = 1;
const ACTION_RIGHT = 2;
const ACTION_UP = 3;
const ACTION_DOWN = 4;
const ACTION_PICK = 5;
const ACTION_JUMP = 6;

const ANIM_LEFT = 'left';
const ANIM_RIGHT = 'right';
const ANIM_TURN = 'turn';
const ANIM_IDLE = 'idle';
const ANIM_COLLECT = 'collect';
const ANIM_FIRE = 'fire';

var isMoving;
var velocityX = 0, velocityY = 0;
var currentDestinationX, currentDestinationY;
actionsQ = [];

var isPlaying;

var grid;

var player;
var balls = [];


var modalEle = document.getElementById("modal");
var successContentEle = document.getElementById("success-content");
var FailureContentEle = document.getElementById("failure-content");
var endContentEle = document.getElementById("end-content");
var TipContentEle = document.getElementById("tip-content");
var TipTextEle = document.getElementById("tip_text");
var outOfBoundsContentEle = document.getElementById("outOfBound-content");
var fireContentEle = document.getElementById("fire-content");

var charSelectEle = document.getElementById("character-select-content");

var lesson_select = document.getElementById("lesson-select");
var runButton = document.getElementById("run-btn");

var currentLesson = 1;

var gridCells = [];
var text;

var music,collectSound,failSound,wrongCollect;
var fire;

var currentGridCellId;

var piggyBank;

var registeredActionForFire;

var moneyCollected;
var moneyCollectedText;

function preload()
{
    //Images
    this.load.image('1','assets/currency/1.png');
    this.load.image('2','assets/currency/2.png');
    this.load.image('5','assets/currency/5.png');
    this.load.image('10','assets/currency/10.png');
    this.load.image('20','assets/currency/20.png');
    this.load.image('50','assets/currency/50.png');
    this.load.image('100','assets/currency/100.png');
    this.load.image('200','assets/currency/200.png');
    this.load.image('500','assets/currency/500.png');
    this.load.image('2000','assets/currency/2000.png');

    this.load.image('piggyBank','assets/gameObjects/piggyBank.png');
    this.load.image('bg','assets/gameObjects/bg.png');

    //FrameAnimations
    this.load.spritesheet('dude', 'assets/gameObjects/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('fire', 'assets/gameObjects/fire.png', { frameWidth: 64, frameHeight: 64 });

    //ParticleEffects
    this.load.image('sparks', 'assets/particle/blue.png');
    this.load.json('emitter', 'assets/particle/sparks.json'); // see './particle editor.js'

    //SoundsAndMusic
    this.load.audio("music",["assets/audio/music.mp3"]);
    this.load.audio("collect",["assets/audio/collect.mp3"]);
    this.load.audio("fail",["assets/audio/fail.wav"]);
    this.load.audio("wrongCollect",["assets/audio/wrongCollect.wav"]);
}


function create()
{
    d("CREATE");
    game = this;
    game.add.image(config.width/2,config.height/2,'bg');
    createGrids();
    createAnimations(this);
    createPlayer();
    createFire();
    addSoundsAndMusic();
    changeLesson(currentLesson);
    // piggyBank = game.add.image(BANK_POS_X,BANK_POS_Y,'piggyBank');
    moneyCollectedText = game.add.text(10, 10, '', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color : '#000' , fontSize:'25px', fontStyle:'bold'});
}

function createGrids()
{
    var k = 0;
    for (let i = 0; i < 14; i++)
    {
        var posX = GRID_CELL_SIZE/2 + (i * GRID_CELL_SIZE) ;
        var posY = 320;
        gridCells[k] = new GridCells(k,posX,posY);
        k++;
    }
}

function createPlayer()
{
    player = game.add.sprite(50, 50, 'dude');
    player.setScale(1.5);
    player.depth = 10;
}

function createFire()
{
    fire = game.add.sprite(0, 0, 'fire');
    fire.anims.play(ANIM_FIRE,true);
}

var fireGridCellID;
function resetFire(index)
{
    var posX = 40 + (index * GRID_CELL_SIZE);
    var posY = CURRENCY_POS_Y;

    fire.x = posX;
    fire.y = posY;
    fireGridCellID = getGridCell(posX,posY).id;
    console.log("FIRE ID" + fireGridCellID);
}

function addSoundsAndMusic()
{
    collectSound = game.sound.add("collect");
    failSound = game.sound.add("fail");
    music = game.sound.add("music");
    wrongCollect = game.sound.add("wrongCollect");
    var musicConfig = {
        mute: false,
        volume: 1,
        rate: 1,
        detune: 0,
        seek:0,
        loop: true,
        delay :0,
    };
    // music.play(musicConfig);
}

function createBalls()
{
    for (let i = 0; i < balls.length; i++)
    {
        removeBallAssets(balls[i])
    }

    balls = [];

    switch (currentLesson)
    {
        case 1://Identify 100
            balls[0] = new Ball(0,1,100,true);
            balls[1] = new Ball(1,5,200,false);
            balls[2] = new Ball(2,7,500,false);
            balls[3] = new Ball(3,9,2000,false);
            resetFire(2);
            break;
        case 2://Identify 500
            balls[0] = new Ball(0,2,1,false);
            balls[1] = new Ball(1,3,5,false);
            balls[2] = new Ball(2,4,10,false);
            balls[3] = new Ball(3,7,2000,false);
            balls[4] = new Ball(410,9,500,true);
            resetFire(8);
            break;
        case 3://Identify 2000
            balls[0] = new Ball(0,3,100,false);
            balls[1] = new Ball(1,4,2000,true);
            balls[2] = new Ball(2,6,200,false);
            balls[3] = new Ball(3,9,500,false);
            resetFire(5);
            break;
        case 4: //Collect All the currency.
            balls[0] = new Ball(0,2,1,true);
            balls[1] = new Ball(1,4,2,true);
            balls[2] = new Ball(2,5,10,true);
            balls[3] = new Ball(3,7,100,true);
            balls[4] = new Ball(4,9,500,true);
            resetFire(3);
            break;
        case 5: //Collect All the currency.
            balls[0] = new Ball(0,3,100,true);
            balls[1] = new Ball(1,5,200,true);
            balls[2] = new Ball(2,6,500,true);
            balls[3] = new Ball(3,7,2000,true);
            balls[4] = new Ball(4,11,50,true);
            resetFire(4);
            break;
        case 6 : //Collect sum of 250.
            balls[0] = new Ball(0,2,200,true);
            balls[1] = new Ball(1,5,50,true);
            balls[2] = new Ball(2,6,500,false);
            balls[3] = new Ball(3,7,2000,false);
            balls[4] = new Ball(4,12,5,false);
            resetFire(9);
            break;
        case 7 : //Collect sum of 350.
            balls[0] = new Ball(0,2,100,true);
            balls[1] = new Ball(1,4,100,true);
            balls[2] = new Ball(2,6,100,true);
            balls[3] = new Ball(3,7,500,false);
            balls[4] = new Ball(4,11,50,true);
            resetFire(8);
            break;
        case 8 : //Collect sum of 500.
            balls[0] = new Ball(0,3,200,true);
            balls[1] = new Ball(1,4,100,true);
            balls[2] = new Ball(2,7,20,false);
            balls[3] = new Ball(3,8,2000,false);
            balls[4] = new Ball(4,12,200,true);
            resetFire(9);
            break;
        case 9 : //Problem Solving (150)
            balls[0] = new Ball(0,3,200,false);
            balls[1] = new Ball(1,5,500,false);
            balls[2] = new Ball(2,6,2000,false);
            balls[3] = new Ball(3,7,50,true);
            balls[4] = new Ball(4,9,50,true);
            balls[5] = new Ball(5,12,50,true);
            resetFire(10);
            break;
        case 10 : //Problem Solving (400)
            balls[0] = new Ball(0,3,100,true);
            balls[1] = new Ball(1,5,100,true);
            balls[2] = new Ball(2,6,2000,false);
            balls[3] = new Ball(3,7,500,false);
            balls[4] = new Ball(4,9,200,true);
            balls[5] = new Ball(5,12,500,false);
            resetFire(10);
            break;
    }
}

function createAnimations(c)
{
    c.anims.create({
        key: ANIM_LEFT,
        frames: c.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    c.anims.create({
        key: ANIM_TURN,
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    c.anims.create({
        key: ANIM_RIGHT,
        frames: c.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    c.anims.create({
        key: ANIM_FIRE,
        frames: c.anims.generateFrameNumbers('fire', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
}

var prvAction;
var action;
var jumpVelocityX;

function update()
{
    if (!isMoving)
    {
        if (actionsQ.length > 0)
        {
            prvAction = action;
            action = actionsQ.shift();

            if (action === ACTION_RIGHT || action === ACTION_LEFT)
            {
                if(action === ACTION_RIGHT)
                {
                    velocityX = 1;
                    setPlayerAnimation(ANIM_RIGHT);
                }
                else
                {
                    velocityX = -1;
                    setPlayerAnimation(ANIM_LEFT);
                }

                currentDestinationX = player.x + DISTANCE_TO_TRAVEL * velocityX;
                d('DESTINATION X : ' + currentDestinationX + " : "+velocityX);
                isMoving = true;
            }
            else if (action === ACTION_UP || action === ACTION_DOWN)
            {
                if(action === ACTION_UP)
                {
                    if (prvAction === ACTION_LEFT)
                        jumpVelocityX = velocityX = -1;
                    else if (prvAction === ACTION_RIGHT)
                        jumpVelocityX = velocityX = 1;
                    else
                        jumpVelocityX = velocityX = 1;
                }
                else
                {
                    velocityX = jumpVelocityX;
                }

                velocityY = action === ACTION_DOWN ? 1 : -1;
                currentDestinationY = player.y + DISTANCE_TO_TRAVEL * velocityY;
                currentDestinationX = player.x + DISTANCE_TO_TRAVEL * velocityX;
                d('DESTINATION Y : ' + currentDestinationY);
                isMoving = true;
            }
            else if(action === ACTION_PICK)
            {
                checkForPickUp();
            }
        }
        else
        {
            if(currentPlayerAnimation !== ANIM_TURN)
                wrongCollect.play();
            setPlayerAnimation(ANIM_TURN);
        }
    }
    else
    {
        player.x += SPEED * velocityX;
        player.y += SPEED * velocityY;

        if (Math.abs(player.x - currentDestinationX) < SPEED)
        {
            velocityX = 0;
        }

        if(Math.abs(player.y - currentDestinationY) < SPEED)
        {
            velocityY = 0;
        }

        if(velocityX === 0 && velocityY === 0)
        {
            isMoving = false;
        }
    }

    var gridCell = getGridCell(player.x,player.y);

    if(gridCell !== null)
    {
        currentGridCellId = gridCell.id;
    }
    else
    {
        currentGridCellId = 0;
    }

    if(player.x < 0 || player.x > config.width || player.y < 0 || player.y > config.height)
    {
        modalEle.hidden = false;
        outOfBoundsContentEle.hidden = false;
    }

    if(currentGridCellId === fireGridCellID)
    {
        modalEle.hidden = false;
        fireContentEle.hidden = false;
    }

    if(currentGridCellId !== 0)
    {
        runButton.innerHTML = "RESET";
    }
    else
    {
        runButton.innerHTML = "RUN";
    }

    moneyCollectedText.text = "Money Collected : " + moneyCollected ;
}


function walk(action)
{
    if(!isPlaying)
        return;

    actionsQ.push(action);
    d("push " + action);
}

function collectDiamond()
{
    actionsQ.push(ACTION_PICK);
    d("push " + ACTION_PICK);
}

function checkForPickUp()
{
    d("CHECK FOR PICK :" + balls.length);

    let ballPicked = false;
    let allCollected = true;
    for (let i = 0; i < balls.length; i++)
    {
        d(balls[i].gridCell.id + "  -  " + currentGridCellId);

        if(balls[i].gridCell.id === currentGridCellId)
        {

            // balls[i].gameObject.anims.play(ANIM_COLLECT,true);
            balls[i].isPicked = true;
            removeBallAssets(balls[i]);
            var numberPicked = balls[i].number;
            collectSound.play();
            ballPicked = true;
            d("NUMBER PICKED " + numberPicked);

            moneyCollected += numberPicked;

            switch(currentLesson)
            {
                case 1:
                case 2:
                case 3:
                    if(balls[i].isCorrectBall)
                        displayTaskSuccess();
                    else
                        displayTaskFailed();
                break;
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                    if(balls[i].isCorrectBall)
                    {
                        for (let j = 0; j < balls.length; j++)
                        {
                            if(balls[j].isCorrectBall && !balls[j].isPicked)
                                allCollected = false;

                        }

                        if(allCollected)
                            displayTaskSuccess();
                    }
                    else
                        displayTaskFailed();
                break;
            }
        }
    }

    if(!ballPicked)
        wrongCollect.play();

}

function removeBallAssets(ball)
{
    ball.gameObject.destroy();
    ball.text.destroy();
    if(ball.containsEmitter)
    {
        ball.emitter.remove();
    }
}

function displayTaskFailed()
{
    d("Task Failed");
    failSound.play();
    modalEle.hidden = false;
    FailureContentEle.hidden = false;
}

function displayTaskSuccess()
{
    d("Task Success");
    modalEle.hidden = false;
    if(currentLesson === 10)
        endContentEle.hidden = false;
    else
        successContentEle.hidden = false;
}


function setPlaying(isPlay) {
    isPlaying = isPlay;
}

function resetPlayer()
{
    player.x = PLAYER_START_X;
    player.y = PLAYER_START_Y;

    currentDestinationX = player.x;
    currentDestinationY = player.y;

    setPlayerAnimation(ANIM_TURN);
    velocityX = 0;
    velocityY = 0;
    actionsQ = [];
    isMoving = false;
}

function resetMoneyCollected()
{
    moneyCollected = 0;
}

function d(str) {
    console.log(str);
}

class GridCells
{
    constructor(id,posX,posY)
    {
        this.id = id;
        this.left = posX - GRID_WIDTH/2;
        this.right = posX + GRID_WIDTH/2;
        this.top = posY - GRID_HEIGHT/2;
        this.bottom = posY + GRID_HEIGHT/2;
    }
}


class Ball
{
    constructor(id,index,number,correctBall)
    {
        var posX = 40 + (index * GRID_CELL_SIZE);
        var posY = CURRENCY_POS_Y;
        // d("Position X :" + posX);
        // d("Position Y :" + posY);
        this.id = id;
        this.gameObject = game.add.image(posX,posY,number);
        this.gameObject.scale = 0.8;
        this.gridCell = getGridCell(posX,posY);
        this.isPicked = false;
        this.number = number;
        this.isCorrectBall = correctBall;
        if(correctBall && currentLesson <= 4)
        {
            this.containsEmitter = true;
            var particles = game.add.particles('sparks');
            this.emitter = particles.createEmitter(game.cache.json.get('emitter'));
            this.emitter.setPosition(posX, posY);
        }
        else
            this.emitter = null;

        var textPosX;
        if(number < 10)
            textPosX = posX - 10;
        else if(number < 100)
            textPosX = posX - 15;
        else
            textPosX = posX- 20;
        this.text = game.add.text(textPosX, posY - 14, '', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color : '#000' , fontSize:'25px', fontStyle:'bold'});
        this.gameObject.depth = 1;
        this.text.depth = 2;
    }
}

function getGridCell(x, y)
{
    for (let i = 0; i < gridCells.length; i++)
    {
        var g = gridCells[i];
        // d(g.id  + " : " + g.left + " : " + g.right + " : " + g.top + " : " + g.bottom);
        if(x > g.left && x < g.right && y > g.top && y < g.bottom)
        {
            return g;
        }
    }

    return null;
}

function changeLesson(q)
{
    var selected = lesson_select.selectedIndex;
    selected += 1;
    if (q != null)
    {
        selected = q;
    }
    let prvLesson = currentLesson;
    currentLesson = selected;

    if(prvLesson !== currentLesson)
        workspace.clear();

    lesson_select.selectedIndex = currentLesson - 1;

    d("CURRENT LESSON : " + currentLesson);

    // createGameObjects();
    resetMoneyCollected();
    resetPlayer();
    createBalls();
    setPlaying(false);
    displayTask(currentLesson);

    d("TOTAL BALLS " + balls.length);

    modalEle.hidden = true;
    successContentEle.hidden = true;
    FailureContentEle.hidden = true;
    endContentEle.hidden = true;
    outOfBoundsContentEle.hidden = true;
    TipContentEle.hidden = true;
    fireContentEle.hidden = true;
}

function displayTip(index)
{
    FailureContentEle.hidden = true;
    TipContentEle.hidden = false;
    modalEle.hidden = false;


    switch (index)
    {
        case 1:
            TipTextEle.innerHTML = '1 is smaller than 3';
            break;
        case 2:
            TipTextEle.innerHTML = '10 is bigger than 1';
            break;
        case 3:
            TipTextEle.innerHTML = '2,4,6,...';
            break;
        case 4:
            TipTextEle.innerHTML = '1,3,5,...';
            break;
        case 5:
            TipTextEle.innerHTML = '1,2,3,...';
            break;
        case 6:
            TipTextEle.innerHTML = '81,82,83,...';
            break;
        case 7:
            TipTextEle.innerHTML = '20,19,18,...';
            break;
        case 8:
            TipTextEle.innerHTML = '10,20,30,...';
            break;
        case 9:
            TipTextEle.innerHTML = '100,200,300,...';
            break;
        case 10:
            TipTextEle.innerHTML = '90,80,70,...';
            break;
    }

}

function displayTask(index)
{
    var description = document.getElementById('description-text');

    switch (index) {
        case 1:
            description.innerHTML = "Collect 100 rupees note.";
            break;
        case 2:
            description.innerHTML = "Collect 500 rupees note.";
            break;
        case 3:
            description.innerHTML = "Collect 2000 rupees note.";
            break;
        case 4:
            description.innerHTML = "Collect all the money.";
            break;
        case 5:
            description.innerHTML = "Collect all the money.";
            break;
        case 6:
            description.innerHTML = "Collect 250 Rupees.";
            break;
        case 7:
            description.innerHTML = "Collect 350 Rupees.";
            break;
        case 8:
            description.innerHTML = "Collect 500 Rupees.";
            break;
        case 9:
            description.innerHTML = "One ball costs Rupees 50, Collect money for 3 balls.";
            break;
        case 10:
            description.innerHTML = "One Racket costs Rupees 100, Collect money for 4 Rackets.";
            break;
    }
}

var solutionTextEle = document.getElementById("solution-text");
var solutionContentEle = document.getElementById("solution-content");

var codeP;

function displayPySol()
{
    // solutionContentEle.hidden = false;
    // solutionTextEle.hidden = false;
    // modalEle.hidden = false;
    //
    // codeP = Blockly.Python.workspaceToCode(workspace);
    //
    // codeP = codeP.split("for").join("<br>for");
    //
    // solutionTextEle.innerHTML = codeP ;

    solutionContentEle.hidden = false;
    solutionTextEle.hidden = false;
    modalEle.hidden = false;

    codeJS  = Blockly.JavaScript.workspaceToCode(workspace);
    // eval(codeJS);
    // codeJS.replace(";", "<BR>");
    d("Disply JS solution" + codeJS);
    solutionTextEle.innerHTML = codeJS;
}

var codeJS;
function displayJsSol()
{
    solutionContentEle.hidden = false;
    solutionTextEle.hidden = false;
    modalEle.hidden = false;

    codeJS  = Blockly.JavaScript.workspaceToCode(workspace);
    // eval(codeJS);
    // codeJS.replace(";", "<BR>");
    d("Disply JS solution" + codeJS);
    solutionTextEle.innerHTML = codeJS;
}

function hideCodeSolution()
{
    solutionContentEle.hidden = true;
    solutionTextEle.hidden = true;
    modalEle.hidden = true;
}

function onRunClicked()
{
    if(currentGridCellId !== 0)
    {
        reset();
    }
    else
    {
        run();
    }
}

function reset()
{
    isPlaying = false;
    resetPlayer();
    createBalls();
}

function setPlayerAnimation(animToSet)
{
    if(animToSet !== currentPlayerAnimation)
        player.anims.play(animToSet, true);

    currentPlayerAnimation = animToSet;
}

var currentPlayerAnimation;

function ifBlock()
{

}

function isNextFire()
{
    return currentGridCellId === fireGridCellID - 1;
}

function registerAction(action)
{
    registeredActionForFire = action;
}

function jump()
{
    actionsQ.push(ACTION_UP);
    actionsQ.push(ACTION_DOWN);
}