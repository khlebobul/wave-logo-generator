let img;
let lines = 100; // Number of horizontal lines
let pointsPerLine = 100; // Number of points per line
let amp;
let bgColor;
let lineColor;

function setup() {
  createCanvas(600, 600);
  amp = height / lines;
  noFill();
  bgColor = color('#2541E1'); // Default background color
  lineColor = color('#FFFFFF'); // Default line color
}

function draw() {
  background(bgColor); // Set background color
  if (img) {
    stroke(lineColor); // Set line color
    drawLines();
  }
}

function drawLines() {
  let lineHeight = height / (lines + 1);
  for (let i = 1; i <= lines; i++) {
    let y = i * lineHeight;
    beginShape();
    drawPoints(y);
    endShape();
  }
}

function drawPoints(y) {
  let pointSpacing = width / (pointsPerLine + 1);
  for (let i = 1; i <= pointsPerLine; i++) {
    let x = i * pointSpacing;
    let offset = getVerticalOffset(x, y);
    vertex(x, y + offset);
  }
}

function getVerticalOffset(x, y) {
  let [imgX, imgY] = canvasToImageCoords(x, y);
  imgX = floor(imgX);
  imgY = floor(imgY);
  if (imgX < 0 || imgX > img.width - 1 || imgY < 0 || imgY > img.height - 1)
    return 0;
  let index = (imgY * img.width + imgX) * 4; // 4 channels (RGBA)
  let redValue = img.pixels[index];
  return map(redValue, 0, 255, -amp, 0);
}

function canvasToImageCoords(x, y) {
  x -= width / 2;
  y -= height / 2;
  let offsetX = (mouseX / width - 0.5) * width;
  let scale_ = (mouseY / height - 0.5) * 5;
  x -= offsetX;
  x /= scale_;
  y /= scale_;
  x += img.width / 2;
  y += img.height / 2;
  return [x, y];
}

// Function to handle file selection
document.getElementById('choose-file').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      img = loadImage(event.target.result, function() {
        img.loadPixels();
      });
    };
    reader.readAsDataURL(file);
  }
});

// Function to handle background color selection
document.getElementById('choose-background-color').addEventListener('input', function(event) {
  bgColor = color(event.target.value);
});

// Function to handle line color selection
document.getElementById('choose-wave-color').addEventListener('input', function(event) {
  lineColor = color(event.target.value);
});