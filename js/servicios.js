document.addEventListener("DOMContentLoaded", () => {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const tabla = document.getElementById("tabla-carrito");
    const totalG = document.getElementById("total-general");
    let total = 0;

    // Mostrar pokemon
    carrito.forEach((item, index) => {
        const fila = document.createElement("tr");
        const totalItem = item.precio * item.cantidad;
        total += totalItem;

        fila.innerHTML = `
            <td><img src="${item.img}" alt="${item.nombre}" width="50"></td>
            <td>${item.nombre}</td>
            <td>${item.cantidad}</td>
            <td>${item.precio.toLocaleString('es-CO')} COP</td>
            <td>${totalItem.toLocaleString('es-CO')} COP</td>
            <td><button class="btn btn-sm btn-danger eliminar-item" data-index="${index}">Eliminar</button></td>
        `;
        tabla.appendChild(fila);
    });

    totalG.textContent = total.toLocaleString('es-CO');

    // eliminar
    tabla.addEventListener("click", (e) => {
        if (e.target.classList.contains("eliminar-item")) {
            const index = parseInt(e.target.getAttribute("data-index"));
            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
            carrito.splice(index, 1);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            location.reload(); // Refrescar para actualizar
        }
    });

    // vaciar carrito
    document.getElementById("vaciar-carrito").addEventListener("click", () => {
        localStorage.removeItem("carrito");
        location.reload();
    });
});