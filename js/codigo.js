const listaPokemon = document.querySelector('#lista-pokemon'); 
let url = 'https://pokeapi.co/api/v2/pokemon/';

const botones = document.querySelectorAll('.btn-header');


for(let i=1; i<=151; i++){
    fetch(url + i)
    .then((response) => response.json())
    .then(data=> mostrarPokemon(data))

}

function mostrarPokemon(poke) {
    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipos"> ${type.type.name}</p>`).join("");
    let peso = poke.weight / 10;
    let costo = (peso * 70000).toLocaleString('es-CO');
    let altura = poke.height / 10;
    let habilidades = poke.abilities.map((hab) => `<a class="dropdown-item titulo" href="#">${hab.ability.name}</a>`).join("");

    const div = document.createElement('div');
    div.classList.add('col-12', 'col-sm-6', 'col-md-3', 'd-flex', 'justify-content-center'); // Centrado responsivo
    div.innerHTML = `
        <div class="card m-2 text-center" style="width: 15rem;">
            <img src="${poke.sprites.other["official-artwork"].front_default}" class="card-img-top mx-auto d-block" alt="${poke.name}">
            <div class="card-body">
                <h5># ${poke.id}</h5>
                <h4 class="card-title titulo">${poke.name}</h4>
                <h6 class="titulo"> ${tipos}</h6>
                <!-- <p>${peso} kg / ${altura} m <p/> -->
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        INFORMACION
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item titulo" href="">${peso} kg / ${altura} m</a></li>
                        <li>${habilidades}</li>
                    </ul>
                </div>
                <button 
                    class="btn btn-danger agregar-carrito" 
                    data-id="${poke.id}" 
                    data-nombre="${poke.name}" 
                    data-precio="${peso * 70000}" 
                    data-img="${poke.sprites.other["official-artwork"].front_default}">
                    ${costo} COP
                </button>
            </div>
        </div>
    `;
    listaPokemon.appendChild(div);

    div.querySelector(".agregar-carrito").addEventListener("click", (e) => {
        e.preventDefault();
    
        const boton = e.target;
        const id = boton.getAttribute("data-id");
        const nombre = boton.getAttribute("data-nombre");
        const precio = parseFloat(boton.getAttribute("data-precio"));
        const img = boton.getAttribute("data-img");
    
        const producto = { id, nombre, precio, img, cantidad: 1 };
    
        // Obtener carrito actual desde localStorage
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    
        // Buscar si el producto ya existe en el carrito
        const index = carrito.findIndex(item => item.id === id);
    
        if (index !== -1) {
            // Ya existe → sumar cantidad
            carrito[index].cantidad += 1;
        } else {
            // Nuevo producto → agregarlo
            carrito.push(producto);
        }
    
        localStorage.setItem("carrito", JSON.stringify(carrito));
    
        // Actualiza el contador 
        const totalCantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        document.querySelector("#cuenta-carrito").textContent = totalCantidad;
    
        alert(`${nombre} ha sido agregado al carrito.`);
    });
};


botones.forEach(boton => boton.addEventListener("click", (event)=>{
    const botonId = event.currentTarget.id;
    listaPokemon.innerHTML='';

    for(let i=1; i<=151; i++){
        fetch(url + i)
        .then((response) => response.json())
        .then(data=> {

            console.log(data.types.map(type=> type.type.name));

            if (botonId == "ver-todos"){
                mostrarPokemon(data)
            }else{
                const tipos = data.types.map(type=> type.type.name);
            if(tipos.some(tipo => tipo.includes(botonId))){
                mostrarPokemon(data);
            }
            }
        })
        
    
    }
}))

document.addEventListener("DOMContentLoaded", () => {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Migrar ítems antiguos (sin cantidad) al nuevo formato
    carrito = carrito.map(item => {
        if (!item.cantidad) {
            return { ...item, cantidad: 1 };
        }
        return item;
    });

    localStorage.setItem("carrito", JSON.stringify(carrito));

    const totalCantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    document.querySelector("#cuenta-carrito").textContent = totalCantidad;
});