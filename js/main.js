async function obtenerClientes() {
    const response = await fetch('http://localhost:8000/api/clients');
    const data = await response.json();

    const listaClientes = document.getElementById('clientes-lista');
    listaClientes.innerHTML = '';

    data.forEach(cliente => {
        const li = document.createElement('li');
        li.textContent = `${cliente.name} - ${cliente.email} - Puntos: ${cliente.points}`;
        listaClientes.appendChild(li);
    });
}

async function agregarCliente(event) {
    event.preventDefault();

    const form = event.target;
    const cedula = form.elements[0].value;
    const nombre = form.elements[1].value;
    const apellido = form.elements[2].value;
    const email = form.elements[3].value;
    const numeroContacto = form.elements[4].value;
    const fechaNacimiento = form.elements[5].value;
    const vendedora = form.elements[6].value;

    const nuevoCliente = {
        cedula: cedula,
        nombre: nombre,
        apellido: apellido,
        email: email,
        numeroContacto: numeroContacto,
        fechaNacimiento: fechaNacimiento,
        vendedora: vendedora
    };

    await fetch('http://localhost:8000/api/clients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoCliente)
    });

    form.reset();
    obtenerClientes(); // Actualizar la lista de clientes después de agregar uno nuevo
}

async function agregarFactura(event) {
    event.preventDefault();

    const form = event.target;
    const cedula = form.elements[0].value;
    const id_vendedora = form.elements[1].value;
    const n_factura = form.elements[2].value;
    const monto = form.elements[3].value;
    const fechaFactura = form.elements[4].value;
    const puntos = form.elements[5].value;
    const codigoCuponParrafo = document.getElementById('codigo-cupon');
    const cupon = codigoCuponParrafo.textContent;
    const vigencia_fecha = document.getElementById('fechaInput');
    const vigencia = vigencia_fecha.value;

    

    const nuevaFactura = {
        cedula: cedula,
        id_vendedora: id_vendedora,       
        n_factura: n_factura,
        monto: monto,
        fechaFactura:fechaFactura,
        puntos: puntos,
        cupon:cupon,
        vigencia: vigencia
      
    };

    await fetch('http://localhost:8000/api/facturas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevaFactura)
    });

    form.reset();
    bonoRecompraMensaje.style.display = 'none';
    cuponCliente.textContent="";
     
}
// Obtén referencias a los elementos de input
const idClienteInput = document.getElementById('idClienteInput');
const idVendedoraInput = document.getElementById('idVendedoraInput');
const puntosClienteInput = document.getElementById('puntosClienteInput');
// Agrega un evento de escucha al input de ID Cliente
idClienteInput.addEventListener('input', function() {
    const idCliente = idClienteInput.value;

    // Realiza una llamada AJAX para buscar el id_vendedora en la base de datos
    fetch(`http://localhost:8000/api/clients/${idCliente}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.id_vendedora) {
                idVendedoraInput.value = data.id_vendedora;
            } else {
                idVendedoraInput.value = '';
            }
        })
        .catch(error => {
            console.error('Error al buscar el id_vendedora:', error);
            idVendedoraInput.value = '';
        });

});

idClienteInput.addEventListener('input', async function() {
    const idCliente = idClienteInput.value;

    if (idCliente) {
        try {
            const response = await fetch(`http://localhost:8000/api/facturas/${idCliente}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            if (data && data.suma_puntos !== undefined) {
                puntosClienteInput.value = data.suma_puntos;
            } else {
                puntosClienteInput.value = 'No se encontraron puntos';
            }
        } catch (error) {
            console.error('Error al obtener la sumatoria de puntos:', error);
            puntosClienteInput.value = 'Error al obtener puntos';
        }
    } else {
        puntosClienteInput.value = 'Ingrese un ID de cliente';
    }
});

// Obtén referencias a los elementos de input y párrafos
const montoInput = document.getElementById('valor_factura');
const bonoRecompraMensaje = document.getElementById('bonoRecompra');
const cuponCliente = document.getElementById('codigo-cupon');

// Evento que se activa cuando cambia el valor del input de monto
montoInput.addEventListener('input', function() {
    const monto = parseFloat(montoInput.value);

    if (!isNaN(monto)) {
        if (monto >= 200000 && monto < 400000) {
            bonoRecompraMensaje.textContent = 'El cliente tiene un bono - re compra de $50.000';
            bonoRecompraMensaje.style.display = 'block'; // Muestra el mensaje
            cuponGenerado = generarCodigoCupon(8);
            llenarFecha();
            cuponCliente.textContent = cuponGenerado;
        } else if (monto >= 400000) {
            bonoRecompraMensaje.textContent = 'El cliente tiene un bono - re compra de $100.000';
            bonoRecompraMensaje.style.display = 'block'; // Muestra el mensaje
            cuponGenerado = generarCodigoCupon(8);
            llenarFecha();
            cuponCliente.textContent = cuponGenerado;
        } else {
            bonoRecompraMensaje.style.display = 'none'; // Oculta el mensaje en otros casos
            cuponCliente.textContent="";
        }
    } else {
        bonoRecompraMensaje.style.display = 'none'; // Oculta el mensaje si el valor no es un número
        cuponCliente.textContent ="";
    }
});


const idClienteExiste = document.getElementById('cliente_existe');
const clienteExisteMensaje = document.getElementById('mensaje_cliente');

// Evento que se activa cuando cambia el valor del input
idClienteExiste.addEventListener('input', async function() {
    const idCliente = idClienteExiste.value;

    if (idCliente) {
        try {
            // Realiza una llamada AJAX para buscar el cliente en la base de datos
            const response = await fetch(`http://localhost:8000/api/clients/${idCliente}`);
            if (response.ok) {
                clienteExisteMensaje.style.display = 'block'; // Muestra el mensaje si el cliente existe
            } else {
                clienteExisteMensaje.style.display = 'none';  // Oculta el mensaje si el cliente no existe
            }
        } catch (error) {
            console.error('Error al buscar el cliente:', error);
            clienteExisteMensaje.style.display = 'none';  // Oculta el mensaje en caso de error
        }
    } else {
        clienteExisteMensaje.style.display = 'none'; // Oculta el mensaje si no hay valor en el input
    }
});

function generarCodigoCupon(longitud) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigoCupon = '';

    for (let i = 0; i < longitud; i++) {
        const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
        codigoCupon += caracteres.charAt(indiceAleatorio);
    }

    return codigoCupon;
}

function llenarFecha() {
    var fechaActual = new Date();
    var fechaMas30Dias = new Date(fechaActual);
    fechaMas30Dias.setDate(fechaActual.getDate() + 30);
  
    var dia = fechaMas30Dias.getDate();
    var mes = fechaMas30Dias.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    var año = fechaMas30Dias.getFullYear();
  
    // Formatear el día y mes para que tengan dos dígitos
    if (dia < 10) {
      dia = '0' + dia;
    }
    if (mes < 10) {
      mes = '0' + mes;
    }
  
    var fechaFormateada = año + '-' + mes + '-' + dia;
    document.getElementById('fechaInput').value = fechaFormateada;
  }
  


window.addEventListener('load', obtenerClientes);

const formNuevoCliente = document.getElementById('nuevo-cliente-form');
const formNuevaFactura = document.getElementById('nuevo-factura-form');
formNuevoCliente.addEventListener('submit', agregarCliente); 
formNuevaFactura.addEventListener('submit', agregarFactura);   