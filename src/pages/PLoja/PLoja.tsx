import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navegacao from "../../components/Navegacao/Navegacao";
import Rodape from "../../components/Rodape/Rodape";
import ImagemProduto from "../../components/ImagemProduto/ImagemProduto";
import { api } from "../../api";
import { useCarrinho } from "../../context/CarrinhoContext";
import { resumoAvaliacoes } from "../../avaliacoes";
import type { Categoria, Produto } from "../../types";
import bannerDesconto from "../../assets/banner-desconto.png";
import bannerVasco from "../../assets/banner-vasco.png";
import bannerNike from "../../assets/banner-nike.png";

const banners = [bannerDesconto, bannerVasco, bannerNike];
const money = (v: number) => Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function uniq(a: (string | undefined)[]) { return [...new Set(a.filter(Boolean) as string[])].sort(); }

// Opções padrão de cada filtro. As opções que existirem nos produtos cadastrados
// e não estiverem aqui são adicionadas automaticamente (ver "mesclar").
const OPCOES = {
    marca: [
        "Adidas", "Asics", "Black Skull", "Fila", "GRENÁ", "Growth Supplements", "Integralmédica", "Kappa", "Lupo",
        "Max Titanium", "Mizuno", "New Balance", "Nike", "Olympikus", "Oakley", "Penalty", "Probiótica", "Puma",
        "Reebok", "Spalding", "Speedo", "Topper", "Umbro", "Under Armour", "Wilson",
    ],
    genero: ["Masculino", "Feminino", "Unissex"],
    esporte: [
        "Academia", "Basquete", "Ciclismo", "Corrida", "Crossfit", "Fitness", "Futebol", "Futsal", "Handebol",
        "Lifestyle", "Lutas", "Natação", "Skate", "Tênis", "Treino", "Vôlei", "Yoga",
    ],
    // roupas (PP–XGG), infantil (2–16), calçados (33–45) e tamanho único
    tamanho: [
        "PP", "P", "M", "G", "GG", "XG", "XGG",
        "2", "4", "6", "8", "10", "12", "14", "16",
        ...Array.from({ length: 13 }, (_, i) => String(33 + i)),
        "Único",
    ],
    cor: [
        "Amarelo", "Azul", "Azul-marinho", "Bege", "Branco", "Cinza", "Dourado", "Grená", "Laranja", "Marrom",
        "Multicolorido", "Prata", "Preto", "Rosa", "Roxo", "Verde", "Vermelho", "Vinho",
    ],
    idade: ["Bebê", "Infantil", "Juvenil", "Adulto"],
};

// Junta as opções padrão com as encontradas nos produtos, sem repetir.
// ordenar=false mantém a ordem da lista padrão (útil para tamanhos, gênero e idade).
function mesclar(base: string[], dados: (string | undefined)[], ordenar = true) {
    const todos = [...new Set([...base, ...uniq(dados)])];
    return ordenar ? todos.sort((a, b) => a.localeCompare(b, "pt-BR")) : todos;
}

