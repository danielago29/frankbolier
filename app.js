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
        const { n_factura,cedula,id_vendedora,monto,fechaFactura,puntos,cupon,montoCupon,vigencia,observaciones} = req.body;

        const sql = 'INSERT INTO factura (id_factura,id_cliente,id_vendedora,monto,fecha_crea,puntos,cupon,monto_cupon,vigencia_cupon,observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [n_factura,cedula,id_vendedora,monto,fechaFactura,puntos,cupon|| null, montoCupon|| null,vigencia|| null,observaciones|| null];

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
    // Ruta para obtener la información del cupón por su número de cupón
app.get('/api/cupones/info/:cupon', (req, res) => {
    const cupon = req.params.cupon;

    // Realiza una consulta a la base de datos para obtener la información del cupón
    const sql = 'SELECT vigencia_cupon FROM factura WHERE cupon = ?';
    connection.query(sql, [cupon], (error, results) => {
        if (error) {
            console.error('Error al buscar la información del cupón:', error);
            res.status(500).json({ message: 'Error al buscar la información del cupón' });
        } else {
            if (results.length > 0) {
                const vigenciaCupon = results[0].vigencia_cupon || null; // Cambia esto al nombre real del campo en tu tabla
                res.status(200).json({ vigencia_cupon: vigenciaCupon });
            } else {
                res.status(404).json({ message: 'Cupón no encontrado' });
            }
        }
    });
});

    // Ruta para obtener el cupon a redimir de las facturas de un cliente por su cupon
app.get('/api/cupones/:cupon', (req, res) => {
    const cupon = req.params.cupon;
        
        // Realiza una consulta a la base de datos para obtener el cupon, el id_cliente, el id_vendedora y el monto_cupon de la factura
    const sql = 'SELECT cupon, id_cliente, id_vendedora, monto_cupon,id_factura FROM factura WHERE cupon = ?';
    connection.query(sql, [cupon], (error, results) => {
        if (error) {
            console.error('Error al buscar el cupon:', error);
            res.status(500).json({ message: 'Error al buscar el cupon' });
        } else {
            if (results.length > 0) {
                const cupon_generado = results[0].cupon;
                const id_cliente = results[0].id_cliente;
                const id_vendedora = results[0].id_vendedora;
                const cupon_monto = results[0].monto_cupon;
                const id_factura  = results[0].id_factura;
                // Agregado: Obtener el monto del cupón
                res.status(200).json({
                    cupon: cupon_generado,
                    id_cliente: id_cliente,
                    id_vendedora: id_vendedora,
                    monto_cupon: cupon_monto, // Devolver el monto del cupón
                    id_factura: id_factura
                });
            } else {
                res.status(404).json({ message: 'Cupon no encontrado' });
            }
        }
    });
    
 });
    // Ruta para agregar una redención de cupón
    app.post('/api/redencion-cupon', (req, res) => {
        const { n_factura,cedula,id_vendedora,monto,fechaFactura,puntos,montoCupon,cupon,observaciones } = req.body;

        const sql = 'INSERT INTO factura (id_factura, id_cliente, id_vendedora, monto, fecha_crea, puntos, monto_cupon, cupon, vigencia_cupon, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [n_factura, cedula, id_vendedora, monto, fechaFactura, puntos, montoCupon,cupon, null , observaciones || null];

        connection.query(sql, values, (error, results) => {
            if (error) {
                console.error('Error al agregar la redención de cupón:', error);
                res.status(500).json({ message: 'Error al agregar la redención de cupón' });
            } else {
                console.log('Redención de cupón agregada con éxito');
                res.status(201).json({ id: results.insertId, n_factura,cedula,id_vendedora,monto,fechaFactura,puntos,montoCupon,cupon,observaciones });
            }
        });
    });

    // Ruta para obtener la factura original asociada a un cupón
app.get('/api/obtener-factura-por-cupon/:cupon', (req, res) => {
    const cupon = req.params.cupon;

    // Realiza una consulta a la base de datos para obtener la factura original asociada al cupón
    const sql = 'SELECT id_factura FROM factura WHERE cupon = ?';
    connection.query(sql, [cupon], (error, results) => {
        if (error) {
            console.error('Error al buscar la factura original por cupón:', error);
            res.status(500).json({ message: 'Error al buscar la factura original por cupón' });
        } else {
            if (results.length > 0) {
                const idFacturaOriginal = results[0].id_factura;
                res.status(200).json({ id_factura: idFacturaOriginal });
            } else {
                res.status(404).json({ message: 'Factura original no encontrada' });
            }
        }
    });
});
    // Ruta para actualizar la vigencia de una factura
