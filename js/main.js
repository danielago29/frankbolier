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
}

async function agregarFactura(event) {
    event.preventDefault();

    const form = event.target;
    const cedula = form.elements.idClienteInput.value;
    const id_vendedora = form.elements.idVendedoraInput.value;
    const n_factura = form.elements.numeroFactura.value;
    const monto = form.elements.valor_factura.value;
    const cupon_form = document.getElementById('montoCupon');
    const montoCupon = cupon_form.value;
    const fechaFactura = form.elements.fechaCrea.value;
    const puntos = form.elements.puntos_calculo.value;
    const codigoCuponParrafo = document.getElementById('codigo-cupon');
    const cupon = codigoCuponParrafo.textContent;
    const vigencia_fecha = document.getElementById('fechaInput');
    const vigencia = vigencia_fecha.value;
    const observaciones = form.elements.observaciones.value;

    const nuevaFactura = {
        cedula: cedula,
        id_vendedora: id_vendedora,       
        n_factura: n_factura,
        monto: monto,
        fechaFactura: fechaFactura,
        puntos: puntos,
        cupon: cupon,
        montoCupon: montoCupon,
        vigencia: vigencia,
        observaciones: observaciones
    };

    try {
        const response = await fetch('http://localhost:8000/api/facturas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaFactura)
        });

        if (!response.ok) {
            throw new Error('Error al agregar la factura');
        }

        form.reset();
        bonoRecompraMensaje.style.display = 'none';
        cuponCliente.textContent = "";
        cuponMonto.value = "";

    } catch (error) {
        console.error('Error al agregar la factura:', error);
        // Puedes mostrar un mensaje de error al usuario aquí si lo deseas
    }
}


/* async function redimirPuntosPagina (event){
    event.preventDefault();
    const cedula = id_cliente_p.value;
    const id_vendedora_value = id_vendedora_p.value;
    const n_factura = factura_p.value;
    const fechaFactura = document.getElementById('fechaPuntos').value; // Cambiado
    const puntos = document.getElementById('puntosPuntos').value; // Cambiado
    const observaciones = document.getElementById('observacionesPuntos').value; // Cambiado


    const redencionPuntos = {
        n_factura: n_factura,
        cedula: cedula,
        id_vendedora: id_vendedora_value,
        fechaFactura: fechaFactura,
        puntos: puntos,
        observaciones: observaciones
    };
    console.log("Valores del formulario obtenidos:", cedula, id_vendedora, n_factura, fechaFactura, puntos, observaciones);

    try{
        const result = await fetch ('http://localhost:8000/api/redencion-puntos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(redencionPuntos)
        });
        if (!result.ok) {
            throw new Error('Error al agregar la redención de puntos');
        }
       
        form.reset();       
    
    }catch(error){
        console.error('Error al agregar la redención de puntos:', error);
        // Puedes mostrar un mensaje de error al usuario aquí si lo deseas
    }
}  
 */
// En tu archivo main.js

/* $(document).ready(function() {
    console.log("Documento listo. Registrando evento...");
    // Delegación de eventos para el botón dentro del modal
    $(document).on('click', '#cuponForm', function() {
        console.log("Botón 'Redimir cupon' clickeado");
        
        const formModal = document.getElementById('nuevo-factur-show'); // Cambiar por el ID real del formulario dentro del modal
        
        // Obtener los valores del formulario dentro del modal
        const cedula = formModal.elements.idClienteShow.value;
        const id_vendedora = formModal.elements.idVendedoraShow.value;
        const n_factura = formModal.elements.facturaShow.value;
        const monto = formModal.elements.valorShow.value;
        const fechaFactura = formModal.elements.fechaShow.value;
        const puntos = formModal.elements.puntosShow.value;
        const cupon = "N/A";
        const vigencia = "0000-00-00"; // Cambiar el formato de la fecha
        const observaciones = formModal.elements.observacionesShow.value;
        
        console.log("Valores obtenidos del formulario:");
        console.log("Cédula:", cedula);
        console.log("Id Vendedora:", id_vendedora);
        console.log("N° Factura:", n_factura);
        console.log("Monto:", monto);
        console.log("Fecha Factura:", fechaFactura);
        console.log("Puntos:", puntos);
        console.log("Cupon:", cupon);
        console.log("Vigencia:", vigencia);
        console.log("Observaciones:", observaciones);
        
        const cuponRedimido = {
            cedula: cedula,
            id_vendedora: id_vendedora,       
            n_factura: n_factura,
            monto: monto,
            fechaFactura: fechaFactura,
            puntos: puntos,
            cupon: cupon,
            vigencia: vigencia,
            observaciones: observaciones
        };
        
        // Realizar la solicitud de envío a la base de datos
        fetch('http://localhost:8000/api/facturas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cuponRedimido)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al agregar la factura');
            }
            return response.json();
        })
        .then(data => {
            console.log('Factura agregada con éxito:', data);
            // Puedes mostrar un mensaje de éxito al usuario aquí si lo deseas
            $('#putCliente').modal('hide');
        })
        .catch(error => {
            console.error('Error al agregar la factura:', error);
            // Puedes mostrar un mensaje de error al usuario aquí si lo deseas
        });
    });
});

 */
