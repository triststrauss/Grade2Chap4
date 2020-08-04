var config = {
    type: Phaser.AUTO,
    width: 1120,
    height: 516,
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


const SPEED = 2;
const GRAVITY = 0.2;

const GRID_POS_Y = 440;

const GRID_CELL_SIZE = 80;
const TOTAL_GRID_CELLS  = 12;

const PLAY_BLOCK_HEIGHT = 50;
const PLAY_BLOCK_WIDTH = 100;

const ARROW_BLOCK_HEIGHT = 25;
const ARROW_BLOCK_WIDTH = 50;

const PLAYER_START_X = 40;
const PLAYER_START_Y = GRID_POS_Y - 40;

const CURRENCY_POS_Y = GRID_POS_Y - 25;

const BANK_POS_X = 1080;
const BANK_POS_Y = 285;

const DISTANCE_TO_TRAVEL = GRID_CELL_SIZE;
const GRID_WIDTH = 100;
const GRID_HEIGHT = 100;

const ACTION_LEFT = 1;
const ACTION_RIGHT = 2;
const ACTION_UP = 3;
const ACTION_DOWN = 4;
const ACTION_COLLECT = 5;
const ACTION_JUMP = 6;

const ANIM_LEFT = 'left';
const ANIM_RIGHT = 'right';
const ANIM_TURN = 'turn';
const ANIM_IDLE = 'idle';
const ANIM_COLLECT = 'collect';
const ANIM_FIRE = 'fire';
const ANIM_WALK = "walk";
const ANIM_JUMP = "jump";

var isMoving;
var velocityX = 0, velocityY = 0;
var currentDestinationX, currentDestinationY;
actionsQ = [];
onCondiotionAction = [];

var isPlaying;

var grid;

var player;
var currency = [];


var modalEle = document.getElementById("modal");
var successContentEle = document.getElementById("success-content");
var FailureContentEle = document.getElementById("failure-content");
var endContentEle = document.getElementById("end-content");
var TipContentEle = document.getElementById("tip-content");
var TipTextEle = document.getElementById("tip_text");
var outOfBoundsContentEle = document.getElementById("outOfBound-content");
var fireContentEle = document.getElementById("fire-content");
var initialHintEle = document.getElementById("initial-hint");
var initialHintText = document.getElementById("initial-hint-text");

var charSelectEle = document.getElementById("character-select-content");

var lesson_select = document.getElementById("lesson-select");
var runButton = document.getElementById("run-btn");

var currentLesson = 1;

var gridCells = [];
var text;

var music,collectSound,failSound,wrongCollect,jumpSound;
fire = [];

var currentGridCellId;

var piggyBank;

var registeredActionForFire;

var moneyCollected;
var moneyCollectedText;


var prvAction;
var action;
var jumpVelocityX;

var registeredActionForFire;


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
    this.load.audio("jumpSound",["assets/audio/jump.wav"]);

    this.load.atlas('boy','assets/gameObjects/character/spritesheet.png','assets/gameObjects/character/spritesheet.json');

}

var boy;

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
    moneyCollectedText = game.add.text(400, 2, '', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color : '#000' , fontSize:'25px', fontStyle:'bold'});

}

function createGrids()
{
    var k = 0;
    for (let i = 0; i < 14; i++)
    {
        var posX = GRID_CELL_SIZE/2 + (i * GRID_CELL_SIZE) ;
        var posY = GRID_POS_Y;
        gridCells[k] = new GridCells(k,posX,posY);
        k++;
    }
}

function createPlayer()
{
    // player = game.add.sprite(50, 50, 'dude');
    // player.setScale(1);


    player = game.add.sprite(300, 300, 'boy','sprite1.png');
    player.depth = 10;

    // player.play(ANIM_WALK);
}

function createFire()
{
    for (let i = 0; i < 3; i++)
    {
        let fireLocal = game.add.sprite(0, 0, 'fire');
        fireLocal.anims.play(ANIM_FIRE,true);
        fireLocal.scale = 1.5;
        fire.push(fireLocal);
    }
}

fireGridCellID  = [];

