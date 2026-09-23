interface ImagemProdutoProps {
  nome: string;
  imagem?: string | null;
}

function ImagemProduto({ nome, imagem }: ImagemProdutoProps) {
  const src = imagem?.trim() || "";

  if (!src) {
    return (
      <div className="produto-card-imagem produto-imagem-indisponivel">
        <span>Imagem indisponível</span>
      </div>
    );
  }

  return (
    <div className="produto-card-imagem">
      <img
        src={src}
        alt={nome}
        loading="lazy"
        onError={(event) => {
          event.currentTarget.style.display = "none";
          const container = event.currentTarget.parentElement;
          if (container && !container.querySelector("span")) {
            const aviso = document.createElement("span");
            aviso.textContent = "Imagem indisponível";
            container.appendChild(aviso);
          }
        }}
      />
    </div>
  );
}

export default ImagemProduto;
