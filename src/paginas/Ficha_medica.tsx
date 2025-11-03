import estilos from './Ficha_medica.module.css';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect } from "react";


// Schema de validação com mensagens corrigidas
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

      if (!user) {
        // usuário não logado, talvez redirecionar ou mostrar mensagem
        return;
      }

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


  return (
    <div className={estilos.tudo}>
      <div className={estilos.quaseTudo}>
        <div className={estilos.box}>
          <div className={estilos.titulo}>Ficha médica</div>
          <p>Nome</p>
          <p>cpf</p>
          <p>email</p>
          <form className={estilos.formulario} onSubmit={handleSubmit(Verificacao)}>
            <input
              type="date"
              placeholder="Selecione sua Data de nascimento :"
              {...register("dataNascimento")}
              className={estilos.campo}
            />
            <p className={estilos.mensagemErro}>{errors.dataNascimento?.message || "‎"}</p>

            <select {...register("sexo")} className={estilos.campo} defaultValue="">
              <option value="" disabled hidden>Selecione o seu Sexo :</option>
              <option value="M">Masculino (M)</option>
              <option value="F">Feminino (F)</option>
            </select>
            <p className={estilos.mensagemErro}>{errors.sexo?.message || "‎"}</p>

            <input
              type="text"
              placeholder="Telefone"
              {...register("telefone")}
              className={estilos.campo}
            />
            <p className={estilos.mensagemErro}>{errors.telefone?.message || "‎"}</p>

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

            <input
              type="text"
              placeholder="Alergia (se houver)"
              {...register("alergia")}
              className={estilos.campo}
            />
            <p className={estilos.mensagemErro}>{errors.alergia?.message || "‎"}</p>

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


    

