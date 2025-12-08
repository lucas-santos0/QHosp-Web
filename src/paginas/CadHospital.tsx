import estilos from './CadHospital.module.css';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const schema = z.object({
  nome: z.string().min(1, "Informe o nome do hospital"),
  lotacao: z.string().min(1, "Informe o nível de lotação"),
  localizacao: z.string().min(1, "Informe a localização"),
  numeroFuncionarios: z.string().min(1, "Informe o número de funcionários"),
  servicoDisponivel: z.string().min(1, "Informe os serviços disponíveis"),
  codigoCnes: z.string().min(1, "Informe o código CNES"),
});

type FormData = z.infer<typeof schema>;

export function CadHospital() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function Verificacao(data: FormData) {
    if (!auth.currentUser) {
      alert('Você precisa estar logado para cadastrar um hospital');
      return;
    }

    const hospital = {
      nome: data.nome,
      lotacao: data.lotacao,
      localizacao: data.localizacao,
      numeroFuncionarios: data.numeroFuncionarios,
      servicoDisponivel: data.servicoDisponivel,
      codigoCnes: data.codigoCnes,
      criadoEm: new Date(),
      criadoPor: auth.currentUser.uid
    };

    try {
      // 📌 Aqui o documento é criado com o ID = codigoCnes
      const ref = doc(db, "Hospitais", data.codigoCnes);

      await setDoc(ref, hospital);

      alert("Hospital cadastrado com sucesso!");
      reset();
    } catch (error) {
      console.error("Erro ao cadastrar hospital:", error);
      alert("Erro ao cadastrar hospital.");
    }
  }

  return (
    <div className={estilos.tudo}>
      <div className={estilos.fundo} />

      <div className={estilos.quaseTudo}>
        <div className={estilos.box}>
          <div className={estilos.titulo}>Cadastro de Hospital</div>

          <form className={estilos.formulario} onSubmit={handleSubmit(Verificacao)}>

            <input
              type="text"
              placeholder="Nome do Hospital"
              {...register("nome")}
              className={estilos.campo}
            />
            <p className={estilos.mensagemErro}>{errors.nome?.message || "‎"}</p>

            <input
              type="text"
              placeholder="Nível de Lotação"
              {...register("lotacao")}
              className={estilos.campo}
            />
            <p className={estilos.mensagemErro}>{errors.lotacao?.message || "‎"}</p>

            <input
              type="text"
              placeholder="Localização"
              {...register("localizacao")}
              className={estilos.campo}
            />
            <p className={estilos.mensagemErro}>{errors.localizacao?.message || "‎"}</p>

            <input
              type="number"
              placeholder="Número de Funcionários"
              {...register("numeroFuncionarios")}
              className={estilos.campo}
            />
            <p className={estilos.mensagemErro}>{errors.numeroFuncionarios?.message || "‎"}</p>

            <input
              type="text"
              placeholder="Serviços Disponíveis"
              {...register("servicoDisponivel")}
              className={estilos.campo}
            />
            <p className={estilos.mensagemErro}>{errors.servicoDisponivel?.message || "‎"}</p>

            <input
              type="text"
              placeholder="Código CNES"
              {...register("codigoCnes")}
              className={estilos.campo}
            />
            <p className={estilos.mensagemErro}>{errors.codigoCnes?.message || "‎"}</p>

            <div className={estilos.campobotoes}>
              <button className={estilos.botao} type="submit">Salvar</button>
              <button className={estilos.botao} type="button" onClick={() => reset()}>Limpar</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
