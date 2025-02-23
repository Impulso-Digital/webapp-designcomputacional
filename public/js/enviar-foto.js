// Função para exibir a pré-visualização da foto escolhida
function previewImage(event) {
    const preview = document.getElementById('previewFoto');
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function () {
        preview.src = reader.result;
        preview.style.display = 'block';  // Mostra a imagem após carregar
    };

    if (file) {
        reader.readAsDataURL(file);  // Carrega o arquivo para pré-visualização
    }
}
