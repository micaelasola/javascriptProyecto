
const cards = document.getElementById('cards')
const items = document.getElementById('items') //elementos del carrito
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content // para acceder a los elementos
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()

let carrito = {}


document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if (localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})

cards.addEventListener('click', e =>{
    addCarrito(e) // para capturar elemento que voy a modificar
})

items.addEventListener('click', e =>{
    btnAccion(e)
})

// Traer productos
const fetchData = async () => {
    try{
        const res = await fetch('api.json')
        const data = await res.json();
        // console.log(data)
        pintarCards(data) // funcion
    } catch (error) {
        console.log(error)
    }
};

const pintarCards = data => {
    // console.log(data) recorrer data
    data.forEach(producto =>{
    //console.log(producto)
    templateCard.querySelector('h5').textContent = producto.title
    templateCard.querySelector('p').textContent = producto.precio
    templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl)
    templateCard.querySelector('.btn-dark').dataset.id = producto.id // para agregar el atributo dinamico del boton con su respectico ID 
    const clone = templateCard.cloneNode(true)
   fragment.appendChild(clone)

    })
    cards.appendChild(fragment)

}

const addCarrito = e => {
   // console.log(e.target)
  // console.log(e.target.classList.contains('btn-dark'))
    if(e.target.classList.contains('btn-dark')){
        //console.log(e.target.parentElement)
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    // console.log(objeto)
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }

    if(carrito.hasOwnProperty(producto.id)){ // si existe, el producto se esta duplicando y hay que aumentar la cantidad. 
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = {...producto} // copia del producto, creando el index con su producto.id = empujar el elemento DENTRO del carrito. 
    pintarCarrito()
    console.log(carrito)
}



const pintarCarrito = () => {
    // console.log(carrito) 
    items.innerHTML = ''  //hay que limpiar html para que no se duplique el item 

    Object.values(carrito).forEach(producto =>{
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio // para dar total
    
    const clone = templateCarrito.cloneNode(true)
    fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    localStorage.setItem('carrito', JSON.stringify(carrito))

    pintarFooter()
}

const pintarFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return 
    }
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0)
    // console.log(nPrecio)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio
    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () =>{
        carrito = {}
        pintarCarrito ()
    })

    const procesarPedido = document.getElementById('procesar-pedido')
    procesarPedido.addEventListener('click', (e) =>{
       e.preventDefault();
       window.location.href = "compra.html"
    })
}

const btnAccion = e =>{
    // console.log(e.target) // para aumentar 
    if(e.target.classList.contains('btn-info')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++ 
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }

    if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()

    }

    e.stopPropagation()
}

let darkMode;

if(localStorage.getItem("dark-mode")) {
    darkMode = localStorage.getItem("dark-mode");
} else {
    darkMode = "light"
}

localStorage.setItem("dark-mode", darkMode);


$(() => {
    if(localStorage.getItem("dark-mode") == "dark") {
        $("body").addClass("dark");
        $("#boton-dark-mode").hide();
        $("#boton-light-mode").show();
    } else {
        $("#boton-light-mode").hide();
    }

    $("#boton-dark-mode").click(() => {
        $("#boton-dark-mode").hide()
        $("#boton-light-mode").show();
        $("body").css({
                "background-color": "#3c3a3b" ,
                "color": "#ddc796" 
        })
        //$("body").addClass("dark");
        localStorage.setItem("dark-mode", "dark")
    })

    $("#boton-light-mode").click(() => {
        $("#boton-light-mode").hide();
        $("#boton-dark-mode").show();
        $("body").css({
            "background-color": "#ddc796" ,
            "color": "#3c3a3b" 
        })
        //$("body").removeClass("dark");
        localStorage.setItem("dark-mode", "light")
    })

})