# Wave-logo-generator

[![X](https://img.shields.io/badge/X-000?style=for-the-badge&logo=x)](https://x.com/khlebobul) [![Telegram](https://img.shields.io/badge/Telegram-000?style=for-the-badge&logo=telegram&logoColor=2CA5E0)](https://t.me/khlebobul) [![ProductHunt](https://img.shields.io/badge/producthunt-DA552F?style=for-the-badge&logo=producthunt&logoColor=white)](https://www.producthunt.com/products/wave-logo-generator#wave-logo-generator)

Hey, Wave Logo Generator is basically your logo buddy! Just toss in a cool image, tweak the settings a bit, and voila - logo magic! It's all about keeping things simple and getting creative. Totally free!

### Demo

https://github.com/khlebobul/wave-logo-generator/assets/77191581/45a08263-ee40-4899-9aad-e4a4b3c34228

### Not Yet Implemented

- [ ] Selecting icons from the set 
- [ ] Ability to download in SVG format

### Algorithm
```js
// Draws lines on the canvas based on the specified number of lines and points per line.
function drawLines() {
  let lineHeight = height / (lines + 1);
  for (let i = 1; i <= lines; i++) {
    let y = i * lineHeight;
    beginShape();
    drawPoints(y); // Draws points for each line
    endShape();
  }
}

// Draws points on a specified y-coordinate line.
function drawPoints(y) {
  let pointSpacing = width / (pointsPerLine + 1);
  for (let i = 1; i <= pointsPerLine; i++) {
    let x = i * pointSpacing;
    let offset = getVerticalOffset(x, y); // Calculates vertical offset for each point
    vertex(x, y + offset); // Draws a vertex at the calculated position
  }
}

// Calculates the vertical offset based on the pixel values of the image at the given canvas coordinates.
function getVerticalOffset(x, y) {
  let [imgX, imgY] = canvasToImageCoords(x, y); // Converts canvas coordinates to image coordinates
  imgX = floor(imgX);
  imgY = floor(imgY);
  if (imgX < 0 || imgX > img.width - 1 || imgY < 0 || imgY > img.height - 1)
    return 0;

  // Index of the pixel in the image pixel array
  let index = (imgY * img.width + imgX) * 4; // 4 channels (RGBA)
  
  // Getting the values of red, green, blue, and alpha channels of the pixel
  let redValue = img.pixels[index];
  let greenValue = img.pixels[index + 1];
  let blueValue = img.pixels[index + 2];
  let alphaValue = img.pixels[index + 3];
  
  // If alpha channel is 0 (transparent pixel), vertical offset is 0
  if (alphaValue === 0) {
    return 0;
  }
  
  // Otherwise, return the red channel value as before
  return map(redValue, 0, 255, -amp, 0); // Mapping red value to vertical offset
}

// Converts canvas coordinates to image coordinates.
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

```

### Image 

```js
function loadImageFromFile(file) {
  if (file) {
    const extension = file.name.split('.').pop().toLowerCase();
    if (extension === 'svg') {
      const reader = new FileReader();
      reader.onload = function(event) {
        const svgContent = event.target.result;
        // Create a new SVG element
        const imgElement = new Image();
        imgElement.onload = function() {
          // After SVG is loaded successfully, create a p5.Image object
          img = createImage(imgElement.width, imgElement.height);
          img.loadPixels();
          // Copy the image pixels to the p5.Image
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(imgElement, 0, 0);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          img.pixels = imageData.data;
          img.updatePixels();
          // Hide the image loading area
          document.getElementById('drop-area').style.opacity = "0";
        };
        imgElement.src = URL.createObjectURL(file);
      };
      reader.readAsDataURL(file);
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
```

Made by Gleb (a.k.a. khlebobul). Check my [Website](https://khlebobul.github.io/) and [Twitter(X)](https://twitter.com/khlebobul).
Thanks to [Ivan](https://ivandianov.com/) and [Adam](https://cdarr.ru/) from [setka.design](https://setka.design) for their help, inspiration and great [course](https://setka.design).
