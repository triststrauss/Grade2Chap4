

function run()
{
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    console.log(code);
    frameCount = 1;

    isPlaying = false;
    resetMoneyCollected();
    resetPlayer();
    createBalls();

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