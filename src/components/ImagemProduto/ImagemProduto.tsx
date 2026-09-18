import {
  useEffect,
  useState,
} from "react";

interface ImagemProdutoProps {
  nome: string;
}

interface RespostaImagem {
  nome?: string;
  imagem?: string;
  titulo?: string;
  fonte?: string;
  erro?: string;
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

        const url =
          `${apiUrl}/api/imagem-produto?nome=${encodeURIComponent(
            nome
          )}`;

        console.log(
          "Buscando imagem:",
          url
        );

        const resposta =
          await fetch(url);

        const dados: RespostaImagem =
          await resposta.json();

        if (!resposta.ok) {
          console.error(
            `Erro ao buscar imagem de ${nome}:`,
            dados
          );

          throw new Error(
            dados.erro ||
              `Erro ${resposta.status}`
          );
        }

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

    if (nome.trim()) {
      buscarImagem();
    } else {
      setCarregando(false);
      setImagem("");
    }

    return () => {
      ativo = false;
    };
  }, [nome]);

  if (carregando) {
    return (
      <div className="produto-card-imagem produto-imagem-loading">
        <span>
          Buscando...
        </span>
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
        referrerPolicy="no-referrer"
        onError={() => {
          console.error(
            `A imagem de "${nome}" não carregou:`,
            imagem
          );

          setImagem("");
        }}
      />
    </div>
  );
}

export default ImagemProduto;