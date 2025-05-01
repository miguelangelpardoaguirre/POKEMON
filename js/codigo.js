//selecionamos el id lista-pokemon del html
const listaPokemon = document.querySelector('#lista-pokemon'); 
let url = 'https://pokeapi.co/api/v2/pokemon/';

const botones = document.querySelectorAll('.btn-header');

//recorremos la informacion de la api 151 veces, por medio del fetch .then guardamos en mostrarPokemon
for(let i=1; i<=151; i++){
    fetch(url + i)
    .then((response) => response.json())
    .then(data=> mostrarPokemon(data))

}
//agregamos una funcion a mostrarPokemon, definomos variables y les damos un valor traido de la api anexando a contenido html creado
function mostrarPokemon(poke) {
    //utilizamos .join("")para separar el contenido del array
    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipos"> ${type.type.name}</p>`).join(" ");
    let peso = poke.weight / 10;
    
    //utilizamos .toLocaleString('es-CO') para que el precio sea en pesos colombianos
    let costo = (peso * 70000).toLocaleString('es-CO');
    let altura = poke.height / 10;
    let habilidades = poke.abilities.map((hab) => `<a class="dropdown-item titulo" href="#">${hab.ability.name}</a>`).join("");
    const div = document.createElement('div');
    //asiganamos clases al div que contendra las cartas 
    div.classList.add('col-12', 'col-sm-6', 'col-md-3', 'd-flex', 'justify-content-center'); 
    div.innerHTML = `
        <div class="card m-2 text-center" style="width: 15rem;">
            <img src="${poke.sprites.other["official-artwork"].front_default}" class="card-img-top mx-auto d-block" alt="${poke.name}">
            <div class="card-body">
                <h5 class="titulo"># ${poke.id}</h5>
                <h4 class="card-title titulo">${poke.name}</h4>
                <h6 class="titulo"> ${tipos}</h6>

                <!--agregamos boton despleglable de bootstrap para detalles del pokemon-->

                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        DETALLES
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item titulo" href="">${peso} kg / ${altura} m</a></li>
                        <li>${habilidades}</li>
                    </ul>
                </div>

                <!--utilizamos data-id para que js sepa que que informacion debe obtener al hacer click en el boton -->

                <button 
                    class="btn btn-danger agregar-carrito" 
                    data-id="${poke.id}">
                    ${costo} COP
                </button>
            </div>
        </div>
    `;

    //volvemos listaPokemon padre del div que crea las cartas
    listaPokemon.appendChild(div);

    //le damos funcion al boton agregar-carrito con el click y utilizamos el evento (e) para llamar la informacion obtenida por data-id y se guarda en el carrito la info relacionada
    div.querySelector(".agregar-carrito").addEventListener("click", (e) => {
    
        const boton = e.target;
        const id = boton.getAttribute("data-id");
        const nombre = poke.name;
        const precio = parseFloat(peso*70000);
        const img = poke.sprites.other["official-artwork"].front_default;
        //guardamos varios valores en una contanta para luego llamarlos 
        const producto = {id, nombre, precio, img, cantidad: 1 };
    
        // utilizamos || (OR logico) cumpliendo la misma fucnion que el operador ternacio validadndo y parseando el contenido de la variable o dejando un array vacio
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    
        // utilizamos finIndex para valiar si ya hay un pokemon con el mismo id en el carrito y lo sumamos con el contador si ya exixte, sino se pushea
        const buscar = carrito.findIndex(item => item.id == id);
    
        if (buscar !== -1) {
            carrito[buscar].cantidad += 1;
        } else {
            carrito.push(producto);
        }
        
        //guardamos en el localstorage "carrito"
        localStorage.setItem("carrito", JSON.stringify(carrito));
    
        //envia una alerta indicando que se agrego al carrito
        alert(`${nombre} ha sido agregado al carrito.`);
    });
};

//filtrar por tipo con los botones
botones.forEach(boton => boton.addEventListener("click", (event)=>{
    const botonId = event.currentTarget.id;
    listaPokemon.innerHTML='';

    for(let i=1; i<=151; i++){
        fetch(url + i)
        .then((response) => response.json())
        .then(data=> {

            if (botonId == "ver-todos"){
                mostrarPokemon(data)
            }else{
                const tipos = data.types.map(type=> type.type.name);
            if(tipos.includes(botonId)){
                mostrarPokemon(data);
            }
            }
        })
    }
}))

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