function resetFire(index)
{
    for (let i = 0; i < fire.length; i++)
    {
        let fireLocal = fire[i];
        let posX = 40 + (index[i] * GRID_CELL_SIZE);
        let posY = GRID_POS_Y - (25 * fireLocal.scale);

        fireLocal.x = posX;
        fireLocal.y = posY;

        let cell = getGridCell(posX,posY);
        if(cell !== null)
        {
            fireGridCellID.push(cell.id);
        }

    }
}

function addSoundsAndMusic()
{
    collectSound = game.sound.add("collect");
    failSound = game.sound.add("fail");
    music = game.sound.add("music");
    wrongCollect = game.sound.add("wrongCollect");
    jumpSound = game.sound.add("jumpSound");
    var musicConfig = {
        mute: false,
        volume: 1,
        rate: 1,
        detune: 0,
        seek:0,
        loop: true,
        delay :0,
    };
    music.play(musicConfig);
}

function createCurrencyAndResetFire()
{
    for (let i = 0; i < currency.length; i++)
    {
        removeBallAssets(currency[i])
    }

    currency = [];

    switch (currentLesson)
    {
        case 1://Identify 100
            currency[0] = new Currency(0,1,200,false);
            currency[1] = new Currency(1,3,5,false);
            currency[2] = new Currency(2,4,100,true);
            currency[3] = new Currency(3,7,50,false);
            currency[4] = new Currency(4,9,1,false);
            resetFire([15,15,15]);
            break;
        case 2://Identify 500
            currency[0] = new Currency(0,2,1,false);
            currency[1] = new Currency(1,3,5,false);
            currency[2] = new Currency(2,4,10,false);
            currency[3] = new Currency(3,7,500,true);
            currency[4] = new Currency(4,13,50,false);
            resetFire([15,15,15]);
            break;
        case 3://Identify 2000
            currency[0] = new Currency(0,1,10,false);
            currency[1] = new Currency(1,4,2000,true);
            currency[2] = new Currency(2,6,20,false);
            currency[3] = new Currency(3,12,500,false);
            resetFire([2,15,15]);
            break;
        case 4: //Collect All the currency.
            currency[0] = new Currency(0,2,1,true);
            currency[1] = new Currency(1,6,2,true);
            currency[2] = new Currency(2,8,10,true);
            currency[3] = new Currency(3,12,100,true);
            resetFire([3,10,15]);
            break;
        case 5: //Collect All the currency.
            currency[0] = new Currency(0,3,5,true);
            currency[1] = new Currency(1,5,20,true);
            currency[2] = new Currency(2,7,50,true);
            currency[3] = new Currency(3,11,200,true);
            resetFire([1,8,15]);
            break;
        case 6 : //Collect All Currency
            currency[0] = new Currency(0,2,200,true);
            currency[1] = new Currency(1,6,500,true);
            currency[2] = new Currency(2,10,2000,true);
            currency[3] = new Currency(3,12,100,true);
            currency[4] = new Currency(4,13,50,true);
            resetFire([3,7,15]);
            break;
        case 7 : //Collect sum of 10.
            currency[0] = new Currency(0,2,1,true);
            currency[1] = new Currency(1,4,20,false);
            currency[2] = new Currency(2,6,2,true);
            currency[3] = new Currency(3,7,5,true);
            currency[4] = new Currency(4,11,2,true);
            resetFire([3,8,15]);
            break;
        case 8 : //Collect sum of 80.
            currency[0] = new Currency(0,3,200,false);
            currency[1] = new Currency(1,4,20,true);
            currency[2] = new Currency(2,6,10,true);
            currency[3] = new Currency(3,8,500,false);
            currency[4] = new Currency(4,12,50,true);
            resetFire([1,10,15]);
            break;
        case 9 : //Problem Solving (75)
            currency[0] = new Currency(0,3,200,false);
            currency[1] = new Currency(1,5,500,false);
            currency[2] = new Currency(2,6,50,true);
            currency[3] = new Currency(3,7,20,true);
            currency[4] = new Currency(4,9,100,false);
            currency[5] = new Currency(5,13,5,true);
            resetFire([1,10.15]);
            break;
        case 10 : //Problem Solving (60)
            currency[0] = new Currency(0,2,100,false);
            currency[1] = new Currency(1,5,50,true);
            currency[2] = new Currency(2,6,5,true);
            currency[3] = new Currency(3,11,200,false);
            currency[4] = new Currency(4,12,500,false);
            currency[5] = new Currency(5,13,5,true);
            resetFire([3,8,15]);
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

    // c.anims.create({
    //     key: ANIM_TURN,
    //     frames: [ { key: 'dude', frame: 4 } ],
    //     frameRate: 20
    // });

    // c.anims.create({
    //     key: ANIM_RIGHT,
    //     frames: c.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    //     frameRate: 10,
    //     repeat: -1
    // });

    c.anims.create({
        key: ANIM_FIRE,
        frames: c.anims.generateFrameNumbers('fire', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    c.anims.create({
        key:ANIM_TURN,
        repeat : -1,
        frameRate:10,
        frames:c.anims.generateFrameNames('boy',{
            prefix:'',
            suffix:'.png',
            start:7,
            end:7
        })
    });


    c.anims.create({
        key:ANIM_RIGHT,
        repeat : -1,
        frameRate:15,
        frames:c.anims.generateFrameNames('boy',{
            prefix:'',
            suffix:'.png',
            start:1,
            end:6
        })
    });

    c.anims.create({
        key:ANIM_JUMP,
        repeat : 1,
        frameRate:5,
        frames:c.anims.generateFrameNames('boy',{
            prefix:'',
            suffix:'.png',
            start:10,
            end:10
        })
    });
}
var shouldPlayOnCondition;
var onConditionActionIndex = 0;

function update()
{
    if (!isMoving)
    {
        if (actionsQ.length > 0)
        {
            let prvShouldPlayOnCondition = shouldPlayOnConditon;

            let tempActionTOCheck = actionsQ[0];

            d("TEMP ACTION : " + tempActionTOCheck);

            if(tempActionTOCheck === ACTION_COLLECT || onCondiotionAction.length === 0)
            {
                prvAction = action;
                action = actionsQ.shift();
            }
            else
            {
                if (isNextFire() || shouldPlayOnConditon)
                {
                    if (prvShouldPlayOnCondition === false)
                    {
                        onConditionActionIndex = 0;
                    }


                    action = onCondiotionAction[onConditionActionIndex];
                    onConditionActionIndex++;

                    if (onConditionActionIndex === onCondiotionAction.length)
                    {
                        shouldPlayOnCondition = false;
                    }

                }
                else
                {
                    prvAction = action;
                    action = actionsQ.shift();
                }
            }


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
            else if(action === ACTION_JUMP)
            {
                setPlayerAnimation(ANIM_JUMP);
                jumpSound.play();
                velocityX = 1;
                currentDestinationX = player.x + DISTANCE_TO_TRAVEL * 2 * velocityX;

                velocityX = getProjectileFromHeightAndRangeX(150,DISTANCE_TO_TRAVEL * 2,GRAVITY);
                velocityY = getProjectileFromHeightAndRangeY(150,DISTANCE_TO_TRAVEL * 2,GRAVITY);

                isMoving = true;
                angle = 0;
            }
            else if(action === ACTION_COLLECT)
            {
                checkForPickUp();
            }
        }
        else
        {
            if(currentPlayerAnimation !== ANIM_TURN && !isSuccess)
                wrongCollect.play();
            setPlayerAnimation(ANIM_TURN);
        }
    }
    else
    {
        if(action === ACTION_JUMP)
        {
            velocityY += GRAVITY;
        }
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

        if(player.y > PLAYER_START_Y)
        {
            velocityY = 0;
            velocityX = 0;
            player.y = PLAYER_START_Y;
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

    if(action !== ACTION_JUMP)
    {
        for (let i = 0; i < fireGridCellID.length; i++)
        {
            if (currentGridCellId === fireGridCellID[i])
            {
                modalEle.hidden = false;
                fireContentEle.hidden = false;
                velocityX = 0;
            }
        }
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

function getProjectileFromHeightAndRangeX(height, range, gravity)
{
    let vy = Math.sqrt(2 * gravity * height);
    let vx = (range * gravity) / (2 * vy);
    return vx;
}

function getProjectileFromHeightAndRangeY(height, range, gravity)
{
    let vy = Math.sqrt(2 * gravity * height);
    let vx = (range * gravity) / (2 * vy);
    return -vy;
}

function actionToPerform(action,isConditional)
{
    if(!isPlaying)
        return;

    if(isConditional === 0)
        actionsQ.push(action);
    else
        onCondiotionAction.push(action);
}

function collectDiamond()
{
    actionsQ.push(ACTION_COLLECT);
}

function checkForPickUp()
{

    let ballPicked = false;
    let allCollected = true;
    for (let i = 0; i < currency.length; i++)
    {
        if(currency[i].gridCell.id === currentGridCellId)
        {

            // balls[i].gameObject.anims.play(ANIM_COLLECT,true);
            currency[i].isPicked = true;
            removeBallAssets(currency[i]);
            var numberPicked = currency[i].number;
            collectSound.play();
            ballPicked = true;

            moneyCollected += numberPicked;

            switch(currentLesson)
            {
                case 1:
                case 2:
                case 3:
                    if(currency[i].isCorrectBall)
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
                    if(currency[i].isCorrectBall)
                    {
                        for (let j = 0; j < currency.length; j++)
                        {
                            if(currency[j].isCorrectBall && !currency[j].isPicked)
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
var isSuccess = false;
function displayTaskSuccess()
{
    d("Task Success");
    isSuccess = true;
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


class Currency
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

function resetOnFireAction()
{
    onCondiotionAction = [];
    onConditionActionIndex = 0;
    shouldPlayOnConditon = false;
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
    fireGridCellID = [];
    registeredActionForFire = -1;
    isSuccess = false;

    resetOnFireAction();
    resetMoneyCollected();
    resetPlayer();
    createCurrencyAndResetFire();
    setPlaying(false);
    displayTask(currentLesson);

    d("TOTAL BALLS " + currency.length);

    modalEle.hidden = true;
    successContentEle.hidden = true;
    FailureContentEle.hidden = true;
    endContentEle.hidden = true;
    outOfBoundsContentEle.hidden = true;
    TipContentEle.hidden = true;
    fireContentEle.hidden = true;
    initialHintEle.hidden = true;

    manageBlocks();

    if(currentLesson <= 3)
    {
        showInitialHint();
    }
}

function showInitialHint()
{
    modalEle.hidden = false;
    initialHintEle.hidden = false;

    switch (currentLesson)
    {
        case 1:
            initialHintText.innerHTML = 'Here is how the 100 Rupees note looks like! &nbsp<img id="tip-image" src="assets/realCurrency/100.png"/>';
            break;
        case 2:
            initialHintText.innerHTML = 'Here is how the 500 Rupees note looks like! &nbsp<img id="tip-image" src="assets/realCurrency/500.png"/>';
            break;
        case 3:
            initialHintText.innerHTML = 'Here is how the 2000 Rupees note looks like! &nbsp<img id="tip-image" src="assets/realCurrency/2000.png"/>';
            break;
    }
}

function hideInitialHint()
{
    modalEle.hidden = true;
    initialHintEle.hidden = true;

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
            description.innerHTML = "Collect all the money.";
            break;
        case 7:
            description.innerHTML = "Collect 10 Rupees.";
            break;
        case 8:
            description.innerHTML = "Collect 80 Rupees.";
            break;
        case 9:
            description.innerHTML = "One ball costs Rupees 25, Collect money for 3 balls.";
            break;
        case 10:
            description.innerHTML = "One pen costs Rupees 15, Collect money for 4 pens.";
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
    isSuccess = false;
    resetOnFireAction();
    resetPlayer();
    createCurrencyAndResetFire();
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
    for (let i = 0; i < fireGridCellID.length; i++)
    {
        if(currentGridCellId === fireGridCellID[i] - 1)
        {
            return true;
        }
    }
    return false;
}

function registerAction(action)
{
    registeredActionForFire = action;
}

function jump()
{
    // actionsQ.push(ACTION_UP);
    // actionsQ.push(ACTION_DOWN);


}