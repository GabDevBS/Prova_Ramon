const canvas = document.getElementById('telaJogo');
const ctx = canvas.getContext('2d');
let gameOver = false;
let record = 0;

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

class Entidade {
    constructor(x, y, largura, altura) {
        this.x = x
        this.y = y
        this.largura = largura
        this.altura = altura
    }
    desenhar (){
        ctx.fillStyle = 'black'
        ctx.fillRect(this.x, this.y, this.largura, this.altura)
    }
}

class Cobra extends Entidade {
    #pontos = 0
    constructor(x, y, largura, altura) {
        super(x, y, largura, altura)
    }
    desenhar (){
    ctx.fillStyle ='green'
    ctx.fillRect(this.x, this.y, this.largura, this.altura)
}
    atualizar() {
        if (teclasPressionadas.KeyW) {
            this.y -= 8
        } else if (teclasPressionadas.KeyS) {
            this.y += 8
        } else if (teclasPressionadas.KeyA) {
            this.x -= 8
        } else if (teclasPressionadas.KeyD) {
            this.x += 8
        }
    }

    verificarParede(){
        if(this.x < 0 || 
            this.x > canvas.width-this.largura ||
            this.y < 0 || 
            this.y > canvas.height-this.altura){
            gameOver = true
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
        this.#pontos += 1
    }

    get pontos(){
        return this.#pontos
    }

    restPontos() {
        this.#pontos = 0;
    }
}

class Comida extends Entidade {
    constructor() {
        super(Math.random()*canvas.width-10, Math.random()*canvas.height-10, 20, 20)
    }
    desenhar (){
        ctx.fillStyle ='red'
        ctx.fillRect(this.x, this.y, this.largura, this.altura)
    }
}

const cobra = new Cobra(100, 200, 20, 20)
const comida = new Comida()

function loop() {
    if(gameOver == false){
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        cobra.desenhar()
        cobra.atualizar()
        comida.desenhar()
        cobra.verificarParede()
        cobra.verificarColisao(comida)

        if (cobra.pontos > record) {
            record = cobra.pontos;
        }

        ctx.fillStyle = 'black'
        ctx.font = '20px Arial'
        ctx.fillText('Pontuação: ' + cobra.pontos, 10, 20)
        ctx.fillText('Recorde: ' + record, 10, 50)

        requestAnimationFrame(loop)
    }else{
        ctx.fillStyle = 'red'
        ctx.font = '30px Arial'
        ctx.fillText('Game Over!', canvas.width / 2 - 80, canvas.height / 2)
    }
}

loop()

document.addEventListener('click', () => {
    if (gameOver == true) {
        gameOver = false
        cobra.x = 100
        cobra.y = 200
        comida.x = Math.random() * (canvas.width - 10)
        comida.y = Math.random() * (canvas.height - 10)
        cobra.resetarPontos()
        loop()
    }
});