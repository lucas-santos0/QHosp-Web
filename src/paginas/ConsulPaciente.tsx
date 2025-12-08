import estilos from './ConsulPaciente.module.css'
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Carrossel } from '../componentes/Carrossel';
import { CarrosselPaciente } from '../componentes/CarrosselPaciente.tsx';

export function ConsulPaciente() {

  //Schema correto (cpf como string)
  const schema = z.object({
    nome: z.string().optional(),
    cpf: z.string().optional()
  });

  type FormData = z.infer<typeof schema>;

  const [pacientesExibidos, setPacientesExibidos] = useState<any[]>([]);
  const [erro, setErro] = useState('');

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  //Função principal
  async function verificarPaciente(data: FormData) {
    try {
      setErro("");
      setPacientesExibidos([]);

      const textoNome = data.nome?.trim();
      const textoCpf = data.cpf?.trim();

      const usuariosRef = collection(db, "Usuarios");
      let resultados: any[] = [];

      //Buscar por CPF
      if (textoCpf) {
        const qCPF = query(usuariosRef, where("CPF", "==", textoCpf));
        const snapCpf = await getDocs(qCPF);

        snapCpf.forEach((doc) => {
          resultados.push({
            id: doc.id,
            nome: doc.data().Nome,
            cpf: doc.data().CPF,
            endereco: "Não informado"
          });
        });
      }

      //Buscar por Nome (se não tiver achado por CPF)
      if (textoNome && resultados.length === 0) {
        const qNome = query(usuariosRef, where("Nome", "==", textoNome));
        const snapNome = await getDocs(qNome);

        snapNome.forEach((doc) => {
          resultados.push({
            id: doc.id,
            nome: doc.data().Nome,
            cpf: doc.data().CPF,
            endereco: "Não informado"
          });
        });
      }

      //Nenhum paciente encontrado
      if (resultados.length === 0) {
        setErro("Nenhum paciente encontrado");
        return;
      }

      setPacientesExibidos(resultados);

    } catch (err) {
      console.error(err);
      setErro("Erro ao buscar pacientes");
    }
  }

  // Imagens do carrossel
  const imagensCarrossel = [
    'https://saude.rs.gov.br/upload/recortes/202005/16121057_142430_GD.jpg',
    'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'https://admin.pi.gov.br/uploads/Whats_App_Image_2024_10_18_at_12_01_51_072d2d7158.jpeg'
  ];

  return (
    <div className={estilos.tudo}>
      
      <div className={estilos.carrosselSection}>
        <Carrossel 
          imagens={imagensCarrossel}
          autoplay={true}
          intervalo={4000}
        />
      </div>

      <div className={estilos.quaseTudo}>
        <div className={estilos.box}>
          <div className={estilos.titulo}>Busque pelo Paciente desejado!</div>

          <form onSubmit={handleSubmit(verificarPaciente)}>
            <textarea className={estilos.areaTexto} {...register("nome")} placeholder="Digite o nome do paciente"></textarea>
          
            <textarea className={estilos.areaTexto} {...register("cpf")} placeholder="Digite o CPF do paciente"></textarea>
            <button className={estilos.buscar} type="submit">Buscar</button>
          </form>

          {erro && <p style={{ color: 'red' }}>{erro}</p>}
          


        </div>
      </div>

      {pacientesExibidos.length > 0 && (
        <CarrosselPaciente 
          dados={pacientesExibidos}
          
        />
      )}

    </div>
  );
}

