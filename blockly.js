

function run()
{
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    console.log(code);
    frameCount = 1;

    isPlaying = false;
    resetMoneyCollected();
    resetPlayer();
    createCurrencyAndResetFire();

    if (code !== '' )
    {
        eval(code);
    }
    else
    {
        alert('Empty script');
    }
}

var customTheme = Blockly.Theme.defineTheme('MyTheme', {
    'base': Blockly.Themes.HighContrast,
    'componentStyles': {
        'workspaceBackgroundColour': '#C7C7C7',
        'toolboxBackgroundColour': '#333',
        'toolboxForegroundColour': '#fff',
        'flyoutBackgroundColour': '#888889',
        'flyoutForegroundColour': '#ccc',
        'flyoutOpacity': 1,
        'scrollbarColour': '#797979',
        'insertionMarkerColour': '#fff',
        'insertionMarkerOpacity': 0.3,
        'scrollbarOpacity': 0.4,
        'cursorColour': '#d0d0d0'
    }
});

// start_block
// repeat_block
// right_block
// collect_block
// jump_block
// fire_block
// if_block


function manageBlocks()
{
    switch(currentLesson)
    {
        case 1:
            var toolbox = '<xml>';
            toolbox += '  <block type="start_block"></block>';
            toolbox += '  <block type="right_block"></block>';
            toolbox += '  <block type="collect_block"></block>';
            toolbox += '</xml>';
            break;
        case 2:
            var toolbox = '<xml>';
            toolbox += '  <block type="start_block"></block>';
            toolbox += '  <block type="right_block"></block>';
            toolbox += '  <block type="repeat_block"></block>';
            toolbox += '  <block type="collect_block"></block>';
            toolbox += '</xml>';
            break;
        case 3:
            var toolbox = '<xml>';
            toolbox += '  <block type="start_block"></block>';
            toolbox += '  <block type="right_block"></block>';
            toolbox += '  <block type="repeat_block"></block>';
            toolbox += '  <block type="collect_block"></block>';
            toolbox += '  <block type="jump_block"></block>';
            toolbox += '</xml>';
            break;
        default:
            var toolbox = '<xml>';
            toolbox += '  <block type="start_block"></block>';
            toolbox += '  <block type="right_block"></block>';
            toolbox += '  <block type="repeat_block"></block>';
            toolbox += '  <block type="collect_block"></block>';
            toolbox += '  <block type="jump_block"></block>';
            toolbox += '  <block type="if_block"></block>';
            toolbox += '  <block type="fire_block"></block>';
            toolbox += '</xml>';
            break;
    }

    workspace.updateToolbox(toolbox);
}