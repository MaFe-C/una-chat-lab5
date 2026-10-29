
const express = require('express');
const path = require('node:path');
const validation = require('./libs/unalib');
const { createAuth } = require('./auth');

const envPath = path.join(__dirname, '.env');
if (process.loadEnvFile && require('node:fs').existsSync(envPath)) process.loadEnvFile(envPath);

function createApp(options = {}) {
  const auth = options.auth || createAuth();
  const app = express();
  const http = require('node:http').createServer(app);
  const io = require('socket.io')(http);
  app.disable('x-powered-by');

  app.get('/', (req, res) => auth.getUser(req) ? res.redirect('/chat') : res.sendFile(path.join(__dirname, 'login.html')));
  app.get('/login', (req, res) => auth.login(req, res));
  app.get('/callback', (req, res) => Promise.resolve(auth.callback(req, res)).catch(error => {
    console.error('Error de autenticación:', error.message);
    res.redirect('/?auth_error=failed');
  }));
  app.get('/logout', (req, res) => auth.logout(req, res));
  app.get('/chat', (req, res) => auth.getUser(req)
    ? res.sendFile(path.join(__dirname, 'index.html')) : res.redirect('/?login_required=1'));
  app.get('/api/me', (req, res) => {
    const user = auth.getUser(req);
    if (!user) return res.status(401).json({ error: 'Debes iniciar sesión.' });
    res.json(user);
  });

  io.use((socket, next) => {
    const user = auth.getUser(socket.request);
    if (!user) return next(new Error('Debes iniciar sesión para usar el chat.'));
    socket.data.user = user;
    next();
  });
  io.on('connection', socket => {
    socket.on('Evento-Mensaje-Server', raw => {
      let input;
      try { input = JSON.parse(raw); } catch { input = { mensaje: raw }; }
      if (!input || typeof input !== 'object') input = { mensaje: '' };
      const user = socket.data.user;
      const message = validation.validateMessage(JSON.stringify({
        nombre: user.name || user.email || 'Usuario', mensaje: input.mensaje, color: input.color
      }));
      io.emit('Evento-Mensaje-Server', message);
    });
  });
  return { app, http, io };
}

module.exports = createApp;

if (require.main === module) {
  const port = process.env.PORT || 3000;
  createApp().http.listen(port, () => console.log(`UNA Chat en el puerto ${port}`));
}
