import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import estilos from "./EsqueceuSenha.module.css";
import { FaArrowLeft } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email("Email inválido"),
  cpf: z.string().min(11, "CPF inválido"),
  nome: z.string().min(3, "Nome inválido"),
  codigo: z.string().length(6, "Código inválido").optional(),
});

type FormData = z.infer<typeof schema>;

export function EsqueceuSenha() {
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [emailVerificado, setEmailVerificado] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const navegar = useNavigate();

  async function onSubmit(data: FormData) {
    if (!codigoEnviado) {
      try {
        const usuariosRef = collection(db, "Usuarios");
        const q = query(usuariosRef, where("Email", "==", data.email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          alert("Usuário não encontrado com esse e-mail.");
          return;
        }

        let usuarioEncontrado = null;
        querySnapshot.forEach((doc) => {
          const dados = doc.data();
          if (dados.CPF === data.cpf && dados.Nome === data.nome) {
            usuarioEncontrado = { id: doc.id, ...dados };
          }
        });

        if (!usuarioEncontrado) {
          alert("Dados não conferem. Verifique CPF e nome.");
          return;
        }

        const response = await fetch("http://localhost:5000/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email }),
        });

        const result = await response.json();

        if (response.ok) {
          alert(result.message || "Usuario verificado com Sucesso!");
          setCodigoEnviado(true);
          setEmailVerificado(data.email);
        } else {
          alert(result.error || "Erro ao enviar o código.");
        }
      } catch (error) {
        console.error(error);
        alert("Erro ao verificar usuário. Tente novamente.");
      }
    } else {
      // Agora só navega pra segunda tela, sem validar o código no backend
      if (!data.codigo) {
        alert("Digite o código enviado para o seu e-mail.");
        return;
      }

      if (!emailVerificado) {
        alert("Erro: e-mail não verificado ainda.");
        return;
      }

      navegar("/redefinirSenha", {
        state: { email: emailVerificado, code: data.codigo.trim() },
      });
    }
  }

  return (
    <div className={estilos.tudo}>
      <NavLink to={"/"}>
        <FaArrowLeft className={estilos.voltar} />
      </NavLink>

      <div className={estilos.quaseTudo}>
        <div className={estilos.box}>
          <div className={estilos.titulo}>
            {!codigoEnviado
              ? "Preencha os campos abaixo para Redefinir sua senha!"
              : "Enviamos um código de verificação para o seu e-mail. Insira-o abaixo para continuar."}
          </div>

          <form className={estilos.formulario} onSubmit={handleSubmit(onSubmit)}>
            {!codigoEnviado && (
              <>
                <input
                  className={estilos.campo}
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                />
                <p className={estilos.mensagemErro}>
                  {errors.email?.message || "‎"}
                </p>

                <input
                  className={estilos.campo}
                  type="text"
                  placeholder="CPF"
                  {...register("cpf")}
                />
                <p className={estilos.mensagemErro}>
                  {errors.cpf?.message || "‎"}
                </p>

                <input
                  className={estilos.campo}
                  type="text"
                  placeholder="Nome completo"
                  {...register("nome")}
                />
                <p className={estilos.mensagemErro}>
                  {errors.nome?.message || "‎"}
                </p>
              </>
            )}

            {codigoEnviado && (
              <>
                <input
                  className={estilos.campo}
                  type="text"
                  placeholder="Código de 6 dígitos"
                  {...register("codigo")}
                />
                <p className={estilos.mensagemErro}>
                  {errors.codigo?.message || "‎"}
                </p>
              </>
            )}

            <div className={estilos.campobotoes}>
              <button
                className={estilos.botao}
                type="button"
                onClick={() => {
                  reset();
                  setCodigoEnviado(false);
                }}
              >
                <div className={estilos.campobotoes2}>Limpar</div>
              </button>

              <button className={estilos.botao} type="submit">
                {!codigoEnviado ? "Verificar usuário" : "Avançar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
