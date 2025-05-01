
document.addEventListener("DOMContentLoaded", () => {
    //OR logico misma funcion del operador ternario
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    //selecionamos Elementos por su id
    const tabla = document.getElementById("tabla-carrito");
    const totalG = document.getElementById("total-general");
    let total = 0;

    // Mostrar pokemon
    carrito.forEach((item, pok) => {
        //creamos el tr donde se insertara la tabla enlasada al html
        const fila = document.createElement("tr");
        //calculamos el valor del pokemon
        const totalItem = item.precio * item.cantidad;
        //contador del total
        total += totalItem;
        //crea el contenido de la tabla con la informacion que contine item de carrito
        fila.innerHTML = `
            <td><img src="${item.img}" alt="${item.nombre}" width="50"></td>
            <td>${item.nombre}</td>
            <td>${item.cantidad}</td>
            <td>${item.precio.toLocaleString('es-CO')} COP</td>
            <td>${totalItem.toLocaleString('es-CO')} COP</td>
            <td><button class="btn btn-sm btn-danger eliminar-item w-100" data-pok="${pok}">Eliminar</button></td>
        `;
        //volvemos la fila que tiene el contenido de la tabla hijo de "tabla"
        tabla.appendChild(fila);
    });

    totalG.textContent = total.toLocaleString('es-CO');

    // eliminar
    tabla.addEventListener("click", (e) => {
        //utilizamos e.target para selecionar un elemento especifico y con classlist.contains selecionamos el elemto con la clase eliminar-item 
        if (e.target.classList.contains("eliminar-item")) {
            //getattribute obiene el valor del atributo data-pok
            const pok = parseInt(e.target.getAttribute("data-pok"));
            //OR logico misma funcion del operador ternario
            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
            //splice para eliminar elelmentos en el indice pok y la cantidad
            carrito.splice(pok, 1);

            localStorage.setItem("carrito", JSON.stringify(carrito));
            //recarga la pagina para mostrar los cambios con el producto eliminado
            location.reload(); 
        }
    });

    // cuando se le de click al elemnto con el id vaciar carrito se ejecuta el .removeItem en "carito"
    document.getElementById("vaciar-carrito").addEventListener("click", () => {
        localStorage.removeItem("carrito");
        //se actualiza la pagina, mostrando el carito actualizado
        location.reload();
    });
});