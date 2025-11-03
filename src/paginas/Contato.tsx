import { useState } from "react";
import estilos from "./Contato.module.css";

export function Contato() {
  const [email, setEmail] = useState("");
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("");

    if (!email || !assunto || !mensagem) {
      setStatus("Preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, assunto, mensagem }),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("Mensagem enviada com sucesso!");
        setEmail("");
        setAssunto("");
        setMensagem("");
      } else {
        setStatus(result.error || "Erro ao enviar mensagem.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Erro ao conectar com o servidor.");
    }
  }

  return (
    <div className={estilos.tudo}>
      <div className={estilos.fundo} />

      <div className={estilos.quaseTudo}>
        <div className={estilos.box}>
          <div className={estilos.titulo}>Esta tendo problemas? envie um email de para nossa equipe!</div>

          <form className={estilos.formulario} onSubmit={handleSubmit}>
            <input
              className={estilos.campo}
              placeholder="Insira seu Email:"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className={estilos.campo}
              placeholder="Insira motivo de Contato:"
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
            />

            <textarea
              className={estilos.mensagem}
              placeholder="Insira uma Mensagem:"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
            />

            {status && <p className={estilos.status}>{status}</p>}

            <div className={estilos.campobotoes}>
              <button
                className={estilos.botao}
                type="button"
                onClick={() => {
                  setEmail("");
                  setAssunto("");
                  setMensagem("");
                  setStatus("");
                }}
              >
                <div className={estilos.campobotoes2}>Limpar</div>
              </button>

              <button className={estilos.botao} type="submit">
                Enviar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
