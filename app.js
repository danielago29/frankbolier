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
    // Ruta para obtener información del cliente por su id_cliente para la pagina de puntos 
    app.get('/api/cliente-puntos/:idCliente', (req, res) => {
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
        const { n_factura,cedula,id_vendedora,monto,fechaFactura,puntos,cupon,vigencia,observaciones} = req.body;

        const sql = 'INSERT INTO factura (id_factura,id_cliente,id_vendedora,monto,fecha_crea,puntos,cupon,vigencia_cupon,observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [n_factura,cedula,id_vendedora,monto,fechaFactura,puntos,cupon|| null,vigencia|| null,observaciones|| null];

        connection.query(sql, values, (error, results) => {
            if (error) {
                console.error('Error al agregar una factura:', error);
                res.status(500).json({ message: 'Error al agregar una factura' });
            } else {
                console.log('Factura agregada con éxito');
                res.status(201).json({ id: results.insertId, n_factura,cedula,id_vendedora,monto,fechaFactura,puntos,cupon,vigencia,observaciones});
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

    // Ruta para obtener el cupon a redimir de las facturas de un cliente por su cupon
    app.get('/api/cupones/:cupon', (req, res) => {
        const cupon = req.params.cupon;

        // Realiza una consulta a la base de datos para obtener el cupon y el id_cliente de la factura
        const sql = 'SELECT cupon, id_cliente, id_vendedora FROM factura WHERE cupon = ?';
        connection.query(sql, [cupon], (error, results) => {
            if (error) {
                console.error('Error al buscar el cupon:', error);
                res.status(500).json({ message: 'Error al buscar el cupon' });
            } else {
                if (results.length > 0) {
                    const cupon_generado = results[0].cupon;
                    const id_cliente = results[0].id_cliente; // Obtén el id_cliente de la factura
                    const id_vendedora = results[0].id_vendedora;
                    res.status(200).json({ cupon: cupon_generado, id_cliente: id_cliente, id_vendedora: id_vendedora }); // Devuelve ambos datos
                } else {
                    res.status(404).json({ message: 'Cupon no encontrado' });
                }
            }
        });
    });
    // Ruta para agregar una redención de cupón
    app.post('/api/redencion-cupon', (req, res) => {
        const { n_factura, cedula, id_vendedora, fechaFactura, puntos, observaciones } = req.body;

        const sql = 'INSERT INTO factura (id_factura, id_cliente, id_vendedora, monto, fecha_crea, puntos, cupon, vigencia_cupon, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [n_factura, cedula, id_vendedora, 0, fechaFactura, puntos, 'N/A', null , observaciones || null];

        connection.query(sql, values, (error, results) => {
            if (error) {
                console.error('Error al agregar la redención de cupón:', error);
                res.status(500).json({ message: 'Error al agregar la redención de cupón' });
            } else {
                console.log('Redención de cupón agregada con éxito');
                res.status(201).json({ id: results.insertId, n_factura, cedula, id_vendedora, fechaFactura, puntos, observaciones });
            }
        });
    });
    // Ruta para agregar una redención de puntos
    app.post('/api/redencion-puntos', (req, res) => {
        const { n_factura, cedula, id_vendedora, fechaFactura, puntos, observaciones } = req.body;

        const sql = 'INSERT INTO factura (id_factura, id_cliente, id_vendedora, monto, fecha_crea, puntos, cupon, vigencia_cupon, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [n_factura, cedula, id_vendedora, 0, fechaFactura, puntos, 'N/A', null , observaciones || null];

        connection.query(sql, values, (error, results) => {
            if (error) {
                console.error('Error al agregar la redención de puntos:', error);
                res.status(500).json({ message: 'Error al agregar la redención de puntos' });
            } else {
                console.log('Redención de puntos agregada con éxito');
                res.status(201).json({ id: results.insertId, n_factura, cedula, id_vendedora, fechaFactura, puntos, observaciones });
            }
        });
    });



    // Inicia el servidor
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
