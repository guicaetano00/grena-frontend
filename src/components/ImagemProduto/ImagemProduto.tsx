import { useEffect, useState } from "react";

interface ImagemProdutoProps {
  nome: string;
}

interface RespostaImagem {
  imagem?: string;
}

function ImagemProduto({
  nome,
}: ImagemProdutoProps) {
  const [imagem, setImagem] =
    useState("");

  const [carregando, setCarregando] =
    useState(true);

  useEffect(() => {
    let ativo = true;

    async function buscarImagem() {
      try {
        setCarregando(true);
        setImagem("");

        const apiUrl =
          import.meta.env.VITE_API_URL ||
          "http://localhost:3000";

        const resposta = await fetch(
          `${apiUrl}/api/imagem-produto?nome=${encodeURIComponent(
            nome
          )}`
        );

        if (!resposta.ok) {
          throw new Error(
            `Erro ${resposta.status}`
          );
        }

        const dados: RespostaImagem =
          await resposta.json();

        if (
          ativo &&
          dados.imagem
        ) {
          setImagem(
            dados.imagem
          );
        }
      } catch (error) {
        console.error(
          `Erro ao buscar imagem de ${nome}:`,
          error
        );

        if (ativo) {
          setImagem("");
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    buscarImagem();

    return () => {
      ativo = false;
    };
  }, [nome]);

  if (carregando) {
    return (
      <div className="produto-card-imagem produto-imagem-loading">
        <span>Buscando...</span>
      </div>
    );
  }

  if (!imagem) {
    return (
      <div className="produto-card-imagem">
        <span>
          {nome
            .charAt(0)
            .toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className="produto-card-imagem">
      <img
        src={imagem}
        alt={nome}
        loading="lazy"
        onError={() =>
          setImagem("")
        }
      />
    </div>
  );
}

export default ImagemProduto;