function PLoja() {
    const { quantidadeTotal } = useCarrinho(); const [produtos, setProdutos] = useState<Produto[]>([]); const [categorias, setCategorias] = useState<Categoria[]>([]); const [busca, setBusca] = useState(""); const [cat, setCat] = useState<number | "todas">("todas"); const [marca, setMarca] = useState(""); const [genero, setGenero] = useState(""); const [esporte, setEsporte] = useState(""); const [tamanho, setTamanho] = useState(""); const [cor, setCor] = useState(""); const [idade, setIdade] = useState(""); const [promo, setPromo] = useState(false); const [ordem, setOrdem] = useState("relevancia"); const [carregando, setCarregando] = useState(true); const [aviso, setAviso] = useState(""); const [banner, setBanner] = useState(0);
    useEffect(() => { Promise.all([api.listar<Produto>("produtos"), api.listar<Categoria>("categorias")]).then(([p, c]) => { setProdutos(p); setCategorias(c) }).catch(() => setAviso("Não foi possível carregar os produtos agora.")).finally(() => setCarregando(false)); }, []); useEffect(() => { const i = setInterval(() => setBanner(b => (b + 1) % banners.length), 5000); return () => clearInterval(i) }, []);
    const filtrados = useMemo(() => { let r = produtos.filter(p => { const q = busca.trim().toLowerCase(); return (cat === "todas" || p.idCategoria === cat) && (!q || `${p.nome} ${p.descricao || ""} ${p.marca || ""} ${p.esporte || ""}`.toLowerCase().includes(q)) && (!marca || p.marca === marca) && (!genero || p.genero === genero) && (!esporte || p.esporte === esporte) && (!tamanho || p.tamanhos?.includes(tamanho)) && (!cor || p.cores?.includes(cor)) && (!idade || p.faixaEtaria === idade) && (!promo || p.promocao) }); if (ordem === "menor") r = [...r].sort((a, b) => a.preco - b.preco); if (ordem === "maior") r = [...r].sort((a, b) => b.preco - a.preco); if (ordem === "desconto") r = [...r].sort((a, b) => (b.desconto || 0) - (a.desconto || 0)); if (ordem === "avaliacao") r = [...r].sort((a, b) => resumoAvaliacoes(b).media - resumoAvaliacoes(a).media); return r }, [produtos, busca, cat, marca, genero, esporte, tamanho, cor, idade, promo, ordem]);
    const listas = useMemo(() => ({
        marca: mesclar(OPCOES.marca, produtos.map(p => p.marca)),
        genero: mesclar(OPCOES.genero, produtos.map(p => p.genero), false),
        esporte: mesclar(OPCOES.esporte, produtos.map(p => p.esporte)),
        tamanho: mesclar(OPCOES.tamanho, produtos.flatMap(p => p.tamanhos || []), false),
        cor: mesclar(OPCOES.cor, produtos.flatMap(p => p.cores || [])),
        idade: mesclar(OPCOES.idade, produtos.map(p => p.faixaEtaria), false),
    }), [produtos]);
    const limpar = () => { setCat("todas"); setMarca(""); setGenero(""); setEsporte(""); setTamanho(""); setCor(""); setIdade(""); setPromo(false); setBusca("") };
    return <div className="loja-page"><Navegacao cartCount={quantidadeTotal} /><section className="loja-topo"><input className="loja-busca" placeholder="Buscar produtos, marcas e categorias..." value={busca} onChange={e => setBusca(e.target.value)} /><div className="loja-categorias"><button className={cat === "todas" ? "active" : ""} onClick={() => setCat("todas")}>Todos</button>{categorias.map(c => <button key={c.idCategoria} className={cat === c.idCategoria ? "active" : ""} onClick={() => setCat(c.idCategoria!)}>{c.nome}</button>)}</div></section><section className="loja-hero-banner"><img src={banners[banner]} className="loja-banner-img" alt="Promoção GRENÁ" /><button className="banner-seta banner-seta-esquerda" onClick={() => setBanner(b => (b - 1 + banners.length) % banners.length)}>‹</button><button className="banner-seta banner-seta-direita" onClick={() => setBanner(b => (b + 1) % banners.length)}>›</button></section>{aviso && <div className="toast">{aviso}</div>}<main className="catalogo-layout"><aside className="filtros-sidebar"><div className="filtro-titulo"><strong>Filtros</strong><button onClick={limpar}>Limpar</button></div>{[["Marca", marca, setMarca, listas.marca], ["Gênero", genero, setGenero, listas.genero], ["Esporte", esporte, setEsporte, listas.esporte], ["Tamanho", tamanho, setTamanho, listas.tamanho], ["Cor", cor, setCor, listas.cor], ["Idade", idade, setIdade, listas.idade]].map(([titulo, valor, setter, opcoes]: any) => <label className="filtro-grupo" key={titulo}><span>{titulo}</span><select value={valor} onChange={e => setter(e.target.value)}><option value="">Todos</option>{opcoes.map((o: string) => <option key={o}>{o}</option>)}</select></label>)}<label className="filtro-check"><input type="checkbox" checked={promo} onChange={e => setPromo(e.target.checked)} /> Somente promoções</label></aside><section className="catalogo-conteudo"><div className="catalogo-barra"><strong>{filtrados.length} produtos</strong><select value={ordem} onChange={e => setOrdem(e.target.value)}><option value="relevancia">Relevância</option><option value="menor">Menor preço</option><option value="maior">Maior preço</option><option value="desconto">Maior desconto</option><option value="avaliacao">Melhor avaliação</option></select></div><div className="loja-grid nova-grid">{carregando && <p className="loja-estado">Carregando produtos...</p>}{!carregando && filtrados.length === 0 && <p className="loja-estado">Nenhum produto encontrado.</p>}{filtrados.map(p => <Link to={`/produto/${p.idProduto}`} className="produto-card produto-card-link" key={p.idProduto}>{(p.desconto || 0) > 0 && <span className="produto-desconto">-{p.desconto}%</span>}<ImagemProduto nome={p.nome} imagem={p.imagem} /><div className="produto-card-corpo"><small>{p.marca || "GRENÁ"}</small><h3>{p.nome}</h3><div className="produto-rating">★ {resumoAvaliacoes(p).media.toFixed(1)} <span>({resumoAvaliacoes(p).total})</span></div>{p.precoAnterior && <del>{money(p.precoAnterior)}</del>}<strong className="produto-preco">{money(p.preco)} <small>no Pix</small></strong><p className="produto-parcela">ou {p.parcelas || 6}x de {money(p.preco / (p.parcelas || 6))} sem juros</p></div></Link>)}</div></section></main><Rodape /></div>
}
export default PLoja;
