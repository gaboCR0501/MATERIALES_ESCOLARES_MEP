const tablaUsuarios = document.getElementById("tblUsuarios").querySelector("tbody"); 

async function cargarTabla() {
    fetch("http://localhost:3000/usuarios", {
        method: "GET",
        headers: {
            "Content-Type": "Application/json"
        }
    }).then(response => response.json())
    .then(listaUsuarios => {
        tablaUsuarios.innerHTML = ""; //Limpiar la tabla
        listaUsuarios.forEach(usuario => {
            const fila = document.createElement("tr");

            let informacionCertificaciones = "";
            usuario.certificaciones.forEach(certificacion => {
                informacionCertificaciones += certificacion.nombre + " - " + certificacion.institucion + "<br>";
            });

            // Comilla francesa `` permite utilizar variables o expresiones en un string 
            fila.innerHTML = `
                <td> ${usuario.correo} </td>
                <td> ${usuario.cedula} </td>
                <td> ${usuario.nombre} </td>
                <td> ${informacionCertificaciones} </td>
            `; 
            tablaUsuarios.appendChild(fila);
        })
    })
}

cargarTabla();