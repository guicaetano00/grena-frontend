import { useEffect, useState } from "react";
import { getPerfil, atualizarPerfil } from "../../fetch/perfil";
import { UserProfile } from "../../types";
import "./Perfil.css";

export default function Perfil() {
  const [perfil, setPerfil] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<UserProfile | null>(null);
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarPerfil() {
      try {
        setErro("");

        const data = await getPerfil();

        setPerfil(data);
        setForm(data);
      } catch {
        setErro("Não foi possível carregar seu perfil.");
      } finally {
        setCarregando(false);
      }
    }

    carregarPerfil();
  }, []);

  function handleChange(campo: keyof UserProfile, valor: string) {
    setForm((prev) =>
      prev
        ? {
            ...prev,
            [campo]: valor,
          }
        : prev
    );
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();

    if (!form) return;

    try {
      setSalvando(true);
      setErro("");

      const atualizado = await atualizarPerfil(form);

      setPerfil(atualizado);
      setForm(atualizado);

      setEditando(false);
    } catch {
      setErro("Não foi possível salvar as alterações.");
    } finally {
      setSalvando(false);
    }
  }

  function cancelarEdicao() {
    setForm(perfil);
    setEditando(false);
    setErro("");
  }

  if (carregando) {
    return (
      <div className="perfil-page">
        <p className="perfil-hint">Carregando perfil...</p>
      </div>
    );
  }

  if (erro && !perfil) {
    return (
      <div className="perfil-page">
        <p className="perfil-erro">{erro}</p>
      </div>
    );
  }

  if (!perfil || !form) return null;

  return (
    <div className="perfil-page">

      <div className="perfil-container">

        <div className="perfil-header">
          <div className="perfil-avatar">
            {perfil.nome.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1>Meu Perfil</h1>
            <p>Gerencie suas informações pessoais</p>
          </div>
        </div>

        {erro && (
          <p className="perfil-erro">
            {erro}
          </p>
        )}

        {!editando ? (

          <div className="perfil-view">

            <div className="perfil-info">
              <span>Nome</span>
              <p>{perfil.nome}</p>
            </div>

            <div className="perfil-info">
              <span>E-mail</span>
              <p>{perfil.email}</p>
            </div>

            {perfil.telefone && (
              <div className="perfil-info">
                <span>Telefone</span>
                <p>{perfil.telefone}</p>
              </div>
            )}

            <button
              className="btn-editar"
              onClick={() => setEditando(true)}
            >
              Editar perfil
            </button>

          </div>

        ) : (

          <form
            className="perfil-form"
            onSubmit={handleSalvar}
          >

            <label>
              Nome

              <input
                value={form.nome}
                onChange={(e) =>
                  handleChange("nome", e.target.value)
                }
                required
              />
            </label>

            <label>
              E-mail

              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  handleChange("email", e.target.value)
                }
                required
              />
            </label>

            <label>
              Telefone

              <input
                value={form.telefone ?? ""}
                onChange={(e) =>
                  handleChange("telefone", e.target.value)
                }
                placeholder="(00) 00000-0000"
              />
            </label>

            <div className="perfil-acoes">

              <button
                className="btn-salvar"
                type="submit"
                disabled={salvando}
              >
                {salvando
                  ? "Salvando..."
                  : "Salvar alterações"}
              </button>

              <button
                className="btn-cancelar"
                type="button"
                onClick={cancelarEdicao}
                disabled={salvando}
              >
                Cancelar
              </button>

            </div>

          </form>

        )}

      </div>

    </div>
  );
}