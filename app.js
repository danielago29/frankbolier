    const express = require('express');
    const bodyParser = require('body-parser');
    const cors = require('cors');
    const app = express();
    const PORT = 8000;
    const mysql = require('mysql2');    


    // Configuración de la conexión a la base de datos MySQL
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Danielita29',
        database: 'puntos',
    });

    // Establecer la conexión a la base de datos
    connection.connect((error) => {
        if (error) {
            console.error('Error al conectar a la base de datos:', error);
        } else {
            console.log('Conexión a MySQL exitosa');
        }
    });

    // Middleware para analizar el cuerpo de las solicitudes como JSON
    app.use(bodyParser.json());
    // Agrega el middleware de cors para habilitar CORS en todas las rutas
    app.use(cors());

    // Ruta para agregar un nuevo cliente
    app.post('/api/clients', (req, res) => {
        const { cedula,nombre,apellido,email,numeroContacto,fechaNacimiento,vendedora } = req.body;

        const sql = 'INSERT INTO clientes (id_cliente, nombre, apellido,email,cel,fecha_nac,id_vendedora) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [cedula,nombre,apellido, email,numeroContacto,fechaNacimiento,vendedora];

        connection.query(sql, values, (error, results) => {
            if (error) {
                console.error('Error al agregar un cliente:', error);
                res.status(500).json({ message: 'Error al agregar un cliente' });
            } else {
                console.log('Cliente agregado con éxito');
                res.status(201).json({ id: results.insertId, cedula,nombre,apellido, email, numeroContacto,fechaNacimiento,vendedora });
            }
        });
    });
    // Ruta para obtener información del cliente por su id_cliente
    app.get('/api/clients/:idCliente', (req, res) => {
        const idCliente = req.params.idCliente;

        // Realiza una consulta a la base de datos para obtener la información del cliente
        const sql = 'SELECT id_vendedora FROM clientes WHERE id_cliente = ?';
        connection.query(sql, [idCliente], (error, results) => {
            if (error) {
                console.error('Error al buscar el id_vendedora:', error);
                res.status(500).json({ message: 'Error al buscar el id_vendedora' });
            } else {
                if (results.length > 0) {
                    const idVendedora = results[0].id_vendedora;
                    res.status(200).json({ id_vendedora: idVendedora });
                } else {
                    res.status(404).json({ message: 'Cliente no encontrado' });
                }
            }
        });
    });

    // Ruta para agregar una nueva factura
    app.post('/api/facturas', (req, res) => {
        const { n_factura,cedula,id_vendedora,monto,fechaFactura,puntos,cupon,vigencia} = req.body;

        const sql = 'INSERT INTO factura (id_factura,id_cliente,id_vendedora,monto,fecha_crea,puntos,cupon,vigencia_cupon) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [n_factura,cedula,id_vendedora,monto,fechaFactura,puntos,cupon|| null,vigencia|| null];

        connection.query(sql, values, (error, results) => {
            if (error) {
                console.error('Error al agregar una factura:', error);
                res.status(500).json({ message: 'Error al agregar una factura' });
            } else {
                console.log('Factura agregada con éxito');
                res.status(201).json({ id: results.insertId, n_factura,cedula,id_vendedora,monto,fechaFactura,puntos,cupon,vigencia });
            }
        });
    });

    // Ruta para obtener la sumatoria de puntos de todas las facturas de un cliente por su id_cliente
    app.get('/api/facturas/:idCliente', (req, res) => {
        const idCliente = req.params.idCliente;

        // Realiza una consulta a la base de datos para obtener la sumatoria de puntos de todas las facturas del cliente
        const sql = 'SELECT SUM(puntos) AS suma_puntos FROM factura WHERE id_cliente = ?';
        connection.query(sql, [idCliente], (error, results) => {
            if (error) {
                console.error('Error al buscar la sumatoria de puntos:', error);
                res.status(500).json({ message: 'Error al buscar la sumatoria de puntos' });
            } else {
                if (results.length > 0) {
                    const sumaPuntos = results[0].suma_puntos || 0; // En caso de que no haya facturas, devuelve 0
                    res.status(200).json({ suma_puntos: sumaPuntos });
                } else {
                    res.status(404).json({ message: 'Cliente no encontrado' });
                }
            }
        });
    });



    // Inicia el servidor
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
