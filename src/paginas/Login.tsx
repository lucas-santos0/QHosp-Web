import estilos from './Login.module.css';
import { BsFillPersonPlusFill } from "react-icons/bs";
import { NavLink, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";


const schema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha inválida"),
});

type FormData = z.infer<typeof schema>;

export function Login() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const navegação = useNavigate();

  async function Verificacao(data: FormData) {
    try {
      // Login com Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.senha);
      const user = userCredential.user;

      // Busca o documento do usuário no Firestore
      const docRef = doc(db, "Usuarios", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const dadosUsuario = docSnap.data();

        // Redireciona conforme o campo 'adm'
        if (dadosUsuario.adm === true) {
          navegação("/editHospital");
        } else {
          navegação("/inicial");
        }
      } else {
        alert("Usuário não encontrado no banco.");
      }

    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
        alert("Email ou senha inválidos.");
      } else {
        alert("Erro ao fazer login. Verifique suas credenciais ou Tente novamente mais tarde.");
      }
    }
  }
  
  return (
    <div className={estilos.tudo}>
      <div className={estilos.quaseTudo}>
        <div className={estilos.box}>
          <div className={estilos.titulo}>Login</div>
          <form className={estilos.formulario} onSubmit={handleSubmit(Verificacao)}>
            <input
              className={estilos.campo}
              type="text"
              placeholder="Email:"
              {...register("email")}
            />
            <p className={estilos.mensagemErro}>{errors.email?.message || "‎"}</p>

            <input
              className={estilos.campo}
              type="password"
              placeholder="Senha:"
              {...register("senha")}
            />
            <p className={estilos.mensagemErro}>{errors.senha?.message || "‎"}</p>

            <NavLink className={estilos.esqueceuSenha} to={'/esqueceuSenha'}>
              <p className={estilos.esqueceuSenhatxt}>Esqueceu sua senha?</p>
            </NavLink>

            <div className={estilos.campobotoes}>
              <button
                className={estilos.botao}
                type="button"
                onClick={() => reset()}
              >
                <div className={estilos.campobotoes2}>Limpar</div>
              </button>
              <button className={estilos.botao} type="submit">
                Entrar
              </button>
            </div>
          </form>
        </div>

        <NavLink className={estilos.cadastro} to={'/cadastro'}>
          <BsFillPersonPlusFill className={estilos.iconeCadastro} /> Cadastre-se
        </NavLink>
      </div>
    </div>
  );
}
