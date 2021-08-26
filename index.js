
/* 
INICIADOR
*/


window.onload = function () {
  canvas = document.getElementById('canvas');//coge el canvas en una variable
  if (canvas && canvas.getContext) {
    ctx = canvas.getContext("2d");//asignando un valor a la variable declarada
    if (ctx) {
      x = canvas.width / 2 // posicionar nave
      imagen = new Image(); // asignamos valor a la variable
      imagenEnemigo = new Image();
      imagenEnemigo.src = "./invader.png"//ruta de las imagenes
      imagen.src = "./player.png"
      imagen.onload = function () {  // carga playernave
        jugador = new Jugador(0);
        jugador.dibuja(canvas.width / 2);
        anima();
      }
      imagenEnemigo.onload = function () { // carga naves enemigas
        for (let i = 0; i < 5; i++) {//row
          for (let j = 0; j < 10; j++) { //column
            enemigos_array.push(
              new Enemigo(100 + 40 * j, 30 + 45 * i)
            );
          }
        }
        timer_disparos = setTimeout(disparaEnemigo, 1500);
      }




    } else {
      console.log("tu canvas no funciona")
    }
  }
};

/* 
LISTENERS 
*/

window.requestAnimationFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 17);
    }
})();
document.addEventListener("keydown", function (e) { //tecla pulsada
  teclaPulsada = e.keyCode;
  tecla[e.keyCode] = true;

});
document.addEventListener("keyup", function (e) { //tecla soltada
  tecla[e.keyCode] = false;
});

/* 
VARIABLES 
*/

let canvas, ctx//declaro variables
let x = 100;
let y = 100;
let KEY_ENTER = 13;
let KEY_LEFT = 37;
let KEY_RIGHT = 39;
let KEY_UP = 38;
let KEY_DOWN = 40;
let BARRA = 32;
let imagen, imagenEnemigo;
let tecla = [];
let teclaPulsada = null;
let colorBala = "red";
let balas_array = new Array();
let enemigos_array = new Array();
let balasEnemigas_array = new Array();
let timer_disparos;
let finJuegos = false;

/* 
OBJETOS
 */

class Jugador {
  constructor(x) {
    this.x = x;
    this.y = 460;
    this.w = 60;
    this.h = 40;
    this.dibuja = function (x) {
      this.x = x;
      ctx.drawImage(imagen, this.x, this.y, this.w, this.h);
    };
    this.isShooting = false;
  }
}
class Enemigo {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 35;
    this.veces = 0;//saltos abajo
    this.dx = 5;//direccion + numero px
    this.ciclos = 0;//n de veces para moverse
    this.num = 14; //saltos en horizontal
    this.vive = true;
    //this.isFirst = false;
    //this.isShooting = false
    this.dibuja = function () {
      if (this.ciclos > 30) {
        if (this.veces > this.num) {
          this.dx *= -1;
          this.veces = 0;
          this.num = 28;
          this.y += 10;
          this.dx = (this.dx > 0) ? this.dx++ : this.dx--;
        } else {
          this.x += this.dx;
        }
        this.veces++;
        //console.log(this.veces)//saltos hacia abajo
        this.ciclos = 0;
      } else {
        this.ciclos++;
        //console.log(this.ciclos)
      }
      if (this.vive) {
        ctx.drawImage(imagenEnemigo, 0, 0, 40, 30, this.x, this.y, 35, 30);
      }

    }

  }
}

class Bala {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.dibuja = function () {
      ctx.save();
      ctx.fillStyle = colorBala;
      ctx.fillRect(this.x, this.y, this.w, this.w);
      this.y = this.y - 1//velocidad bala
      ctx.restore();
    };
    this.dispara = function () {//bala enemiga
      ctx.save();
      ctx.fillStyle = colorBala;
      ctx.fillRect(this.x, this.y, this.w, this.w);
      this.y = this.y + 2//velocidad bala
      ctx.restore();
    };
  }
}
/* FUNCIONES */
if(finJuegos == false){
  function anima() {
    requestAnimationFrame(anima); //funcion para refresco
    verifica(); //verifica el avanze del objeto
    pinta(); //pinta el objeto
    checkIfColision();// verifica las colisiones
  }
}

