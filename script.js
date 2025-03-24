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
       teclasPressionadas[tecla] = false
   }
   
   if (teclasPressionadas.hasOwnProperty(e.code)) {
       teclasPressionadas[e.code] = true
   }
})
let gameOver = false
let pontuacao = 0
function reiniciarJogo() {
   gameOver = false
   pontuacao = 0
   cobra.x = 100
   cobra.y = 200
   comida.x = Math.random()*(canvas.width - comida.largura)
   comida.y = Math.random()*(canvas.height - comida.altura)
   loop()
}
canvas.addEventListener('click', () => {
   if (gameOver) {
       reiniciarJogo()
   }
})

class Entidade {
   constructor(x, y, largura, altura) {
       this.x = x
       this.y = y
       this.largura = largura
       this.altura = altura
   }
   
   desenhar() {
       ctx.fillStyle = 'black'
       ctx.fillRect(this.x, this.y, this.largura, this.altura)
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
       this.verificarBordas()
   }
   
   verificarBordas() {
       if (this.x < 0 || this.x + this.largura > canvas.width || 
           this.y < 0 || this.y + this.altura > canvas.height) {
           gameOver = true
       }
   }
   verificarColisao(comida) {
       if (
           this.x < comida.x + comida.largura &&
           this.x + this.largura > comida.x &&
           this.y < comida.y + comida.altura &&
           this.y + this.altura > comida.y
       ) { 
           this.#houveColisao(comida)
       }
   }
   #houveColisao(comida) {
       comida.x = Math.random()*(canvas.width - comida.largura)
       comida.y = Math.random()*(canvas.height - comida.altura)
       pontuacao++
   }
   desenhar() {
       ctx.fillStyle = 'rgb(12, 197, 37)'
       ctx.fillRect(this.x, this.y, this.largura, this.altura)
   }
}

class Comida extends Entidade {
   constructor() {
       super(Math.random()(canvas.width - 20),Math.random()(canvas.height - 20),20,20)
   }
   desenhar() {
       ctx.fillStyle = 'red'
       ctx.fillRect(this.x, this.y, this.largura, this.altura)
   }
}
const cobra = new Cobra(100, 200, 20, 20)
const comida = new Comida()

function desenharTelaGameOver() {
   ctx.fillStyle = 'rgba(0, 0, 0, 0.75)'
   ctx.fillRect(0, 0, canvas.width, canvas.height)
   ctx.fillStyle = 'white'
   ctx.font = '48px Arial'
   ctx.textAlign = 'center'
   ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 50)
   ctx.font = '24px Arial'
   ctx.fillText(`Pontuação: ${pontuacao}`, canvas.width / 2, canvas.height / 2)
   ctx.font = '18px Arial'
   ctx.fillText('Clique para jogar novamente', canvas.width / 2, canvas.height / 2 + 40)
}
function desenharPontuacao() {
   ctx.fillStyle = 'black'
   ctx.font = '20px Arial'
   ctx.textAlign = 'left'
   ctx.fillText(`Pontuação: ${pontuacao}`, 10, 30)
}
function loop() {
    if (gameOver) {
        desenharTelaGameOver()
        return
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    cobra.atualizar()
    cobra.desenhar()
    comida.desenhar()
    cobra.verificarColisao(comida)
    desenharPontuacao()
    requestAnimationFrame(loop)
 }
 loop()