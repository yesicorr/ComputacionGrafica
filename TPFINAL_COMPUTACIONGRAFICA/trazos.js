class Trazo {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angulo = random(360);

    // Variables para vibración
    this.vibrarX = 0;
    this.vibrarY = 0;
    this.vibrarA = 0;
  }

  actualizarVibracion(activar) {
    if (activar) {
      this.vibrarX = random(-6, 6);
      this.vibrarY = random(-6, 6);
      this.vibrarA = random(-10, 10);
    } else {
      this.vibrarX = 0;
      this.vibrarY = 0;
      this.vibrarA = 0;
    }
  }

  dibujar() {
    push();
    translate(this.x + this.vibrarX, this.y + this.vibrarY);
    rotate(radians(this.angulo + this.vibrarA));
    rectMode(CENTER);
    fill(100, 150, 200);
    rect(0, 0, 20, 10);
    pop();
  }
}

class TrazosDer {
  constructor(x, y, obra, escala = 1){
    this.x = x;
    this.y = y;
    this.img = obra;
    this.escala = escala;
    this.velocidad = 20;
  }

  dibujar(){
    push();
    translate(this.x, this.y);
    scale(this.escala);
    image(this.img, 0, 0);
    pop();
  }

  moverDerecha() {
    this.x += 5;
    if (this.x > width + 100) {
      this.x = -100;
      this.y = random(0, height);
    }
  }
}

class TrazosIzq {
  constructor(x, y, obra, escala = 1){
    this.x = x;
    this.y = y;
    this.img = obra;
    this.escala = escala;
    this.velocidad = 20;
  }

  dibujar(){
    push();
    translate(this.x, this.y);
    scale(this.escala);
    image(this.img, 0, 0);
    pop();
  }

  moverIzquierda() {
    this.x -= 5;
    if (this.x < -100) {
      this.x = width + 100;
      this.y = random(0, height);
    }
  }
}

class TrazosCent {
  constructor(x, y, obra, escala = 1){
    this.x = x;
    this.y = y;
    this.img = obra;
    this.escala = escala || 1;
    this.ang = 0;
  }

  dibujar(){
    push();
    translate(this.x, this.y);
    rotate(this.ang);
    scale(this.escala);
    image(this.img, 0, 0);
    pop();
  }

  cambiarTamaño(tamNuevo){
    this.escala = tamNuevo;
  }

  rotar(velocidad = 0.01){
    this.ang += velocidad;
  }
}