function checkIfColision() {
  for (let i = 0; i < enemigos_array.length; i++) {//recorre el array enemigos
    for (let j = 0; j < balas_array.length; j++) {//recorre el array balas
      enemigo = enemigos_array[i];
      bala = balas_array[j];
      if (enemigo != null && bala != null) { //preguntamos si es diferente a nulo.
        if ((bala.x > enemigo.x) &&
          (bala.x < enemigo.x + enemigo.w) &&
          (bala.y > enemigo.y) &&
          (bala.y < enemigo.y + enemigo.w)) {
          enemigo.vive = false;
          enemigos_array[i] = null;
          balas_array[j] = null;
          /*  enemigos_array.splice(i, 1);
           balas_array.splice(j, 1); */
        }
      }
    }
  }
  for (var j = 0; j < balasEnemigas_array.length; j++) {
    bala = balasEnemigas_array[j];
    if (bala != null) {
      if ((bala.x > jugador.x) &&
        (bala.x < jugador.x + jugador.w) &&
        (bala.y > jugador.y) &&
        (bala.y < jugador.y + jugador.h)) {
        gameOver();
      }
    }
  }
}
function gameOver() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  enemigos_array = [];
  balasEnemigas_array = [];
  balas_array = [];
  finJuegos = true;
  alert("has perdido")
}
function verifica() {
  if (tecla[KEY_RIGHT]) {
    x += 5;
    //console.log("derecha funciona")
  }
  if (tecla[KEY_LEFT]) {
    x -= 5;

    //console.log("izquierda funciona")
  }
  //nave
  if (x > canvas.width - 60) {
    x = canvas.width - 60;
  } else if (x < 0) {
    x = 0;
  }
  if (tecla[BARRA]) {
    balas_array.push(new Bala(jugador.x + 12, jugador.y - 3, 5));
    tecla[BARRA] = false;
    setInterval(() => {
      disparaEnemigo()
    }, 1500);
  }
}
function pinta() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  jugador.dibuja(x);
  //balas
  for (let i = 0; i < balas_array.length; i++) {
    if (balas_array[i] != null) {
      balas_array[i].dibuja();
      if (balas_array[i].y < 0) {
        balas_array[i] = null;
      }
    }
  }
  //balas enemigas
  for (let i = 0; i < balasEnemigas_array.length; i++) {
    if (balasEnemigas_array[i] != null) {
      balasEnemigas_array[i].dispara();
      if (balasEnemigas_array[i].y > canvas.height) {
        balasEnemigas_array[i] = null;
      }
    }
  }

  //enemigos
  for (let i = 0; i < enemigos_array.length; i++) {
    if (enemigos_array[i] != null) {
      enemigos_array[i].dibuja();
    }
  }
}
/* function disparar() {
  if (!jugador.isShooting) {
    jugador.isShooting = true;
    balas_array.push(new Bala(jugador.x + 28, jugador.y - 3, 3, 5));
    setTimeout(() => {
      jugador.isShooting = false;
    }, 200);
  }
} */
/* function disparaEnemigo(){            
 
  enemigos_array.forEach(element1 => {
   enemigos_array.forEach(element2 => {
     if((element1.y < element2.y)&&(element1.x === element2.x)){
        element1.isFirst = true;
        
     } 
     else{
       element1.isFirst = false;
     }
 
     enemigos_array.forEach(element => {
       if(element.isFirst === true){
        
       }
     });
 
   });
 });
  if(enemigos_array != null){
  
  }
} */

function disparaEnemigo() {
  let ultimaFila = new Array();
  for (let i = enemigos_array.length - 1; i > 0; i--) {
    if (enemigos_array[i] != null) {
      ultimaFila.push(i);
    }
    if (ultimaFila.length == 10)
      break;
  }
  randomPick = ultimaFila[Math.floor(Math.random() * 10)];
  balasEnemigas_array.push(new Bala(enemigos_array[randomPick].x + enemigos_array[randomPick].w / 2,
    enemigos_array[randomPick].y, 5));
}