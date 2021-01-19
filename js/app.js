// Variables
const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const listaCursos = document.querySelector("#lista-cursos");
let articulosCarrito = [];

const fragment = new DocumentFragment();

cargarEventListeners();
function cargarEventListeners() {
    // Cuando agregas un curso presionando "Agregar al carrito";
    listaCursos.addEventListener("click", agregarCurso);

    // Elimina cursos del carrito
    carrito.addEventListener("click", eliminarCurso);

    // Muestra los cursos en el carrito en el Storage
    document.addEventListener("DOMContentLoaded", () => {
        articulosCarrito = JSON.parse( localStorage.getItem('carrito') ) || [];

        carritoHTML();
    });

    // Vaciar el carrito 
    vaciarCarritoBtn.addEventListener("click", () => {
        articulosCarrito = [];

        limpiarHTML();
    });
}

// Funciones
function agregarCurso(evt) {
    evt.preventDefault();
    
    if(evt.target.classList.contains("agregar-carrito")) {
        const cursoSeleccionado = evt.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
    }
}

// Elimina un curso del carrito
function eliminarCurso(evt) {
    evt.preventDefault();
    
    if(evt.target.classList.contains("borrar-curso")) {
        const cursoId = evt.target.getAttribute("data-id");

        // Eliminar del arreglo de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId);
        carritoHTML(); // Iterar sobre el carrito y mostrar su HTML
    }
}


// Lee el contenido del HTML al que le dimos click y extrae la información del curso
function leerDatosCurso(curso) {
    // Crear un objeto con el contenido de curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('span').textContent,
        id: curso.querySelector("a").getAttribute("data-id"),
        cantidad: 1 
    };

    // Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id); 
    if(existe) {
        // Actualizamos la cantidad
        const cursos = articulosCarrito.map( curso => {
            if(curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso; // Retorna el objeto actualizado
            } else {
                return curso; // Retorna los objetos que no son duplicados
            }
        } );
        articulosCarrito = [...cursos];
    } else {
        // Agrega elementos al arreglo del carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    console.log(articulosCarrito);

    carritoHTML();
}


// Muestra el carrito de compras en el HTML
function carritoHTML() {

    // Limpiar el HTML
    limpiarHTML();

    // Recorre el carrito y genera el HTML
    articulosCarrito.forEach( curso => {
        const { id, imagen, titulo, precio, cantidad } = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${imagen}" width="100px"> 
            </td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}"> X </a>  
            </td>
        `;

        // Se agrega al DocumentFragment para agregarlo al HTML
        fragment.appendChild(row);
    });
    // Agrega el HTML del carrito al tbody
    contenedorCarrito.appendChild(fragment);

    // Agregar el carrito de compras al localStorage
    sincronizarStorage();
}

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

// Elimina los cursos del tbody
function limpiarHTML() {
    // Forma lenta
    // contenedorCarrito.innerHTML = '';

    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}
