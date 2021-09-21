//Creo una clase en la cual estaran todos los metodos del carrito
class Carrito {

    //Añadir producto al carrito
    comprarProducto(e){
        e.preventDefault();
        //Delegacion de eventos para agregar al carrito. Todos las etiquetas "a" de las CARDS tienen una clase "agregar-carrito"
        if(e.target.classList.contains('agregar-carrito')){
            const producto = e.target.parentElement.parentElement; //Guardo en la constante producto toda la CARD. Se puede ver toda la CARD haciendo el console.log(producto)
            //Envio el producto seleccionado para tomar sus datos
            this.leerDatosProducto(producto);
        }
    }

    //Leer datos del producto
    leerDatosProducto(producto){
        //Creo un objeto literal de toda la informacion del producto. En cada elemento del objeto selecciono la parte que necesito
        const infoProducto = {
            imagen : producto.querySelector('img').src,
            titulo: producto.querySelector('h3').textContent,
            precio: producto.querySelector('.desc span').textContent,
            id: producto.querySelector('a').getAttribute('data-id'), //Selecciono la etiqueta a y de ella el atributo que le puse de nombre data-id (cada producto o CARD va a tener un id)
            cantidad: 1
        }
        //Para ver si el producto ya esta en el carrito
        let productosLS;
        productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach(function (productoLS){
            if(productoLS.id === infoProducto.id){
                productosLS = productoLS.id;
            }
        });
        //Si el producto que esta en el Local Storage tiene el mismo ID que el que yo quiero agregar, no me va a dejar y lo que hago es generar un modal (este modal es de la libreria Sweet Alert), y sino lo agrego al carrito (tambien genero un modal de la libreria Sweet Alert) avisando que se agrego.
        if(productosLS === infoProducto.id){
            Swal.fire({
                icon: 'warning',
                title: 'Ya tienes este producto en el carrito',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
            })
        }
        else {
            this.insertarCarrito(infoProducto);
            Swal.fire({
                icon: 'success',
                title: 'Producto agregado',
                timer: 1400,
                timerProgressBar: true,
                showConfirmButton: false,
            })
        }
        
    }

