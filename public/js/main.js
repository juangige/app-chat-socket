console.log("Conectando...")

const socket = io();

let user;
const chatBox = document.getElementById("chatBox");

Swal.fire({
    title: "Bienvenido",
    text: "Escribe tu nombre de usuario",
    input: "text",
    inputValidator: (value) => {
         !value && ("Debes escribir un nombre de usuario");

        return value.trim() === "" && "El nombre de usuario no puede estar vacío";
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    stopKeydownPropagation: false
  }).then((result) => {
    user = result.value;
    console.log("Usuario:", user);
  })

  chatBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        socket.emit("message", {
            user,
            message: chatBox.value,
            date: new Date().getTime()
        })
        console.log("Enviando:", chatBox.value);
        chatBox.value = "";
    }
  })

  socket.on("connected", (data) => {
    if(user !== data) {
        Swal.fire({
            text: `${data} se ha unido al chat`,
            toast: true,
            position: "top-right"
        });
    }
});

// manejo de los mensajes
socket.on("messages", (data) => {
    console.log("Recibiendo:", data);
    const messagesContainer = document.getElementById("messages");
    let content = ""; // Declarar y inicializar la variable content

    data.forEach((message) => {
        content += `<b>${message.user}</b>: ${message.message} <br/>`;
    });
    
    messagesContainer.innerHTML = content;
});