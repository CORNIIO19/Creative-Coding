// let asciiChar = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,^`'. "
// let asciiChar = " .:-=+*#%@";

// let video; let vidw = 192; let vidh = 108; let scl = 10;
// let w, h;

// function setup() {
//   createCanvas(vidw * scl, vidh * scl);
//   video = createCapture(VIDEO);
//   video.size(vidw, vidh);
//   w = width / video.width;
//   h = height / video.height;
// }

// function draw() {
//   background(280);
//   video.loadPixels();
  
//   /* ---- Using pixels ---- */
//   for (let i=0; i<video.width; i++) {
//     for (let j=0; j<video.height; j++) {
//       let pixelIndex = (i + j*video.width) * 4;
//       let r = video.pixels[pixelIndex + 0];
//       let g = video.pixels[pixelIndex + 1];
//       let b = video.pixels[pixelIndex + 2];
      
//       // let bright = brightness(color(r, g, b))
//       let bright = (r + g + b) / 3;
//       let tIndex = floor(map(bright, 0, 255, 0, asciiChar.length));
      
//       let x = i*w + w/2;
//       let y = j*h + h/2;
//       let t = asciiChar.charAt(tIndex);
//       stroke(255);
//       textSize(w);
//       textAlign(CENTER, CENTER);
//       text(t, x, y);
//     }
//   }
// }

let asciiChar = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,^`'. ";

let video;
// Densidad de caracteres (cuanto más alto, más definición pero más consumo de CPU)
let cols = 160;
let rows = 90;

let cellW, cellH;

function setup() {
  // Ocupa exactamente toda la ventana disponible
  createCanvas(windowWidth, windowHeight);

  video = createCapture(VIDEO);
  video.size(cols, rows);
  video.hide(); // Oculta el tag <video> html secundario

  textFont('monospace');
  textAlign(CENTER, CENTER);
  actualizarCeldas();
}

function actualizarCeldas() {
  cellW = width / cols;
  cellH = height / rows;
}

// Se ejecuta automáticamente al redimensionar la ventana o presionar F11
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  actualizarCeldas();
}

function draw() {
  background(0);
  video.loadPixels();

  // Espera a que la cámara inicialice y entregue datos
  if (video.pixels.length === 0) return;

  noStroke();
  fill(255);
  // Ajuste de escala vertical/horizontal para compensar tipografía monospace
  textSize(cellW * 1.3);

  // 1. DIBUJAR FONDO ASCII
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let pixelIndex = (i + j * cols) * 4;
      let r = video.pixels[pixelIndex + 0];
      let g = video.pixels[pixelIndex + 1];
      let b = video.pixels[pixelIndex + 2];

      let bright = (r + g + b) / 3;

      // Invertir índice: mayor brillo -> carácter más lleno
      let tIndex = floor(map(bright, 0, 255, asciiChar.length - 1, 0));
      let char = asciiChar.charAt(tIndex);

      let x = i * cellW + cellW / 2;
      let y = j * cellH + cellH / 2;
      text(char, x, y);
    }
  }

  // 2. DIBUJAR PREVIEW DE VIDEO FLOTANTE
  let prevW = width * 0.18; // 18% del ancho total
  let prevH = prevW * (rows / cols);
  let margin = 20;
  let prevX = width - prevW - margin;
  let prevY = margin;

  // Fondo y borde estético para la preview
  stroke(255, 120);
  strokeWeight(2);
  noFill();
  rect(prevX - 2, prevY - 2, prevW + 4, prevH + 4);

  // Render del video original
  image(video, prevX, prevY, prevW, prevH);
}

// Opcional: Entrar en modo fullscreen nativo al dar doble clic
function doubleClicked() {
  let fs = fullscreen();
  fullscreen(!fs);
}