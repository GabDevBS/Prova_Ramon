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

canvas.addEventListener('click', () => {
    if (gameOver) {
        reiniciarJogo();
    }
 });

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
       this.segmentos = [{x: x, y: y}];
       this.tamanhoSegmento = largura;
       this.velocidade = 7;
       this.direcao = 'direita';
       this.novaDirecao = 'direita';
   }
   atualizar() {
       if (teclasPressionadas.KeyW && this.direcao !== 'baixo') this.novaDirecao = 'cima';
       else if (teclasPressionadas.KeyS && this.direcao !== 'cima') this.novaDirecao = 'baixo';
       else if (teclasPressionadas.KeyA && this.direcao !== 'direita') this.novaDirecao = 'esquerda';
       else if (teclasPressionadas.KeyD && this.direcao !== 'esquerda') this.novaDirecao = 'direita';
       
       const cabeca = {...this.segmentos[0]};
       
       this.direcao = this.novaDirecao;
       
       switch(this.direcao) {
           case 'cima':
               cabeca.y -= this.velocidade;
               break;
           case 'baixo':
               cabeca.y += this.velocidade;
               break;
           case 'esquerda':
               cabeca.x -= this.velocidade;
               break;
           case 'direita':
               cabeca.x += this.velocidade;
               break;
       }
       this.segmentos.unshift(cabeca);
       if (!this.comeu) {
           this.segmentos.pop();
       } else {
           this.comeu = false;
       }
       this.verificarBordas();
       this.verificarAutoColisao();
   }
   verificarBordas() {
    const cabeca = this.segmentos[0];
    if (cabeca.x < 0 || cabeca.x + this.tamanhoSegmento > canvas.width || 
        cabeca.y < 0 || cabeca.y + this.tamanhoSegmento > canvas.height) {
        gameOver = true;
        }
    }
    verificarAutoColisao() {
        const cabeca = this.segmentos[0];
        for (let i = 1; i < this.segmentos.length; i++) {
            const segmento = this.segmentos[i];
            if (cabeca.x === segmento.x && cabeca.y === segmento.y) {
                gameOver = true;
                break;
            }
        }
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