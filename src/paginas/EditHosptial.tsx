import estilos from './EditHospital.module.css';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs, doc, updateDoc, addDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';

const schema = z.object({
  nome: z.string().min(1, "Informe o nome do hospital"),
  lotacao: z.string().min(1, "Informe o nível de lotação"),
  localizacao: z.string().min(1, "Informe a localização"),
  numeroFuncionarios: z.string().min(1, "Informe o número de funcionários"),
  servicoDisponivel: z.string().min(1, "Informe os serviços disponíveis"),
  codigoCnes: z.string().min(1, "Informe o código CNES"),
});

type FormData = z.infer<typeof schema>;

export function EditHospital() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [hospitalId, setHospitalId] = useState<string | null>(null);

  // Carrega os dados do hospital do admin logado
  useEffect(() => {
    async function carregarHospital() {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const hospitaisRef = collection(db, "Hospitais");
        const q = query(hospitaisRef, where("criadoPor", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          const dados = docSnap.data();
          setHospitalId(docSnap.id);

          // Preenche o formulário com os dados existentes
          setValue("nome", dados.nome || "");
          setValue("lotacao", dados.lotacao || "");
          setValue("localizacao", dados.localizacao || "");
          setValue("numeroFuncionarios", dados.numeroFuncionarios || "");
          setValue("servicoDisponivel", dados.servicoDisponivel || "");
          setValue("codigoCnes", dados.codigoCnes || "");
        }
      } catch (error) {
        console.error("Erro ao carregar hospital:", error);
      }
    }

    carregarHospital();
  }, [setValue]);

  // Salvar ou atualizar hospital
  async function salvarHospital(data: FormData) {
    const user = auth.currentUser;
    if (!user) {
      alert("Você precisa estar logado para salvar um hospital");
      return;
    }

    const hospital = {
      nome: data.nome,
      lotacao: data.lotacao,
      localizacao: data.localizacao,
      numeroFuncionarios: data.numeroFuncionarios,
      servicoDisponivel: data.servicoDisponivel,
      codigoCnes: data.codigoCnes,
      criadoPor: user.uid,
      atualizadoEm: new Date(),
    };

    try {
      const hospitaisRef = collection(db, "Hospitais");

      if (hospitalId) {
        // Atualiza hospital existente
        const docRef = doc(db, "Hospitais", hospitalId);
        await updateDoc(docRef, hospital);
        alert("Hospital atualizado com sucesso!");
      } else {
        // Cria novo hospital
        const novoDoc = await addDoc(hospitaisRef, hospital);
        setHospitalId(novoDoc.id);
        alert("Hospital criado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar hospital:", error);
      alert("Erro ao salvar hospital.");
    }
  }

  return (
    <div className={estilos.tudo}>
      <div className={estilos.fundo} />

      <div className={estilos.quaseTudo}>
        <div className={estilos.box}>
          <div className={estilos.titulo}>Editor de Hospital</div>

          <form className={estilos.formulario} onSubmit={handleSubmit(salvarHospital)}>
            <input type="text" placeholder="Nome do Hospital" {...register("nome")} className={estilos.campo}/>
            <p className={estilos.mensagemErro}>{errors.nome?.message || "‎"}</p>

            <input type="text" placeholder="Nível de Lotação" {...register("lotacao")} className={estilos.campo}/>
            <p className={estilos.mensagemErro}>{errors.lotacao?.message || "‎"}</p>

            <input type="text" placeholder="Localização" {...register("localizacao")} className={estilos.campo}/>
            <p className={estilos.mensagemErro}>{errors.localizacao?.message || "‎"}</p>

            <input type="number" placeholder="Número de Funcionários" {...register("numeroFuncionarios")} className={estilos.campo}/>
            <p className={estilos.mensagemErro}>{errors.numeroFuncionarios?.message || "‎"}</p>

            <input type="text" placeholder="Serviços Disponíveis" {...register("servicoDisponivel")} className={estilos.campo}/>
            <p className={estilos.mensagemErro}>{errors.servicoDisponivel?.message || "‎"}</p>

            <input type="text" placeholder="Código CNES" {...register("codigoCnes")} className={estilos.campo}/>
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
