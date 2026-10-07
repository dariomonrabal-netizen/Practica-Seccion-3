// Importa el módulo de Node.js que permite crear un servidor HTTP.
const http = require('http');
// Importa el módulo File System para leer y guardar datos en archivos.
const fs = require('fs');

// Crea el servidor y define la función que manejará cada solicitud.
const server = http.createServer((req, res) => {
    // Obtiene la ruta solicitada, por ejemplo '/' o '/users'.
    const url = req.url;
    // Obtiene el método HTTP, como 'GET' o 'POST'.
    const method = req.method;

    // Si la ruta es la página principal, muestra el formulario.
    if (url === '/') {
        // Indica que la respuesta será una página HTML.
        res.setHeader('Content-Type', 'text/html');
        // Escribe el inicio de la página HTML y el título.
        res.write('<html><head><title>Assignment 1 - Reto</title></head><body>');
        // Escribe el encabezado del formulario.
        res.write('<h1>Formulario de Entrada (Con Guardado)</h1>');
        // Inicia el formulario y lo envía a la ruta '/create-user' mediante POST.
        res.write('<form action="/create-user" method="POST">');
        // Crea un campo de texto cuyo nombre es 'username'.
        res.write('<input type="text" name="username">');
        // Añade el botón para enviar el formulario.
        res.write('<button type="submit">Send</button>');
        // Cierra el formulario.
        res.write('</form>');
        // Cierra las etiquetas HTML de la respuesta.
        res.write('</body></html>');
        // Envía la respuesta al navegador y termina la solicitud.
        return res.end();
    }

    // Si la ruta es '/users' y la solicitud usa el método GET, muestra la lista de usuarios.
    if (url === '/users' && method === 'GET') {
        // Lee el archivo 'users.txt' de forma asíncrona.
        fs.readFile('users.txt', 'utf8', (err, data) => {
            // Indica que la respuesta será una página HTML.
            res.setHeader('Content-Type', 'text/html');
            // Escribe el inicio de la página HTML y el título.
            res.write('<html><head><title>Assignment 1 - Reto</title></head><body>');
            // Escribe el encabezado de la lista.
            res.write('<h1>Lista Dinámica de Usuarios</h1>');
            // Abre la lista desordenada donde aparecerán los usuarios.
            res.write('<ul>');

            // Si ocurre un error o el archivo está vacío, muestra un mensaje informativo.
            if (err || !data.trim()) {
                res.write('<li>No hay usuarios registrados aún.</li>');
            } else {
                // Elimina espacios y saltos de línea innecesarios y separa los usuarios.
                const users = data.trim().split('\n');
                // Recorre cada usuario y los añade como elementos de la lista.
                users.forEach(user => {
                    res.write(`<li>${user}</li>`);
                });
            }

            // Cierra la lista y añade un enlace para volver al formulario.
            res.write('</ul>');
            res.write('<a href="/">Volver al formulario</a>');
            // Cierra el contenido HTML de la respuesta.
            res.write('</body></html>');
            // Envía la respuesta y termina la solicitud.
            return res.end();
        });
        // Detiene la ejecución del resto de comprobaciones para esta solicitud.
        return;
    }

    // Si la ruta es '/create-user' y la petición usa POST, guarda el usuario.
    if (url === '/create-user' && method === 'POST') {
        // Crea un arreglo para guardar los datos recibidos en el cuerpo de la solicitud.
        const body = [];

        // Escucha cada fragmento de datos recibido y lo guarda en el arreglo.
        req.on('data', chunk => {
            body.push(chunk);
        });

        // Cuando termina de recibir todos los datos, procesa el formulario.
        return req.on('end', () => {
            // Convierte todos los fragmentos en un texto de tipo string.
            const parsedBody = Buffer.concat(body).toString();
            // Extrae el valor que aparece después del símbolo '=' del formulario.
            const rawUsername = parsedBody.split('=')[1];
            // Decodifica caracteres especiales, como espacios o símbolos, del nombre.
            const username = decodeURIComponent(rawUsername);

            // Añade el usuario al final del archivo sin borrar los anteriores.
            fs.appendFile('users.txt', username + '\n', err => {
                // Si ocurre un error al guardar, lo muestra en la consola.
                if (err) {
                    console.error('Error al guardar el usuario', err);
                }
                // Establece el código HTTP 302 para indicar una redirección.
                res.statusCode = 302;
                // Indica la ruta a la que debe dirigirse el navegador.
                res.setHeader('Location', '/');
                // Finaliza la respuesta después de enviar la redirección.
                return res.end();
            });
        });
    }

    // Si ninguna ruta coincide, devuelve una respuesta de página no encontrada.
    res.statusCode = 404;
    // Indica que la respuesta será una página HTML.
    res.setHeader('Content-Type', 'text/html');
    // Escribe el mensaje de error en el documento HTML.
    res.write('<html><body><h1>Página no encontrada</h1></body></html>');
    // Envía la respuesta y termina la conexión.
    res.end();
});

// Inicia el servidor y escucha conexiones en el puerto 3000.
server.listen(3000, () => {
    // Muestra un mensaje en la consola indicando dónde está disponible el servidor.
    console.log('Servidor con Reto escuchando en http://localhost:3000');
});