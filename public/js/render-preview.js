document.querySelector('.renderizar').addEventListener('click', function(event) {
    event.preventDefault();

    const code = document.getElementById('codigo_projeto').value; // Pega o código do campo de texto

    const iframe = document.getElementById('preview-frame');
    const iframeDoc = iframe.contentWindow.document;

    iframeDoc.open();
    iframeDoc.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script> <!-- Carrega p5.js -->
        </head>
        <body>
            <script type="text/javascript">
                // Coloque o código do usuário aqui
                ${code}
            </script>
        </body>
        </html>
    `);
    iframeDoc.close();
});