/* async function redimirPuntos(event) {
    event.preventDefault();

    const form = event.target;
    const cedula = form.elements.idClienteShow.value;
    const id_vendedora = form.elements.idVendedoraShow.value;
    const n_factura = form.elements.facturaShow.value;
    const monto = form.elements.valorShow.value;
    const fechaFactura = form.elements.fechaShow.value;
    const puntos = form.elements.puntosShow.value;
    const cupon = "N/A";
    const vigencia = "00/00/0000";
    const observaciones = form.elements.observacionesShow.value;

    const cuponRedimido = {
        cedula: cedula,
        id_vendedora: id_vendedora,       
        n_factura: n_factura,
        monto: monto,
        fechaFactura: fechaFactura,
        puntos: puntos,
        cupon: cupon,
        vigencia: vigencia,
        observaciones: observaciones
    };
    console.log("Datos a enviar:", cuponRedimido);

    try {
        const response = await fetch('http://localhost:8000/api/facturas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cuponRedimido)
        });

        if (!response.ok) {
            throw new Error('Error al redimir puntos');
        }

        form.reset();    
    } catch (error) {
        console.error('Error al redimir puntos:', error);
        // Puedes mostrar un mensaje de error al usuario aquí si lo deseas
    }
}
 */// Obtén referencias a los elementos de input
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
const cuponMonto = document.getElementById('montoCupon');

// Evento que se activa cuando cambia el valor del input de monto
montoInput.addEventListener('input', function() {
    const monto = parseFloat(montoInput.value);

    if (!isNaN(monto)) {
        if (monto >= 200000 && monto < 400000) {
            bonoRecompraMensaje.textContent = 'El cliente tiene un bono - re compra de $50.000';
            bonoRecompraMensaje.style.display = 'block'; // Muestra el mensaje
            cuponMonto.value = 50000
            cuponGenerado = generarCodigoCupon(8);
            llenarFecha();
            cuponCliente.textContent = cuponGenerado;
        } else if (monto >= 400000) {
            bonoRecompraMensaje.textContent = 'El cliente tiene un bono - re compra de $100.000';
            bonoRecompraMensaje.style.display = 'block'; // Muestra el mensaje
            cuponMonto.value = 100000
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
const id_cliente_p = document.getElementById('idClientePuntos');
const id_vendedora_p = document.getElementById('idVendedoraPuntos');
const factura_p = document.getElementById('facturaPuntos');

/*id_cliente_puntos.addEventListener('input', async function(){
    console.log("Evento input en idClientePuntos disparado"); 
    const id_cliente_p = id_cliente_puntos.value;
    console.log("ID Cliente ingresado:", id_cliente_p); 

    console.log("ID Cliente:", id_cliente_p); // Punto de control
    
    // Realiza una llamada AJAX para buscar el id_cliente en la base de datos
    fetch(`http://localhost:8000/api/cliente-puntos/${id_cliente_p}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log("Valor del ID Vendedora:", data.id_vendedora);

        if (data && data.id_vendedora) {
            id_vendedora_puntos.value = data.id_vendedora;
            const factura_generada = generarFacturaPuntos(8);
            factura_puntos.value = factura_generada;

        } else {
            id_vendedora_puntos.value = '';
            factura_puntos.value = '';
        }
    })
    .catch(error => {
        console.error('Error al buscar el id_vendedora:', error);
        id_vendedora_puntos.value = '';
        factura_puntos.value = '';
    });
});

function generarFacturaPuntos(longitud) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigoPuntos = 'P-';

    for (let i = 0; i < longitud; i++) {
        const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
        codigoPuntos += caracteres.charAt(indiceAleatorio);
    }

    return codigoPuntos;
}

 */
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



const formNuevoCliente = document.getElementById('nuevo-cliente-form');
const formNuevaFactura = document.getElementById('nuevo-factura-form');
const formCuponRedimido = document.getElementById('nuevo-factur-show');

formNuevoCliente.addEventListener('submit', agregarCliente); 
formNuevaFactura.addEventListener('submit', agregarFactura); 

