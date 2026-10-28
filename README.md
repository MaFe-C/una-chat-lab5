# UNA Chat - Laboratorio 5 (Seguridad Informática)

Chat Socket.IO con validación segura de mensajes (`libs/unalib.js`).

- Los mensajes de texto, el nombre y el color se escapan/sanean: un `<script>` se muestra como texto y nunca se ejecuta.
- Una URL de imagen (jpg, jpeg, gif, png, bmp, webp) se muestra como `<img>`.
- Una URL de video (YouTube, mp4, webm, ogg) se muestra con un reproductor.

## Ejecutar
    npm install
    npm start            # http://localhost:3000

## Pruebas
    npm test                                                    # unitarias (Mocha)
    npx jest tests/integration --runInBand --env=node           # integración (Jest + Supertest + socket.io-client)
    npx playwright install chromium
    npx playwright test --project=chromium --headed             # end-to-end (levanta el chat solo si no está activo)
    npx playwright show-report

`scripts/evidencia1.js` reproduce la inyección contra la versión vulnerable (carpeta `antes/` del enunciado) y
`scripts/make-evidence.js` genera las capturas JPG.
