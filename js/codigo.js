const listaPokemon = document.querySelector('#lista-pokemon'); 
let url = 'https://pokeapi.co/api/v2/pokemon/';

const botones = document.querySelectorAll('.btn-header');


for(let i=1; i<=151; i++){
    fetch(url + i)
    .then((response) => response.json())
    .then(data=> mostrarPokemon(data))

}

function mostrarPokemon(poke){

    let tipos = poke.types.map((type)=> `<p class="${type.type.name} tipos"> ${type.type.name}</p>`);

    const div = document.createElement('div');
    div.classList.add('col');
    div.innerHTML = `
        <div class="col-12 col-sm-6 col-md-3">
            <div class="card  m-2  text-center" style="width: 14rem;">
                <img src="${poke.sprites.other["official-artwork"].front_default}" class="card-img-top mx-auto d-block" alt="${poke.name}">
                <div class="card-body ">
                    <h5># ${poke.id}</h5>
                    <h4 class="card-title titulo"> ${poke.name}</h4>
                    <h6 class="titulo">${tipos}</h6>
                    <a href="#" class="btn btn-danger">enviar a pokeball</a>
                </div>
            </div>
        </div>
    `;
    listaPokemon.appendChild(div)
}

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
