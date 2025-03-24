const canvas = document.getElementById('jogoCanvas')
const ctx = canvas.getContext('2d')


const teclasPressionadas = {
   KeyW: false,
   KeyS: false,
   KeyD: false,
   KeyA: false
};
document.addEventListener('keydown', (e) => {
   for (let tecla in teclasPressionadas) {
       if (teclasPressionadas.hasOwnProperty(e.code)) {
           teclasPressionadas[tecla] = false;
       }
   }
   if (teclasPressionadas.hasOwnProperty(e.code)) {
       teclasPressionadas[e.code] = true;
   }
});

function reiniciarJogo() {
    gameOver = false;
    pontuacao = 0;
    cobra.segmentos = [{x: 100, y: 200}];
    cobra.tamanhoSegmento = 20;
    comida.x = Math.random() * (canvas.width - comida.largura);
    comida.y = Math.random() * (canvas.height - comida.altura);
    loop();
 }

let gameOver = false;
let pontuacao = 0;

class Entidade {
   constructor(x, y, largura, altura) {
       this.x = x
       this.y = y
       this.largura = largura
       this.altura = altura
   }    
   desenhar() {
    ctx.fillStyle = 'black';
    ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }
}


class Cobra extends Entidade {
   constructor(x, y, largura, altura) {
       super(x, y, largura, altura)
   }
   atualizar() {
       if (teclasPressionadas.KeyW) {
           this.y -= 7
       } else if (teclasPressionadas.KeyS) {
           this.y += 7
       } else if (teclasPressionadas.KeyA) {
           this.x -= 7
       } else if (teclasPressionadas.KeyD) {
           this.x += 7
       }
   }
   verificarColisao(comida){
       if(
           this.x < comida.x + comida.largura &&
           this.x + this.largura > comida.x &&
           this.y < comida.y + comida.altura &&
           this.y + this.altura > comida.y
       ){ 
           this.#houveColisao(comida)
       }
   }
   #houveColisao(comida){
       comida.x = Math.random()*canvas.width-10
       comida.y = Math.random()*canvas.height-10
   }
        desenhar() {
        this.segmentos.forEach((segmento, index) => {
            const verde = index === 0 ? 197 : Math.max(50, 197 - (index * 5));
            ctx.fillStyle = `rgb(12, ${verde}, 37)`;
            ctx.fillRect(segmento.x, segmento.y, this.tamanhoSegmento, this.tamanhoSegmento);
        });
    }
}
class Comida extends Entidade {
   constructor() {
       super(Math.random()*canvas.width-10,Math.random()*canvas.height-10, 20, 20)
   }
   desenhar() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.largura, this.altura);
   }
}


const cobra = new Cobra(100, 200, 20, 20)
const comida = new Comida()


function loop() {
   ctx.clearRect(0, 0, canvas.width, canvas.height)
   cobra.desenhar()
   cobra.atualizar()
   comida.desenhar()
   cobra.verificarColisao(comida)
   requestAnimationFrame(loop)
}
loop()
