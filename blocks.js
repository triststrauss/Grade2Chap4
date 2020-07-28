Blockly.Blocks['start_block'] = {
    init: function () {
        this.setNextStatement(true);
        this.setOutput(false);
        this.setColour("#f00");
        this.setTooltip('Starting block');
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage("assets/blocks/play.png", PLAY_BLOCK_WIDTH, ARROW_BLOCK_HEIGHT));
    }
};

Blockly.JavaScript['start_block'] = function (block) {
    return 'setPlaying(true);\n';
};

Blockly.Blocks["repeat_block"] = {
    init: function () {
        this.setNextStatement(true);
        this.setPreviousStatement(true);
        this.setOutput(false);
        this.setColour("#16de34");
        this.setTooltip('Repeat block');
        this.appendDummyInput()
            .appendField(new Blockly.FieldNumber(3, 0, 20), 'TIMES');
        this.appendStatementInput('DO')
            .appendField(new Blockly.FieldImage('img/block_imgs/repeater.png', ARROW_BLOCK_WIDTH, ARROW_BLOCK_HEIGHT));
    }
};
Blockly.JavaScript['repeat_block'] = Blockly.JavaScript['controls_repeat_ext'];


Blockly.Blocks['collect_block'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("COLLECT");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
        this.setTooltip("Use to collect diamonds.");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['collect_block'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'collectDiamond();\n';
    return code;
};


Blockly.Blocks['right_block'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage("assets/blocks/rightArrow.png", ARROW_BLOCK_WIDTH, ARROW_BLOCK_HEIGHT));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['right_block'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'walk(ACTION_RIGHT);\n';
    return code;
};

Blockly.Blocks['left_block'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage("assets/blocks/leftArrow.png", ARROW_BLOCK_WIDTH, ARROW_BLOCK_HEIGHT));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['left_block'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'walk(ACTION_LEFT);\n';
    return code;
};

Blockly.Blocks['if_block'] = {
    init: function() {
        this.appendValueInput("if")
            .setCheck(null)
            .appendField("IF");
        this.appendStatementInput("then")
            .setCheck(null)
            .appendField("THEN");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};


Blockly.Blocks['fire_block'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("FIRE");
        this.setOutput(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};



Blockly.Blocks['jump_block'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("JUMP");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(270);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};



Blockly.JavaScript['fire_block'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'isNextFire()';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['jump_block'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'jump();\n';
    return code;
};


Blockly.JavaScript['if_block'] = function(block) {
    var value_if = Blockly.JavaScript.valueToCode(block, 'if', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_then = Blockly.JavaScript.statementToCode(block, 'then');
    // TODO: Assemble JavaScript into code variable.

    var code = 'registerAction(ACTION_JUMP);\n';
    return code;
};