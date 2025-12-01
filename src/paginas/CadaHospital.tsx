import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import estilos from "./CadaHospital.module.css";

interface ApiHospital {
  CO_CNES: string;
  NO_FANTASIA: string;
  NO_LOGRADOURO: string;
  NO_BAIRRO: string;
  NU_ENDERECO: string;
  NU_LATITUDE: string;
  NU_LONGITUDE: string;
  DS_TURNO_ATENDIMENTO: string;
}

interface FirebaseHospital {
  codigoCnes: string;
  nome: string;
  lotacao: string;
  localizacao: string;
  numeroFuncionarios: number | string;
  servicoDisponivel: string;
}

export function CadaHospital() {
  const params = useParams();
  const id = params.id as string | undefined;

  const [hospital, setHospital] = useState<any>(null);

  useEffect(() => {
    if (!id) return; // agora TS não reclama
    loadData(id);
  }, [id]);

  async function loadData(cnesId: string) {
    // 1) Firebase
    const ref = doc(db, "Hospitais", cnesId);
    const snap = await getDoc(ref);
    const firebaseData: FirebaseHospital | null =
      snap.exists() ? (snap.data() as FirebaseHospital) : null;

    // 2) API CNES
    const respostaJSON = await fetch("/cnes_estabelecimentos35.json");
    const dados = await respostaJSON.json();

    const apiData: ApiHospital | null =
      dados.find((h: any) => h.CO_CNES === cnesId) ?? null;

    // 3) Merge
    const merged = {
      codigoCnes: cnesId,
      nome: firebaseData?.nome ?? apiData?.NO_FANTASIA ?? "Não informado",
      lotacao: firebaseData?.lotacao ?? "Não informado",
      localizacao:
        firebaseData?.localizacao ??
        (apiData
          ? `${apiData.NO_LOGRADOURO}, ${apiData.NU_ENDERECO}, ${apiData.NO_BAIRRO}`
          : "Não informado"),
      numeroFuncionarios: firebaseData?.numeroFuncionarios ?? "Não informado",
      servicoDisponivel:
        firebaseData?.servicoDisponivel ??
        apiData?.DS_TURNO_ATENDIMENTO ??
        "Não informado",
      latitude: apiData?.NU_LATITUDE ?? null,
      longitude: apiData?.NU_LONGITUDE ?? null,
    };

    setHospital(merged);

    // 4) Salvar no Firebase
    if (!firebaseData) {
      await setDoc(ref, merged);
    } else {
      const precisaAtualizar =
        Object.keys(merged).some((k) => (firebaseData as any)[k] == null);

      if (precisaAtualizar) await setDoc(ref, merged, { merge: true });
    }
  }

  if (!hospital) return <div>Carregando...</div>;

  return (
    <div className={estilos.tudo}>
      <div className={estilos.quaseTudo}>
        <div className={estilos.box}>
          <h1 className={estilos.titulo}>Detalhes do Hospital</h1>

          <div className={estilos.formulario}>
            <div className={estilos.infoLinha}>
              <div className={estilos.infoTitulo}>Nome do Hospital</div>
              <div className={estilos.infoValor}>{hospital.nome}</div>
            </div>

            <div className={estilos.infoLinha}>
              <div className={estilos.infoTitulo}>Lotação</div>
              <div className={estilos.infoValor}>{hospital.lotacao}</div>
            </div>

            <div className={estilos.infoLinha}>
              <div className={estilos.infoTitulo}>Localização</div>
              <div className={estilos.infoValor}>{hospital.localizacao}</div>
            </div>

            <div className={estilos.infoLinha}>
              <div className={estilos.infoTitulo}>Funcionários</div>
              <div className={estilos.infoValor}>
                {hospital.numeroFuncionarios}
              </div>
            </div>

            <div className={estilos.infoLinha}>
              <div className={estilos.infoTitulo}>Serviços Disponíveis</div>
              <div className={estilos.infoValor}>
                {hospital.servicoDisponivel}
              </div>
            </div>

            <div className={estilos.infoLinha}>
              <div className={estilos.infoTitulo}>Código CNES</div>
              <div className={estilos.infoValor}>{hospital.codigoCnes}</div>
            </div>

            <div className={estilos.infoLinha}>
              <div className={estilos.infoTitulo}>Latitude</div>
              <div className={estilos.infoValor}>
                {hospital.latitude ?? "Sem latitude"}
              </div>
            </div>

            <div className={estilos.infoLinha}>
              <div className={estilos.infoTitulo}>Longitude</div>
              <div className={estilos.infoValor}>
                {hospital.longitude ?? "Sem longitude"}
              </div>
            </div>
          </div>

          <button className={estilos.botaoVoltar} onClick={() => history.back()}>
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
