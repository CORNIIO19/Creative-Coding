class Mold {
  constructor() {
    this.x = random(width / 2 - 20, width / 2 + 20);
    this.y = random(height / 2 - 20, height / 2 + 20);
    this.r = 0.5;

    this.heading = random(360);
    this.vx = cos(this.heading);
    this.vy = sin(this.heading);
    this.stop = false;

    this.rotAngle = 45;      // cuánto gira al decidir
    this.sensorAngle = 45;   // separación de los sensores respecto al frente
    this.sensorDist = 10;    // distancia a la que "huele"

    this.rSensorPos = createVector(0, 0);
    this.lSensorPos = createVector(0, 0);
    this.fSensorPos = createVector(0, 0);
  }

  update() {
    this.vx = cos(this.heading);
    this.vy = sin(this.heading);

    if (this.stop) {
      this.vx = 0;
      this.vy = 0;
    }

    // Movimiento con wrap-around en los bordes
    this.x = (this.x + this.vx + width) % width;
    this.y = (this.y + this.vy + height) % height;

    // Posición de los tres sensores
    this.getSensorPos(this.rSensorPos, this.heading + this.sensorAngle);
    this.getSensorPos(this.lSensorPos, this.heading - this.sensorAngle);
    this.getSensorPos(this.fSensorPos, this.heading);

    // Lectura del canal rojo en cada sensor
    let r = this.readPixel(this.rSensorPos);
    let l = this.readPixel(this.lSensorPos);
    let f = this.readPixel(this.fSensorPos);

    // Reglas de Jeff Jones
    if (f > l && f > r) {
      this.heading += 0;
    } else if (f < l && f < r) {
      this.heading += random(1) < 0.5 ? this.rotAngle : -this.rotAngle;
    } else if (l > r) {
      this.heading -= this.rotAngle;
    } else if (r > l) {
      this.heading += this.rotAngle;
    }
  }

  readPixel(sensor) {
    let index = 4 * (d * floor(sensor.y)) * (d * width) + 4 * (d * floor(sensor.x));
    return pixels[index] !== undefined ? pixels[index] : 0;
  }

  getSensorPos(sensor, angle) {
    sensor.x = (this.x + this.sensorDist * cos(angle) + width) % width;
    sensor.y = (this.y + this.sensorDist * sin(angle) + height) % height;
  }

  display() {
    noStroke();
    fill(255);
    ellipse(this.x, this.y, this.r * 2);
  }
}
