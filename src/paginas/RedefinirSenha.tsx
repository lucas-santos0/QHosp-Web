import estilos from './EsqueceuSenha.module.css';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaArrowLeft } from "react-icons/fa";

const schema = z
  .object({
    senha: z.string().min(6, "Senha inválida, mínimo de 6 caracteres"),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

type FormData = z.infer<typeof schema>;

export function RedefinirSenha() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const navegar = useNavigate();
  const { state } = useLocation();
  const email = state?.email;
  const code = state?.code;

  if (!email || !code) {
    return (
      <div className={estilos.tudo}>
        <p>Erro: Dados insuficientes. Volte e tente novamente.</p>
        <NavLink to="/">Voltar</NavLink>
      </div>
    );
  }

  async function Verificacao(data: FormData) {
    try {
      const response = await fetch("http://localhost:5000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code,
          newPassword: data.senha,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Senha redefinida com sucesso!");
        navegar("/");
      } else {
        alert(result.error || "Erro ao redefinir sua Senha :( \nTente Novamente mais tarde!");
        navegar("/");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao redefinir sua Senha :( \nTente Novamente mais tarde!");
      navegar("/");
    }
  }

  return (
    <div className={estilos.tudo}>
      <NavLink to={'/'}><FaArrowLeft className={estilos.voltar} /></NavLink>
      <div className={estilos.quaseTudo}>
        <div className={estilos.box}>
          <div className={estilos.titulo}>Redefina sua senha!</div>

          <form className={estilos.formulario} onSubmit={handleSubmit(Verificacao)}>
            <input
              className={estilos.campo}
              type="password"
              placeholder="Insira sua nova senha"
              {...register("senha")}
            />
            <p className={estilos.mensagemErro}>{errors.senha?.message || "‎"}</p>

            <input
              className={estilos.campo}
              type="password"
              placeholder="Confirme sua nova senha"
              {...register("confirmarSenha")}
            />
            <p className={estilos.mensagemErro}>{errors.confirmarSenha?.message || "‎"}</p>

            <div className={estilos.campobotoes}>
              <button className={estilos.botao} type="button" onClick={() => reset()}>
                <div className={estilos.campobotoes2}>Limpar</div>
              </button>
              <button className={estilos.botao} type="submit">
                Redefinir Senha
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
