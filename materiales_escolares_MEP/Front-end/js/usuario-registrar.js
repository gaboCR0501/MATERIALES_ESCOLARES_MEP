const inputCorreo = document.getElementById("txtCorreo");
const inputCedula = document.getElementById("txtCedula");
const inputNombre = document.querySelector("#txtNombre");
const inputContrasenia = document.querySelector("#txtContrasenia");
const btnGuardar = document.querySelector("#btnGuardar");

const insputsRequeridos = document.querySelectorAll("input[required]");

// Validar los campos requeridos
function validar(){
    let error = false;
    for(let i = 0; i < insputsRequeridos.length; i++){
        if(insputsRequeridos[i].value == ""){
            error = true;
        }
    }
    if (error == false){
        registrarUsuario();
    }
}

// Tomar los datos los HTML y guardar el usuario en la DB
function registrarUsuario(){
    const datosUsuario = {
        correo: inputCorreo.value,
        cedula: inputCedula.value,
        nombre: inputNombre.value,
        contrasenia: inputContrasenia.value
    };

    // Enviar los datos al servidor
    fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: {
            "Content-Type": "Application/json"
        },
        body: JSON.stringify(datosUsuario)
    }).then(response => {
        if(!response.ok){
            console.error("No se puedo registrar el usuario");
        }else{
            console.log("Usuario registrado");
        }
    }).catch(error => {
        console.log(error);
    });
}

btnGuardar.addEventListener("click", validar);