    //Muestro el producto seleccionado en el carrito, haciendo un appendChild de la constante row que creo en listaProductos (explicada en la linea 4 de pedido.js)
    insertarCarrito(producto){
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${producto.imagen}" width=40>
            </td>
            <td>${producto.titulo}</td>
            <td>${producto.precio}</td>
            <td>
                <a href="#" class="borrar-producto bi bi-x-circle fs-2" data-id="${producto.id}"></a>
            </td>
        `;
        listaProductos.appendChild(row);
        this.guardarProductosLocalStorage(producto);

    }

    //Eliminar el producto del carrito
    eliminarProducto(e){
        e.preventDefault();
        let producto, productoID;
        if(e.target.classList.contains('borrar-producto')){
            e.target.parentElement.parentElement.remove();
            producto = e.target.parentElement.parentElement;
            productoID = producto.querySelector('a').getAttribute('data-id');
        }
        this.eliminarProductoLocalStorage(productoID);
        this.calcularTotal();

    }

    //Elimina todos los productos
    vaciarCarrito(e){
        e.preventDefault();
        while(listaProductos.firstChild){
            listaProductos.removeChild(listaProductos.firstChild);
        }
        this.vaciarLocalStorage(); //Los elimina del Local Storage tambien

        return false;
    }

    //Almacenar en el Local Storage
    guardarProductosLocalStorage(producto){
        let productos;
        //Toma valor de un arreglo con datos del LS
        productos = this.obtenerProductosLocalStorage();
        //Agrego el producto al carrito
        productos.push(producto);
        //Agrego al Local Storage
        localStorage.setItem('productos', JSON.stringify(productos));
    }

    //Comprobar que hay elementos en el LS
    obtenerProductosLocalStorage(){
        let productoLS;

        //Comprobar si hay algo en Local Storage. Si no hay nada en el Local Storage igualo la variable a un array vacio, sino parseo para transformar en objeto. Retorno el valor de productoLS
        if(localStorage.getItem('productos') === null){
            productoLS = [];
        }
        else {
            productoLS = JSON.parse(localStorage.getItem('productos'));
        }
        return productoLS;
    }

    //Muestro los productos guardados en el Local Storage
    leerLocalStorage(){
        let productosLS;
        productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach(function (producto){
            //Construir plantilla
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${producto.imagen}" width=40>
                </td>
                <td>${producto.titulo}</td>
                <td>${producto.precio}</td>
                <td>
                    <a href="#" class="borrar-producto bi bi-x-circle fs-2" data-id="${producto.id}"></a>
                </td>
            `;
            listaProductos.appendChild(row);
        });
    }

    //Mostrar los productos guardados en el LS en compra.html
    leerLocalStorageCompra(){
        let productosLS;
        productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach(function (producto){
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${producto.imagen}" width=40>
                </td>
                <td>${producto.titulo}</td>
                <td>${producto.precio}</td>
                <td>
                    <input type="number" class="form-control cantidad" min="1" value=${Math.abs(producto.cantidad)}>
                </td>
                <td id='subtotales'>${Math.abs(producto.precio * producto.cantidad)}</td>
                <td>
                    <a href="#" class="borrar-producto bi bi-x-circle fs-2" style="font-size:30px" data-id="${producto.id}"></a>
                </td>
            `;
            listaCompra.appendChild(row);
        });
    }

    //Eliminar producto por ID del Local Storage
    eliminarProductoLocalStorage(productoID){
        let productosLS;
        //Obtengo el array de productos
        productosLS = this.obtenerProductosLocalStorage();
        //Comparar el id del producto borrado con Local Storage
        productosLS.forEach(function(productoLS, index){
            if(productoLS.id === productoID){
                productosLS.splice(index, 1);
            }
        });

        //Añado el array actual al Local Storage
        localStorage.setItem('productos', JSON.stringify(productosLS));
    }

    //Elimino todos los datos del Local Storage
    vaciarLocalStorage(){
        localStorage.clear();
    }

    //Proceso el pedido
    procesarPedido(e){
        e.preventDefault();
        //Si esta vacio el Local Storage, creo un modal (con Sweet Alert) que no hay productos en el carrito, sino (si hay producto/s en el carrito) abro la pagina para procesar la compra.
        if(this.obtenerProductosLocalStorage().length === 0){
            Swal.fire({
                icon: 'warning',
                title: 'El carrito está vacío, agrega algún producto',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
            })
        }
        else {
            location.href = "compra.html";
        }
    }

    //Calcular montos
    calcularTotal(){
        let productosLS;
        let total = 0;
        productosLS = this.obtenerProductosLocalStorage();
        for(let i = 0; i < productosLS.length; i++){
            let element = Number(productosLS[i].precio * productosLS[i].cantidad);
            total = Math.abs(total + element);
            
        }

        document.getElementById('total').value = "ARS " + total.toFixed(2);
    }

    obtenerEvento(e) {
        e.preventDefault();
        let id, cantidad, producto, productosLS;
        if (e.target.classList.contains('cantidad')) {
            producto = e.target.parentElement.parentElement;
            id = producto.querySelector('a').getAttribute('data-id');
            cantidad = producto.querySelector('input').value;
            let actualizarMontos = document.querySelectorAll('#subtotales');
            productosLS = this.obtenerProductosLocalStorage();
            productosLS.forEach(function (productoLS, index) {
                if (productoLS.id === id) {
                    productoLS.cantidad = cantidad;                    
                    actualizarMontos[index].innerHTML = Number(cantidad * productosLS[index].precio);
                }    
            });
            localStorage.setItem('productos', JSON.stringify(productosLS));
            
        }
        else {
            console.log("click afuera");
        }
    }
}