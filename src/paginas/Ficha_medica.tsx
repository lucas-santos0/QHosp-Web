import estilos from './Ficha_medica.module.css';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";



const schema = z.object({
  dataNascimento: z.string().min(1, "Informe a data de nascimento"),
  sexo: z.string().min(1, "Informe o sexo"),
  telefone: z.string().min(6, "Informe um telefone válido"),
  tipoSanguineo: z.string().min(1, "Informe o tipo sanguíneo"),
  alergia: z.string(),
  endereco: z.string().min(1, "Informe o endereço"),
});

type FormData = z.infer<typeof schema>;


export function Ficha_medica(){

const {
  register,
  handleSubmit,
  reset,
  setValue, 
  formState: { errors },
} = useForm<FormData>({
  resolver: zodResolver(schema),
});

const [usuarioInfo, setUsuarioInfo] = useState<{ nome?: string; email?: string; cpf?: string }>({});


async function Verificacao(data: FormData) {

   if (!auth.currentUser) {
      alert('Você precisa estar logado para salvar a ficha médica');
      return;
    }

    const uid = auth.currentUser.uid;

    // Objeto com os dados a serem salvos
    const ficha = {
      data_nascimento: data.dataNascimento,
      sexo: data.sexo,
      telefone: data.telefone,
      tipo_sanguineo: data.tipoSanguineo,
      alergia: data.alergia,
      endereco: data.endereco,
    };

    try {
    const fichaRef = doc(db, "Usuarios", uid, "FichaMedica", "fichaPrincipal");

    // Verifica se a ficha já existe
    const fichaDoc = await getDoc(fichaRef);

    if (fichaDoc.exists()) {
      // Atualiza
      await setDoc(fichaRef, ficha, { merge: true });
      alert("Ficha médica atualizada com sucesso!");
    } else {
      // Cria
      await setDoc(fichaRef, ficha);
      alert("Ficha médica criada com sucesso!");
    }

    reset(ficha);

  } catch (error) {
    console.error("Erro ao salvar ficha médica:", error);
    alert("Erro ao salvar ficha médica.");
  }
}

function waitForUser() {
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  useEffect(() => {
    async function carregarFicha() {
      const user: any = await waitForUser(); // espera usuário estar pronto

      

      const fichaRef = doc(db, "Usuarios", user.uid, "FichaMedica", "fichaPrincipal");

      try {
        const fichaDoc = await getDoc(fichaRef);

        if (fichaDoc.exists()) {
          const dados = fichaDoc.data();

          // Preenche os campos do formulário
          setValue("dataNascimento", dados.data_nascimento || "");
          setValue("sexo", dados.sexo || "");
          setValue("telefone", dados.telefone || "");
          setValue("tipoSanguineo", dados.tipo_sanguineo || "");
          setValue("alergia", dados.alergia || "");
          setValue("endereco", dados.endereco || "");
        }
      } catch (error) {
        console.error("Erro ao carregar ficha médica:", error);
      }
    }

    carregarFicha();
  }, [setValue]);

  useEffect(() => {
  async function carregarUsuario() {
    const user: any = await waitForUser(); // espera logar
    if (!user) return;

    const email = user.email;


    const userRef = doc(db, "Usuarios", user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const dados = userDoc.data();
      setUsuarioInfo({
        nome: dados.Nome,
        cpf: dados.CPF,
        email: email
      });
    } else {
      // se não existir documento, mostra só o email do auth
      setUsuarioInfo({ nome: "—", cpf: "—", email });
    }
  }

  carregarUsuario();
}, []);


  return (
    <div className={estilos.tudo}>
      <div className={estilos.quaseTudo}>
        <div className={estilos.box}>
          <div className={estilos.titulo}>Ficha médica</div>
          <p>Nome: {usuarioInfo.nome}</p>
          <p>CPF: {usuarioInfo.cpf}</p>
          <p>Email: {usuarioInfo.email}</p>
          <form className={estilos.formulario} onSubmit={handleSubmit(Verificacao)}>
            <div className={estilos.infoTitulo}>Data de nascimento</div>
            <input
              type="date"
              placeholder="Selecione sua Data de nascimento :"
              {...register("dataNascimento")}
              className={estilos.campo}
            />
            
            <p className={estilos.mensagemErro}>{errors.dataNascimento?.message || "‎"}</p>
            <div className={estilos.infoTitulo}>Sexo</div>
            <select {...register("sexo")} className={estilos.campo} defaultValue="">
              <option value="" disabled hidden>Selecione o seu Sexo :</option>
              <option value="M">Masculino (M)</option>
              <option value="F">Feminino (F)</option>
            </select>
            <p className={estilos.mensagemErro}>{errors.sexo?.message || "‎"}</p>

            <div className={estilos.infoTitulo}>Telefone</div>
            <input
              type="text"
              placeholder="Telefone"
              {...register("telefone")}
              className={estilos.campo}
            />
            <p className={estilos.mensagemErro}>{errors.telefone?.message || "‎"}</p>
            <div className={estilos.infoTitulo}>Tipo Sanguineo</div>
            <select {...register("tipoSanguineo")} className={estilos.campo} defaultValue="">
              <option value="" disabled hidden>Selecione seu Tipo Sanguineo</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
            <p className={estilos.mensagemErro}>{errors.tipoSanguineo?.message || "‎"}</p>

            <div className={estilos.infoTitulo}>Alergias</div>
            <input
              type="text"
              placeholder="Alergia (se houver)"
              {...register("alergia")}
              className={estilos.campo}
            />
            <p className={estilos.mensagemErro}>{errors.alergia?.message || "‎"}</p>
            
            <div className={estilos.infoTitulo}>Endereço</div>
            <input
              type="text"
              placeholder="Endereço"
              {...register("endereco")}
              className={estilos.campo}
            />
            <p className={estilos.mensagemErro}>{errors.endereco?.message || "‎"}</p>

            <div className={estilos.campobotoes}>
              <button className={estilos.botao} type="submit">Salvar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

}


    

