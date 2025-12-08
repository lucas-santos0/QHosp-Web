import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import estilos from "./CadaPaciente.module.css";

interface FirebaseUsuario {
  Nome: string;
  CPF: string;
  Email: string;
  adm: boolean;
}

interface FirebaseFicha {
  alergia: string;
  data_nascimento: string;
  endereco: string;
  sexo: string;
  telefone: string;
  tipo_sanguineo: string;
}

export function CadaPaciente() {
  const { id } = useParams();
  const [paciente, setPaciente] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    loadData();
  }, [id]);

  async function loadData() {
    // 1) ---------------------- BUSCAR USUÁRIO ----------------------
    const userRef = doc(db, "Usuarios", id!);
    const userSnap = await getDoc(userRef);

    const firebaseUser: FirebaseUsuario | null =
      userSnap.exists() ? (userSnap.data() as FirebaseUsuario) : null;

    // 2) ---------------------- BUSCAR FICHA MÉDICA (SUBCOLEÇÃO) ----------------------
    const fichaRef = doc(db, "Usuarios", id!, "FichaMedica", "fichaPrincipal");
    const fichaSnap = await getDoc(fichaRef);

    const firebaseFicha: FirebaseFicha | null =
      fichaSnap.exists() ? (fichaSnap.data() as FirebaseFicha) : null;

    // 3) ---------------------- MONTAR OBJETO COMPLETO ----------------------
    const merged = {
      id,
      nome: firebaseUser?.Nome ?? "Não informado",
      cpf: firebaseUser?.CPF ?? "Não informado",
      email: firebaseUser?.Email ?? "Não informado",
      adm: firebaseUser?.adm ? "Sim" : "Não",

      alergia: firebaseFicha?.alergia ?? "Não informado",
      dataNascimento: firebaseFicha?.data_nascimento ?? "Não informado",
      endereco: firebaseFicha?.endereco ?? "Não informado",
      sexo: firebaseFicha?.sexo ?? "Não informado",
      telefone: firebaseFicha?.telefone ?? "Não informado",
      tipoSanguineo: firebaseFicha?.tipo_sanguineo ?? "Não informado",
    };

    setPaciente(merged);

    // 4) ---------------------- CRIAR FICHA SE NÃO EXISTIR ----------------------
    if (!firebaseFicha && userSnap.exists()) {
      await setDoc(fichaRef, {
        alergia: "Nenhuma",
        data_nascimento: "",
        endereco: "",
        sexo: "",
        telefone: "",
        tipo_sanguineo: "",
      });
    }
  }

  // ---------------------- RENDER ----------------------
  if (!paciente) return <div>Carregando...</div>;

  return (
    <div className={estilos.tudo}>
      <div className={estilos.quaseTudo}>
        <div className={estilos.box}>
          <h1 className={estilos.titulo}>Ficha do Paciente</h1>

          <div className={estilos.formulario}>
            <div className={estilos.infoLinha}>
              <div className={estilos.infoTitulo}>Nome do Paciente</div>
              <div className={estilos.infoValor}>{paciente.nome}</div>
            </div>

            <div className={estilos.infoLinha}>
              <div className={estilos.infoTitulo}>CPF</div>
              <div className={estilos.infoValor}>{paciente.cpf}</div>
            </div>

            <div className={estilos.infoLinha}>
              <div className={estilos.infoTitulo}>E-mail</div>
              <div className={estilos.infoValor}>{paciente.email}</div>
            </div>

            <div className={estilos.infoLinha}>
              <div className={estilos.infoTitulo}>Administrador</div>
              <div className={estilos.infoValor}>{paciente.adm}</div>
            </div>

            <div className={estilos.infoLinha}>
              <div className={estilos.infoTitulo}>Data de Nascimento</div>
              <div className={estilos.infoValor}>{paciente.dataNascimento}</div>
            </div>

            <div className={estilos.infoLinha}>
              <div className={estilos.infoTitulo}>Sexo</div>
              <div className={estilos.infoValor}>{paciente.sexo}</div>
            </div>

            <div className={estilos.infoLinha}>
              <div className={estilos.infoTitulo}>Tipo Sanguíneo</div>
              <div className={estilos.infoValor}>{paciente.tipoSanguineo}</div>
            </div>

            <div className={estilos.infoLinha}>
              <div className={estilos.infoTitulo}>Telefone</div>
              <div className={estilos.infoValor}>{paciente.telefone}</div>
            </div>

            <div className={estilos.infoLinha}>
              <div className={estilos.infoTitulo}>Endereço</div>
              <div className={estilos.infoValor}>{paciente.endereco}</div>
            </div>

            <div className={estilos.infoLinha}>
              <div className={estilos.infoTitulo}>Alergias</div>
              <div className={estilos.infoValor}>{paciente.alergia}</div>
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
