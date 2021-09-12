const carro = new Carrito(); //Instancio o creo un nuevo objeto de la clase carrito
const carrito = document.getElementById('carrito'); //Creo una constante tomando el ID del div que esta en la linea 39 del index.html
const productos = document.getElementById('lista-productos'); //Creo una constante tomando el ID del div que esta en la linea 90 del index.html, donde estan todos los productos o CARDS
const listaProductos = document.querySelector('#lista-carrito tbody'); //Creo una constante que apunta al tbody de la tabla que esta en el navbar (linea 49 del index.html)
const vaciarCarritoBtn = document.getElementById('vaciar-carrito'); //Creo una constante que apunta al boton VACIAR (a su ID)
const procesarPedidoBtn = document.getElementById('procesar-pedido'); //Creo una constante que apunta al ID del boton COMPRAR

cargarEventos();

function cargarEventos(){

    //Se ejecuta cuando se presiona agregar al carrito
    productos.addEventListener('click', (e)=>{carro.comprarProducto(e)});

    //Se ejecuta cuando se eliminan productos del carrito
    carrito.addEventListener('click', (e)=>{carro.eliminarProducto(e)});

    //Se ejecuta cuando se presiona el boton Vaciar
    vaciarCarritoBtn.addEventListener('click', (e)=>{carro.vaciarCarrito(e)});

    //Al cargar documento se muestra lo almacenado en Local Storage. Gracias al evento 'DOMContentLoaded', calculo que con 'load' se puede hacer lo mismo, pero creo que no es necesario que cargue todo.
    document.addEventListener('DOMContentLoaded', carro.leerLocalStorage());

    //Envio el pedido a otra pagina que va a procesar la compra
    procesarPedidoBtn.addEventListener('click', (e)=>{carro.procesarPedido(e)});
}


//Funcionalidad de subir al top con boton
let scrollBoton = document.querySelector(".arrow-icon");

addEventListener('scroll', () =>{
    scrollBoton.classList.toggle('active', window.scrollY > 900);
});

scrollBoton.addEventListener('click', () =>{
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    })
})


//Funcionalidad letras de humo
const letrasHumo = document.querySelector('.letters-smoke');
letrasHumo.innerHTML = letrasHumo.textContent.replace(/\S/g, "<span>$&</span>") //Expresion regular para transformar cualquier caracter que no sea espacio a un <span>
const letters = document.querySelectorAll('span');
//Aca recorro cada una de las "letras" y le agrego la clase 'letter-active' y despues hace todo el CSS, luego de 3 segundos la letra vuelve a su lugar porque le saco la clase 'letter-active', porque me di cuenta que sino el span hacia la animacion por CSS y se iba fuera de la pagina, lo que me generaba un scroll horizontal.
for (const letter of letters) {
    letter.addEventListener('mouseover', function () {
        letter.classList.add('letter-active')
        setTimeout(function () {
            letter.classList.remove('letter-active')
        }, 3000)
    })

}


//Funcionalidad de la libreria Scroll Reveal
ScrollReveal().reveal('.reveal', { delay: 300, opacity: 0.2, distance: '100px' });
