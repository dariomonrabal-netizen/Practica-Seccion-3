// 1. Importamos el módulo nativo HTTP
const http = require('http');

// 2. Creamos el servidor HTTP
const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    // Tarea 2: Ruta Raíz (/) - Formulario de Entrada
    if (url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Assignment 1</title></head>');
        res.write('<body>');
        res.write('<h1>Formulario de Entrada</h1>');
        res.write('<form action="/create-user" method="POST">');
        res.write('<input type="text" name="username">');
        res.write('<button type="submit">Send</button>');
        res.write('</form>');
        res.write('</body>');
        res.write('</html>');
        return res.end(); // Finaliza la respuesta y corta la ejecución
    }

    // Tarea 3: Ruta de Listado (/users)
    if (url === '/users' && method === 'GET') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Assignment 1</title></head>');
        res.write('<body>');
        res.write('<h1>Lista de Usuarios</h1>');
        res.write('<ul>');
        res.write('<li>User 1</li>');
        res.write('<li>User 2</li>');
        res.write('</ul>');
        res.write('</body>');
        res.write('</html>');
        return res.end();
    }

    // Tarea 4: Ruta de Procesamiento (/create-user)
    if (url === '/create-user' && method === 'POST') {
        const body = [];

        // Captura de datos en tiempo de ejecución (Streams/Chunks)
        req.on('data', (chunk) => {
            body.push(chunk);
        });

        // Al finalizar la recepción de datos
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            // Extracción del valor recibido (username=VALOR)
            const rawUsername = parsedBody.split('=')[1];
            // Uso opcional de decodeURIComponent para caracteres especiales/espacios
            const username = decodeURIComponent(rawUsername);

            console.log(`Usuario recibido: ${username}`);

            // Redirección HTTP 302 hacia '/'
            res.statusCode = 302;
            res.setHeader('Location', '/');
            return res.end();
        });
    }

    // Tarea 5: Ruta no encontrada (404 Fallback)
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>404 Not Found</title></head>');
    res.write('<body><h1>Page not found</h1></body>');
    res.write('</html>');
    res.end();
});

// Escuchar en el puerto 3000
server.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});