
class BaseDeDatos {
  constructor() {
    this.productos = [];

  }

  async traerRegistros() {
    const response = await fetch("json/productos.json");
    this.productos = await response.json();
    return this.productos;
  }

  registroPorId(id) {
    return this.productos.find((producto) => producto.id === id);
  }

  registrosPorNombre(palabra) {
    return this.productos.filter((producto) => producto.nombre.toLowerCase().includes(palabra));
  }
  registrosPorCategoria(categoria) {
    return this.productos.filter((producto) => producto.categoria == categoria);
  }
}


class Carrito {
  constructor() {
    const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
    this.carrito = carritoStorage || [];
    this.total = 0;
    this.totalProductos = 0;
    this.listar();
  }

  estaEnCarrito({ id }) {
    return this.carrito.find((producto) => producto.id === id);
  }

  agregar(producto) {
    let productoEnCarrito = this.estaEnCarrito(producto);
    if (productoEnCarrito) {

      productoEnCarrito.cantidad++;
    } else {

      this.carrito.push({ ...producto, cantidad: 1 });
      localStorage.setItem("carrito", JSON.stringify(this.carrito));
    }
    this.listar();
  }

  quitar(id) {
    const indice = this.carrito.findIndex((producto) => producto.id === id);

    if (this.carrito[indice].cantidad > 100) {
      this.carrito[indice].cantidad--;
    } else {

      this.carrito.splice(indice, 1);
    }
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    this.listar();
  }
  restar(id) {
    const indice = this.carrito.findIndex((producto) => producto.id === id);

    if (this.carrito[indice].cantidad > 0) {
      this.carrito[indice].cantidad--;
    } localStorage.setItem("carrito", JSON.stringify(this.carrito));
    this.listar();
  }
  sumar(id) {
    const indice = this.carrito.findIndex((producto) => producto.id === id);
    if (this.carrito[indice].cantidad > -1) {
      this.carrito[indice].cantidad++;
    }
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    this.listar();
  }

  listar() {
    this.total = 0;
    this.totalProductos = 0;
    divCarrito.innerHTML = "";
    for (const producto of this.carrito) {
      divCarrito.innerHTML += `
      <div class="lista_carrito">
            <h5>${producto.nombre}</h5>
            <p>$${producto.precio}</p>
            <div class="btsumflex">
            <a href="#" data-id="${producto.id}" class="btnRestar">-</a><p>Cantidad: ${producto.cantidad}</p><a href="#" data-id="${producto.id}" class="btnSumar">+</a></div>
            <a href="#" data-id="${producto.id}" class="btnQuitar"><svg class="svg_tachobasura" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></a>
            
        </div>
    `;
      this.total += producto.precio * producto.cantidad;
      this.totalProductos += producto.cantidad;
    }
    const botonesSumar = document.querySelectorAll(".btnSumar");
    for (const boton of botonesSumar) {
      boton.onclick = (event) => {
        event.preventDefault();
        this.sumar(Number(boton.dataset.id));
      };
    }
    const botonesRestar = document.querySelectorAll(".btnRestar");
    for (const boton of botonesRestar) {
      boton.onclick = (event) => {
        event.preventDefault();
        this.restar(Number(boton.dataset.id));
      };
    }


    const botonesQuitar = document.querySelectorAll(".btnQuitar");
    for (const boton of botonesQuitar) {
      boton.onclick = (event) => {
        event.preventDefault();
        this.quitar(Number(boton.dataset.id));
        Swal.fire({
          position: 'top',
          icon: 'warning',
          title: 'Su Producto fue quitado del carrito',
          showConfirmButton: false,
          timer: 1000
        })
      };
    }

    spanCantidadProductos.innerText = this.totalProductos;
    spanTotalCarrito.innerText = this.total;
  }
}

class Producto {
  constructor(id, nombre, precio, descripcion, imagen, categoria,preferenceId) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.descripcion = descripcion;
    this.imagen = imagen;
    this.categoria = categoria;
    this.preferenceId = preferenceId

  }
}


const bd = new BaseDeDatos();


const divProductos = document.querySelector("#productos");
const divCarrito = document.querySelector("#carrito");
const spanCantidadProductos = document.querySelector("#cantidadProductos");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const formBuscar = document.querySelector("#formBuscar");
const inputBuscar = document.querySelector("#inputBuscar");
const botonesAgregar = document.querySelectorAll(".btnAgregar");
const botonesCategorias = document.querySelectorAll(".btnCategoria");

botonesCategorias.forEach((boton) => {
  boton.addEventListener("click", (event) => {
    event.preventDefault();
    quitarClaseSeleccionado();
    boton.classList.add("seleccionado");
    const productosPorCategoria = bd.registrosPorCategoria(boton.innerText);
    cargarProductos(productosPorCategoria);
    Swal.fire({
      position: 'center',
      icon: 'info',
      title: boton.innerText,
      showConfirmButton: false,
      timer: 1000
    });
  });
});


const botonTodos = document.querySelector("#btnTodos");
botonTodos.addEventListener("click", (event) => {
  Swal.fire({
    position: 'center',
    icon: 'info',
    title: 'Todos los Productos',
    showConfirmButton: false,
    timer: 1000
  });
  event.preventDefault();
  quitarClaseSeleccionado();
  botonTodos.classList.add("seleccionado");
  cargarProductos(bd.productos);
});

function quitarClaseSeleccionado() {
  const botonSeleccionado = document.querySelector(".seleccionado");
  if (botonSeleccionado) {
    botonSeleccionado.classList.remove("seleccionado");
  }
}

bd.traerRegistros().then((productos) => cargarProductos(productos));



function cargarProductos(productos) {
  divProductos.innerHTML = "";
  for (const producto of productos) {
    const productHTML = `
      <div class="producto container">
        <h3>${producto.nombre}</h3>
        <p>$${producto.precio}</p>
        <h6>${producto.descripcion}</h6>
        <img class="img" src="img/${producto.imagen}" />
        <div id="botonPago${producto.id}"></div>
      </div>
    `;
    divProductos.insertAdjacentHTML('beforeend', productHTML);

    // Agregar botón de pago de Mercado Pago
    const botonPago = document.createElement("script");
    botonPago.src = "https://www.mercadopago.com.ar/integrations/v1/web-payment-checkout.js";
    botonPago.dataset.preferenceId = producto.preferenceId; // Preference ID del producto actual
    botonPago.dataset.source = "button";
    document.getElementById(`botonPago${producto.id}`).appendChild(botonPago);
  }

  // Agregar evento al botón de agregar al carrito
  const botonesAgregar = document.querySelectorAll(".btnAgregar");
  for (const boton of botonesAgregar) {
    boton.addEventListener("click", (event) => {
      event.preventDefault();
      const id = Number(boton.dataset.id);
      const producto = bd.registroPorId(id);
      carrito.agregar(producto);
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'Su Producto fue agregado al carrito',
        showConfirmButton: false,
        timer: 1000
      });
    });
  }
}



formBuscar.addEventListener("submit", (event) => {
  event.preventDefault();
  const palabra = inputBuscar.value;
  cargarProductos(bd.registrosPorNombre(palabra.toLowerCase()));
});
inputBuscar.addEventListener("keyup", (event) => {
  event.preventDefault();
  const palabra = inputBuscar.value;
  cargarProductos(bd.registrosPorNombre(palabra.toLowerCase()));
});



const carrito = new Carrito();



