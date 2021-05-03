let parametre = {
    offset: 50,
    pixelSize: 10,
    colour: [0, 0, 0],
    background: [255, 255, 255],
    characters: ' .:-=+*#%@',
    retrocharacters: ['&nbsp;', '&#9617;', '&#9618;', '&#9619;', '&#9608;'],
    textSize: 13
    };
  
  let capture;
  let capturing = false;
  let canvasWidth;
  let canvasHeight;
  let normal = true;
  let italic = false;
  let bold = false;
  let retro= false;
  let buttonSize = [140, 50];
  let cvs;

function setup() {
    canvasWidth = windowWidth;
    canvasHeight = windowHeight;
    cvs = createCanvas(canvasWidth, canvasHeight);
    paragraph = createP('');

    btn1 = createButton('NORMAL');
    btn1.size(buttonSize[0], buttonSize[1]);
    btn1.mousePressed(function(){normal=true; italic = false; bold = false; retro = false})
    btn2 = createButton('ITALIC');
    btn2.size(buttonSize[0], buttonSize[1]);
    btn2.mousePressed(function(){italic=true; normal = false; bold = false; retro = false})
    btn3 = createButton('BOLD');
    btn3.size(buttonSize[0], buttonSize[1]);
    btn3.mousePressed(function(){bold=true; italic = false; normal = false; retro = false})
    btn4 = createButton('RETRO');
    btn4.size(buttonSize[0], buttonSize[1]);
    btn4.mousePressed(function(){retro=true; italic = false; bold = false; normal = false})
    slider1 = createSlider('Text Size');
  
    let constraints = {
      video: {
        mandatory: {
          minWidth: 1280,
          minHeight: 720 },
        optional: [{ maxFrameRate: 10 }] },
        audio: false };
  
    capture = createCapture(constraints, function() {
      capturing = true;
    });
  
    capture.size(canvasWidth, canvasHeight);
    capture.hide();
}
  
function draw() {
    background(parametre.background);
  
    textSize(parametre.textSize);
    fill(parametre.colour);
    // image(capture,0,0)
  
    if (normal) textStyle(NORMAL);else
    if (italic) textStyle(ITALIC);else
    textStyle(BOLD);
  
    const characters = parametre.characters.split('');
    const retrocharacters = parametre.retrocharacters;
    let retroformat = '<pre>';

    if (capturing) {
      capture.loadPixels();
  
      if (capture.pixels) {
        for (y = 0; y < capture.height; y += parametre.pixelSize){
          let line = '';
          for (x = 0; x < capture.width; x += parametre.pixelSize){
            const index = (x + y * capture.width) * 4;// *4 is for each rgba value
                const r = capture.pixels[index];
                const g = capture.pixels[index + 1];
                const b = capture.pixels[index + 2];
                //const a = capture.pixels[index + 3];
      
                const bright = Math.round((r + g + b) / 3);
            if (retro){
                cvs.hide();
                let getCharIndex = Math.round(map(bright, 0, 255, retrocharacters.length - 1, 0))
                const letter = retrocharacters[getCharIndex];
                line += letter;
            }
            else{
                cvs.show();
                let getCharIndex = Math.round(map(bright, 0, 255, characters.length - 1, 0))
                const letter = characters[getCharIndex];
                text(letter, x, y+parametre.offset);
            }
          }
        if (retro) retroformat += line+'<br>';
        }
        if (retro) retroformat += '</pre>';
        paragraph.html(retroformat);
      }
    }
}
  
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    capture = createCapture(VIDEO, () => {
      capturing = true;
    });
    capture.size(windowWidth, windowHeight);
    capture.hide();
}