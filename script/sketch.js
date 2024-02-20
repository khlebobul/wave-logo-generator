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
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
          const svgContent = xhr.responseText;
          console.log("SVG content:", svgContent);
          // Далее вы можете использовать это содержимое SVG для отображения на канвасе или других целях
      };
      xhr.open("GET", URL.createObjectURL(file));
      xhr.send();
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

// Function to convert SVG to JPEG
function convertSVGtoJPEG(svgElement) {
  // Log SVG content to console
  console.log("SVG content:", svgElement.outerHTML);

  var svgString = new XMLSerializer().serializeToString(svgElement);

  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "white";
  canvas.width = svgElement.getAttribute("width");
  canvas.height = svgElement.getAttribute("height");
  document.body.appendChild(canvas); // Append canvas to body temporarily for rendering

  canvg(canvas, svgString, {
    renderCallback: function() {
      img = new Image();
      img.src = canvas.toDataURL("image/jpeg", 1.0);
      img.onload = function() {
        // Remove canvas from body after image is loaded
        document.body.removeChild(canvas);
      };
    }
  });
}
