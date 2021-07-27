const socket = io.connect();

function render(data) {
    console.log(JSON.stringify(data))
    let html = data.map(function (elem, index) {
        console.log('AUTOR!!!' + elem.autor)
        return (`
        <div>
            <b style="color:blue;">${elem.autor.email}</b> 
            [<span style="color:brown;">${elem.fyh}</span>] : 
            <i style="color:green;">${elem.texto}</i>
        </div>
    `)
    }).join(' ');
    document.getElementById('messages').innerHTML = html;
}

socket.on('messages', async function (data) {

    const autorSchema = new schema.Entity('autor', {}, { idAttribute: 'nombre' });

    const mensajeSchema = new schema.Entity('texto', {
        autor: autorSchema
    }, { idAttribute: '_id' })

    const mensajesSchema = new schema.Entity('mensajes', {
        mensajes: [mensajeSchema]
    }, { idAttribute: 'id' })

    const desnormalizado = denormalize(data.result, mensajesSchema, data.entities);
    console.log(desnormalizado)
    render(desnormalizado);
});

function addMessage(e) {
    let mensaje = {
        autor: {
            email: document.getElementById('email').value,
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            edad: document.getElementById('edad').value,
            alias: document.getElementById('alias').value,
            avatar: document.getElementById('avatar').value,
        },
        fyh: new Date().toLocaleString(),
        texto: document.getElementById('texto').value
    }

    socket.emit('new-message', mensaje);
    return false;
}

