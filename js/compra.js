const compra = new Carrito();
const listaCompra = document.querySelector("#lista-compra tbody");
const trTotal = document.getElementById("tr-total");
const carrito = document.getElementById('carrito');
const procesarCompraBtn = document.getElementById('procesar-compra');
const cardNumber = document.getElementById('card-number');
const cardName = document.getElementById('card-name');
const cardCvv = document.getElementById('card-cvv');

cargarEventos();

function cargarEventos() {
    document.addEventListener('DOMContentLoaded', compra.leerLocalStorageCompra());

    //Elimino productos del carrito
    carrito.addEventListener('click', (e) => { compra.eliminarProducto(e) });

    //Calculo el total
    compra.calcularTotal();

    //Cuando se selecciona proceso Compra
    procesarCompraBtn.addEventListener('click', procesarCompra);

    carrito.addEventListener('change', (e) => { compra.obtenerEvento(e) });
    carrito.addEventListener('keyup', (e) => { compra.obtenerEvento(e) });

}

function procesarCompra(e) {
    e.preventDefault();
    if (compra.obtenerProductosLocalStorage().length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'No hay productos, selecciona alguno',
            showConfirmButton: false,
            timer: 2000
        }).then(function () {
            window.location = "index.html";
        })
    }
    else if (cardNumber.value === '' || cardName.value === '' || cardCvv.value === '') {
        Swal.fire({
            icon: 'error',
            title: 'Ingrese todos los campos para finalizar la compra.',
            showConfirmButton: false,
            timer: 2000
        })
    }
    else {
        console.log(listaCompra);
        console.log("Gracias por tu compra");
        localStorage.clear();
        listaCompra.remove();
        trTotal.remove();
        Swal.fire({
            icon: 'success',
            title: '¡Muchas gracias por tu compra!',
            showConfirmButton: false,
            timer: 2000
        })

    }
}

