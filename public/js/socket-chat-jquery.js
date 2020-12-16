var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre');
var sala = params.get('sala');

// Referencias jQuery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatBox = $('#divChatbox');

// Funciones para renderizar usuarios
function renderizarUsuarios(personas) { //[{},{},{}]

    var html = '';

    html += '<li>';
    html += '<a href = "javascript:void(0)"class = "active"> Chat de <span>' + params.get('sala') + '</span></a>';
    html += '</li>';

    for (var i = 0; i < personas.length; i++) {
        html += '<li>';
        html += '<a data-variable="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }


    divUsuarios.html(html);

}

function renderizarMensaje(mensaje, yo) {
    var html2 = '';

    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    var adminClass = 'info';
    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }


    if (yo) {
        html2 += '<li class="reverse">';
        html2 += '    <div class="chat-content">';
        html2 += '    <h5>' + mensaje.nombre + '</h5>';
        html2 += '    <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html2 += '    </div>';
        html2 += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html2 += '    <div class="chat-time">' + hora + '</div>';
        html2 += '</li>';
    } else {
        html2 += '<li class="animated fadeIn">';
        if (mensaje.nombre !== 'Administrador') {
            html2 += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html2 += '    <div class="chat-content">';
        html2 += '    <h5>' + mensaje.nombre + '</h5>';
        html2 += '    <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html2 += '    </div>';
        html2 += '    <div class="chat-time">' + hora + '</div>';
        html2 += '</li>';
    }



    divChatBox.append(html2);
}

function scrollBottom() {

    // selectors
    var newMessage = divChatBox.children('li:last-child');

    // heights
    var clientHeight = divChatBox.prop('clientHeight');
    var scrollTop = divChatBox.prop('scrollTop');
    var scrollHeight = divChatBox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatBox.scrollTop(scrollHeight);
    }
}


// Listeners jQuery
divUsuarios.on('click', 'a', function() {
    var id = $(this).data('variable'); //Es referencia a data-variable definido en la linea donde agregamos el elemento del usuario al html, el 'variable' despues de 'data-' bien podría ser cualquier cosa que nosotros decidamos

    if (id) {
        console.log(id);
    }
});

formEnviar.on('submit', function(e) {
    e.preventDefault();

    if (txtMensaje.val().trim().length === 0) {
        return;
    }

    // Enviar información
    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        txtMensaje.val('').focus();
        renderizarMensaje(mensaje, true);
        scrollBottom();
    });
});