import { NavLink, useNavigate } from 'react-router-dom';
import estilos from './Cadastro.module.css';
import { useForm } from 'react-hook-form';
import { addIssueToContext, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { FaArrowLeft } from "react-icons/fa";

const schema = z.object({
  nome: z.string().min(3, "Nome obrigatório"),
  cpf: z.string().min(11, "CPF inválido"),
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Mínimo 6 caracteres"),
  confirmarSenha: z.string().min(6, "Confirme sua senha"),
}).refine((data) => data.senha === data.confirmarSenha, {
  path: ["confirmarSenha"],
  message: "As senhas não coincidem"
});

type FormData = z.infer<typeof schema>;

export function Cadastro() {
  const navegação = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function cadastrarUsuario(data: FormData) {
    try {
      const cpf = data.cpf.replace(/\D/g, '');

      // Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.senha);
      const user = userCredential.user;

      // Firestore
      await setDoc(doc(db, "Usuarios", user.uid), {
        Nome: data.nome,
        CPF: cpf,
        Email: data.email,
        adm: false,
      });

      alert("Cadastro realizado com sucesso!");
      reset();
      navegação("/");

    } catch (e: any) {
      console.error("Erro ao cadastrar:", e);
      if (e.code === "auth/email-already-in-use") {
        alert("Este e-mail já está em uso.");
      } else {
        alert("Erro ao cadastrar. Tente novamente.");
      }
    }
  }

  function limparFormulario() {
    reset();
  }

  return (
    <div className={estilos.tudo}>
      <NavLink to={'/'}>
        <FaArrowLeft className={estilos.voltar} />
      </NavLink>

      <div className={estilos.quaseTudo}>
        <div className={estilos.box}>
          <div className={estilos.titulo}>Cadastro</div>

          <form className={estilos.formulario} onSubmit={handleSubmit(cadastrarUsuario)}>

            <div className={estilos.grupoCampo}>
              <input className={estilos.campo} placeholder="Nome Completo" {...register("nome")} />
              <p className={estilos.mensagemErro}>{errors.nome?.message || "‎"}</p>
            </div>

            <div className={estilos.grupoCampo}>
              <input className={estilos.campo} placeholder="CPF" {...register("cpf")} />
              <p className={estilos.mensagemErro}>{errors.cpf?.message || "‎"}</p>
            </div>

            <div className={estilos.grupoCampo}>
              <input className={estilos.campo} placeholder="Email" {...register("email")} />
              <p className={estilos.mensagemErro}>{errors.email?.message || "‎"}</p>
            </div>

            <div className={estilos.grupoCampo}>
              <input className={estilos.campo} type="password" placeholder="Senha" {...register("senha")} />
              <p className={estilos.mensagemErro}>{errors.senha?.message || "‎"}</p>
            </div>

            <div className={estilos.grupoCampo}>
              <input className={estilos.campo} type="password" placeholder="Confirmar Senha" {...register("confirmarSenha")} />
              <p className={estilos.mensagemErro}>{errors.confirmarSenha?.message || "‎"}</p>
            </div>

            <div className={estilos.campobotoes}>
              <button type="button" className={estilos.botao} onClick={limparFormulario}>
                <div className={estilos.campobotoes2}>Limpar</div>
              </button>
              <button type="submit" className={estilos.botao}>Cadastrar</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
