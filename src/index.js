let canvas;
let ctx;
let desk;
let animationFrame;

const resize = (canvas, window) => {
  const width = canvas.width = window.innerWidth;
  const height = canvas.height = window.innerHeight;

  return {width, height};
}

window.onload = () => {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  const {width, height} = resize(canvas, window);

  desk = new Desk(ctx, width, height);
}

// window.addEventListener("mousemove", (event) => {
//   mouse.x = event.x;
//   mouse.y = event.y;
// })

class Particle {
  #ctx;
  #color;
  #x_step = 0;
  #y_step = 0;
  #x_curr = 0;
  #y_curr = 0;
  #x_from = 0;
  #y_from = 0;

  opacity = 1;

  constructor(ctx, x_from, y_from, x_step, y_step, color) {
    this.#ctx = ctx;
    this.#ctx.fillStyle = 'white';
    this.#ctx.strokeStyle = 'white';
    this.#ctx.lineWidth = Math.random() * 10;
    this.#ctx.moveTo(x_from, y_from);

    this.#x_step = Math.random() > .5 ? x_step : -x_step;
    this.#y_step = Math.random() > .5 ? y_step : -y_step;

    this.#x_curr = this.#x_from = x_from;
    this.#y_curr = this.#y_from = y_from;

    this.#ctx.stroke();
    this.#ctx.fill();
  }

  update() {
    //this.#ctx.save();
    this.opacity = 1 - (this.getDistanceFromStart() / 300);
    if (this.opacity <= 0)
      this.opacity = 0;

    this.#ctx.globalAlpha = this.opacity;

    //this.#ctx.restore();

    this.#ctx.moveTo(this.#x_curr, this.#y_curr);

    this.#x_curr += this.#x_step;
    this.#y_curr += this.#y_step;

    this.#ctx.beginPath();
    this.#ctx.arc(this.#x_curr, this.#y_curr, 12, 0, 2 * Math.PI, false);
    this.#ctx.fillStyle = 'green';
    this.#ctx.fill();
  }

  get position() {
    return {
      x: this.#x_curr,
      y: this.#y_curr
    };
  }

  getDistanceFromStart() {
    return this.getDistanceFromPoint(this.#x_from, this.#y_from)
  }

  getDistanceFromPoint(xFrom, yFrom) {
    const x1 = this.#x_curr - xFrom;
    const y1 = this.#y_curr - yFrom;
    return Math.sqrt(x1 * x1 + y1 * y1);
  }
}

class Desk {
  #ctx;
  #width;
  #height;
  #items = [];

  constructor(ctx, width, height) {
    this.#ctx = ctx;
    this.#width = width;
    this.#height = height;

    document.addEventListener('mousemove', (event) => {
      const ctx = this.#ctx;
      const x_step = Math.random() * 1.2;
      const y_step = Math.random() * 1.2;
      const x_from = event.x;
      const y_from = event.y;

      const particle = new Particle(ctx, x_from, y_from, x_step, y_step,);
      this.#items.push(particle);
      if (this.#items.length === 1) {
        particle.name = 'test1';
      }
      if (this.#items.length === 2) {
        particle.name = 'test2';
      }

    })

    this.animate();
  }

  drawLine(x1, y1, x2, y2) {
    this.#ctx.lineWidth = 1;
    this.#ctx.strokeStyle = '#ffffff';

    this.#ctx.beginPath();
    this.#ctx.moveTo(x1, y1);
    this.#ctx.lineTo(x2, y2);
    this.#ctx.stroke();
  }

  #clear(x, y, to_x, to_y) {
    this.#ctx.clearRect(x, y, to_x, to_y);
  }

  animate(timeStamp) {
    this.#clear(0, 0, this.#width, this.#height);
    this.#ctx.beginPath();

    this.#items.forEach((item, i) => {
      this.#items.forEach((near, j) => {
        const p1 = item.position;
        const p2 = near.position;
        const dist = item.getDistanceFromPoint(p2.x, p2.y);

        if (item.name === 'test1' && near.name === 'test2') {
          console.log(dist)
        }

        if (dist < 100) {
          this.drawLine(p1.x, p1.y, p2.x, p2.y);
        }
      })
      item.update();
    })

    for (let i=this.#items.length-1; i>0; --i) {
      if (this.#items[i].opacity <= 0.5) {
        this.#items.splice(i,1);
      }
    }

    requestAnimationFrame(this.animate.bind(this))
  }
}