app.put('/api/actualizar-vigencia-cupon/:idFactura', (req, res) => {
    const idFactura = req.params.idFactura;
    const nuevaFechaVigencia = req.body.vigencia_cupon;

    // Realizar la consulta para actualizar la fecha de vigencia en la base de datos
    const sql = 'UPDATE factura SET vigencia_cupon = ? WHERE id_factura = ?';
    connection.query(sql, [nuevaFechaVigencia, idFactura], (error, results) => {
        if (error) {
            console.error('Error al actualizar la fecha de vigencia del cupón:', error);
            res.status(500).json({ message: 'Error al actualizar la fecha de vigencia del cupón' });
        } else {
            res.status(200).json({ message: 'Fecha de vigencia del cupón actualizada con éxito' });
        }
    });
});

    // Ruta para agregar una redención de puntos
    app.post('/api/redencion-puntos', (req, res) => {
        const { n_factura, cedula, id_vendedora, fechaFactura, puntos, observaciones } = req.body;

        const sql = 'INSERT INTO factura (id_factura, id_cliente, id_vendedora, monto, fecha_crea, puntos,monto_cupon, cupon, vigencia_cupon, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [n_factura, cedula, id_vendedora, 0, fechaFactura, puntos, 0 , 'N/A', null , observaciones || null];

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
    // Ruta para obtener información según el idCliente
app.get('/api/obtener-info/:idCliente', (req, res) => {
    const idCliente = req.params.idCliente;

    // Realiza consultas a la base de datos para obtener diferentes tipos de información
    const sqlFacturas = 'SELECT id_factura, monto, fecha_crea, puntos, observaciones FROM factura WHERE id_cliente = ? AND NOT id_factura LIKE "P-%"';
    const sqlPuntosRedimidos = 'SELECT id_factura, fecha_crea, observaciones AS detalles FROM factura WHERE id_cliente = ? AND id_factura LIKE "P-%"';
    const sqlCuponesVigentes = 'SELECT id_factura, cupon, monto_cupon, vigencia_cupon FROM factura WHERE id_cliente = ? AND cupon IS NOT NULL AND vigencia_cupon >= ?';
    const sqlCuponesRedimidos = 'SELECT id_factura, cupon, monto_cupon, fecha_crea, observaciones FROM factura WHERE id_cliente = ? AND cupon = id_factura';

    connection.query(sqlFacturas, [idCliente], (errorFacturas, resultFacturas) => {
        if (errorFacturas) {
            console.error('Error al obtener facturas:', errorFacturas);
            res.status(500).json({ message: 'Error al obtener facturas' });
        } else {
            connection.query(sqlPuntosRedimidos, [idCliente], (errorPuntos, resultPuntos) => {
                if (errorPuntos) {
                    console.error('Error al obtener puntos redimidos:', errorPuntos);
                    res.status(500).json({ message: 'Error al obtener puntos redimidos' });
                } else {
                    const today = new Date().toISOString().split('T')[0];
                    connection.query(sqlCuponesVigentes, [idCliente, today], (errorCuponesVigentes, resultCuponesVigentes) => {
                        if (errorCuponesVigentes) {
                            console.error('Error al obtener cupones vigentes:', errorCuponesVigentes);
                            res.status(500).json({ message: 'Error al obtener cupones vigentes' });
                        } else {
                            connection.query(sqlCuponesRedimidos, [idCliente], (errorCuponesRedimidos, resultCuponesRedimidos) => {
                                if (errorCuponesRedimidos) {
                                    console.error('Error al obtener cupones redimidos:', errorCuponesRedimidos);
                                    res.status(500).json({ message: 'Error al obtener cupones redimidos' });
                                } else {
                                    const responseData = {
                                        facturas: resultFacturas,
                                        puntosRedimidos: resultPuntos,
                                        cuponesVigentes: resultCuponesVigentes,
                                        cuponesRedimidos: resultCuponesRedimidos
                                    };
                                    res.status(200).json(responseData);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});



 // Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
