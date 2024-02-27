let img;
let lines = 100; // Number of horizontal lines
let pointsPerLine = 100; // Number of points per line
let amp;
let bgColor;
let lineColor;
let lineWidth = 2; // Default line width
let imgScale = 1; // Default image scale
let dropArea;

function setup() {
  if (windowWidth < 750 && windowWidth >= 470) {
    createCanvas(400, 400);
  } else if (windowWidth < 470) {
    createCanvas(300, 300);
  } else {
    createCanvas(600, 600);
  }
  amp = height / lines;
  noFill();
  bgColor = color('#2541E1'); // Default background color
  lineColor = color('#FFFFFF'); // Default line color
}

function draw() {
  background(bgColor); // Set background color
  if (img) {
    stroke(lineColor); // Set line color
    strokeWeight(lineWidth); // Set line width
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
  let scale_ = imgScale; // Use imgScale for scaling, remove mouse-based scaling
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
        document.getElementById('drop-area').style.opacity = "0";
      });
    };
    reader.readAsDataURL(file);
  }
});

// Function to handle file drop
document.getElementById('drop-area').addEventListener('drop', function(event) {
  event.preventDefault();
  event.stopPropagation();
  const file = event.dataTransfer.files[0];
  loadImageFromFile(file);

  document.getElementById('drop-area').style.opacity = "0";
});

// Function to handle drag over drop area
document.getElementById('drop-area').addEventListener('dragover', function(event) {
  event.preventDefault();
  event.stopPropagation();
});

// Function to load image from file
function loadImageFromFile(file) {
  if (file) {
    const extension = file.name.split('.').pop().toLowerCase();
    if (extension === 'svg') {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        const svgContent = xhr.responseText;
        console.log("SVG content:", svgContent);
        // You can use this SVG content for displaying on the canvas or other purposes
      };
      xhr.open("GET", URL.createObjectURL(file));
      xhr.send();
    } else if (extension === 'png' || extension === 'jpg' || extension === 'jpeg') {
      const reader = new FileReader();
      reader.onload = function(event) {
        img = loadImage(event.target.result, function() {
          img.loadPixels();
          document.getElementById('drop-area').style.opacity = "0";
        });
      };
      reader.readAsDataURL(file);
    } else {
      console.log("Unsupported file format");
    }
  }
}

// Function to handle background color selection
document.getElementById('choose-background-color').addEventListener('input', function(event) {
  bgColor = color(event.target.value);
});

// Function to handle line color selection
document.getElementById('choose-wave-color').addEventListener('input', function(event) {
  lineColor = color(event.target.value);
});

// Function to handle line width selection
document.getElementById('choose-line-width').addEventListener('input', function(event) {
  lineWidth = parseInt(event.target.value);
});

// Function to handle number of lines selection
document.getElementById('choose-number-of-lines').addEventListener('input', function(event) {
  lines = parseInt(event.target.value);
});

// Function to handle number of points per line selection
document.getElementById('choose-points-per-line').addEventListener('input', function(event) {
  pointsPerLine = parseInt(event.target.value);
});

// Function to handle image scale selection
document.getElementById('choose-icon-size').addEventListener('input', function(event) {
  imgScale = parseFloat(event.target.value);
});

// Function to handle PNG download
document.getElementById('save-png').addEventListener('click', function() {
  saveCanvas('wave-logo-generator', 'png');
});

// Function to dynamically adjust canvas size when window is resized
function windowResized() {
  if (windowWidth < 750 && windowWidth >= 470) {
    resizeCanvas(400, 400);
  } else if (windowWidth < 470) {
    resizeCanvas(300, 300);
  } else {
    resizeCanvas(600, 600);
  }
}
