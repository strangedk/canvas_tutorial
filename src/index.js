let canvas;
let ctx;
let desk;
let animationFrame;

const resize = (canvas, window) => {
  const width = canvas.width = window.innerWidth;
  const height = canvas.height = window.innerHeight;

  return {width, height};
}

const create = (ctx, w, h) => {
  return new Desk(ctx, w, h);
}

window.onload = () => {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  const {width, height} = resize(canvas, window);

  desk = create(ctx, width, height);
  desk.animate(0);
}

window.addEventListener('resize', function () {
  cancelAnimationFrame(animationFrame);

  const {width, height} = resize(canvas, window);

  desk = create(ctx, width, height);
  desk.animate(0);
});

const mouse = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
})

class Desk {
  #ctx;
  #width;
  #height;

  constructor(ctx, width, height) {
    this.#ctx = ctx;
    this.#width = width;
    this.#height = height;
    this.#ctx.strokeStyle = 'white';

    this.x = 0;
    this.y = 0;
    this.angle = 0;

    this.lastTime = 0;
    this.interval = 1000/60;
    this.timer = 0;
    this.d = 0;
  }

  #drawLine(x, y, to_x, to_y) {
    this.#ctx.beginPath();
    this.#ctx.moveTo(x, y);
    this.#ctx.lineTo(to_x, to_y);
    this.#ctx.stroke();
  }

  #clear(x, y, to_x, to_y) {
    this.#ctx.clearRect(x, y, to_x, to_y);
  }

  animate(timeStamp) {
    const deltaTime = timeStamp - this.lastTime;
    this.lastTime = timeStamp;

    if (this.timer > this.interval) {
      this.d += 0.01;
      this.#clear(0, 0, this.#width, this.#height);

      // const x1 = (this.#width/2 + Math.sin(this.angle)*10) + mouse.x;
      // const y1 = (this.#height/2 + Math.cos(this.angle)*10) + mouse.y;
      const x1 = mouse.x;
      const y1 = mouse.y;
      // const x2 = this.#width/2;
      // const y2 = this.#height/2;

      let prevX = 0;
      let prevY = 0;

      const stepX = Math.abs(1 + (this.#width * (Math.sin(this.d))));
      const stepY = Math.abs(1 + (this.#height * (Math.cos(this.d))));

      console.log((Math.cos(this.d)));

      for (let x = 0; x < this.#width; x += stepX) {
        for (let y = 0; y < this.#height; y += stepY) {
          const currX = x;
          const currY = y;
          this.#drawLine(prevX, prevY, currX, currY);
          prevX = currX;
          prevY = currY;
        }
      }

      this.timer = 0;
    } else {
      this.timer += deltaTime;
    }

    animationFrame = requestAnimationFrame(this.animate.bind(this))
  }
}
