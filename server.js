// import fetch from 'node-fetch'
const port = 3001
const fetchHost = 'http://localhost:' + port + '/api/'

import express from 'express'
import { Server } from 'http'
import SocketIO from 'socket.io'
import r from 'rethinkdb'
import bodyParser from 'body-parser'

const app = express()
app.use(bodyParser.json())
app.set('port', port)

const server = Server(app)
const io = SocketIO(server)

const db = r.connect({
    host: "localhost",
    port: 28015,
    db: 'capstone'
})

db.then(conn => {
    r.table('users').changes().run(conn, (err, cursor) => {
        cursor.each((err, data) => {
            console.log("new data")
            const user = data.new_val;
            io.sockets.emit('users', user);
        });
    });

    io.on('connection', (client) => {
        r.table('users')
            .run(conn)
            .then(cursor => {
                cursor.each((err, user) => {
                    io.sockets.emit('users', user);
                });
            });

        client.on('users', (body) => {
            const {
                    name
                } = body;
            const data = {
                name, date: new Date()
            };
            r.table('users').insert(data).run(conn);
        });

    });


    app.get('/api/users', async (req, res) => {
        console.log("connected")
        // const results = await db.collection(collection).find().toArray()
        // res.json(results)
        io.on('connection', (client) => {
            r.table('users')
                .run(conn)
                .then(cursor => {
                    cursor.each((err, user) => {
                        console.log("new data")
                        io.sockets.emit('users', user);
                    });
                });
    
            // r.table('users').run(conn, (err, cursor) => {
            //     cursor.toArray().then((results) => {
            //         res.json(results)
            //     });
            // })
    
            client.on('users', (body) => {
                const {
                        name
                    } = body;
                const data = {
                    name, date: new Date()
                };
                r.table('users').insert(data).run(conn);
            });
    
        });
    })

    //     r.table('users').run(conn, (err, cursor) => {
    //         cursor.toArray().then((results) => {
    //             res.json(results)
    //         });
    //     })
    //     console.log("connected")
    //     // r.table('users').changes().run(conn, (err, cursor) => {
    //     //     cursor.each((err, data) => {
    //     //         console.log("new data")
    //     //         //const user = data.new_val;
    //     //         //io.sockets.emit('/users', user);
    //     //     });
    //     // });
    // })

    server.listen(app.get('port'), () => console.log("Listening on http://localhost:" + app.get('port')));
}).error(err => {
    console.log("Cannot connect to RethinkDB")
    throw err;
});

