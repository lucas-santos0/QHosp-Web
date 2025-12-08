import estilos from './Inicial.module.css'
import { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Carrossel } from '../componentes/Carrossel';
import { CarrosselEsta } from '../componentes/CarrosselEsta';

export function Inicial() {
  const schema = z.object({
    localizacao: z.string(),
    nome: z.string()
  });

  const [hospitaisExibidos, setHospitaisExibidos] = useState<any[]>([]);



  type FormData = z.infer<typeof schema>;

  // Tipo do hospital
  type Hospital = {
    CO_IBGE: string;
    [key: string]: any;
  };

  type Municipio = {
    id: number;
    nome: string;
  };

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [erro, setErro] = useState('');

  // Função para normalizar strings (remove acentos e transforma em minúsculas)
  function normalizar(str: string) {
    return str.normalize("NFD").replace(/\s+/g, "").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    
  }

/*  async function verificarEstabelecimentoPorMunicipio(data: FormData) {
    console.log('Município digitado:', data.localizacao);

    try {
    
      const resposta = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios');
      const municipios: Municipio[] = await resposta.json();

      
      const municipio = municipios.find(
        (m) => normalizar(m.nome) === normalizar(data.localizacao)
      );

      if (!municipio) {
        setErro("Município não encontrado");
        return;
      }

      
      const respostaJSON = await fetch('/cnes_estabelecimentos35.json');
      const respostaJS: Hospital[] = await respostaJSON.json();

      
      const codigoCNES = String(Math.floor(municipio.id / 10));

      
      const hospitaisFiltrados = respostaJS.filter(hospital =>
        hospital.CO_IBGE === codigoCNES
      );

      console.log("Hospitais filtrados:", hospitaisFiltrados);

    } catch (erro) {
      setErro(`A busca falhou! Erro: ${erro}`);
      setEstabelecimentos([]);
    }
  }

  async function verificarEstabelecimentoPorNome(data: FormData){
    try{
      const respostaJSON = await fetch('/cnes_estabelecimentos35.json');
      const respostaJS: Hospital[] = await respostaJSON.json();

      const hospitalFiltrado = respostaJS.filter(hospital =>
      normalizar(hospital.NO_FANTASIA || "").includes(normalizar(data.nome))
      );
      if (hospitalFiltrado != undefined){
        console.log(hospitalFiltrado)
      }
      else{
        console.log("hospital não encontrado")
      }
    }
    catch{
      console.log("erro inesperado")
    }
  }*/

    async function verificarEstabelecimento(data: FormData){
    try{

      if(data.localizacao == "" && data.nome !== ""){
        const respostaJSON = await fetch('/cnes_estabelecimentos.json');
        const respostaJS: Hospital[] = await respostaJSON.json();

        const hospitalFiltrado = respostaJS.filter(hospital =>
        normalizar(hospital.NO_FANTASIA || "").includes(normalizar(data.nome))
        );
        if (hospitalFiltrado.length > 0 || hospitalFiltrado == undefined) {
          const dadosCarrossel = hospitalFiltrado.map(h => ({
          imagem: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f",
          nome: h.NO_FANTASIA || "Nome não informado",
          endereco: `${h.NO_LOGRADOURO || ""}, ${h.NU_ENDERECO || ""} - ${h.NO_BAIRRO || ""}`,
          lotacao: Math.floor(Math.random() * 100),
          cnes: h.CO_CNES
        }));

          setHospitaisExibidos(dadosCarrossel)
          console.log(hospitalFiltrado);
        } else {
          console.log("hospital não encontrado");
        }
      }
      else if(data.localizacao !== "" && data.nome == ""){
        // Buscar municípios do IBGE
      const resposta = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios');
      const municipios: Municipio[] = await resposta.json();

      // Encontrar município pelo nome (normalizando acentos)
      const municipio = municipios.find(
        (m) => normalizar(m.nome) === normalizar(data.localizacao)
      );

      if (!municipio) {
        setErro("Município não encontrado");
        return;
      }

      // Buscar hospitais CNES
      const respostaJSON = await fetch('/cnes_estabelecimentos.json');
      const respostaJS: Hospital[] = await respostaJSON.json();

      // Ajustar código IBGE para 6 dígitos
      const codigoCNES = String(Math.floor(municipio.id / 10));

      // Filtrar hospitais do município
      const hospitaisFiltrados = respostaJS.filter(hospital =>
        hospital.CO_IBGE === codigoCNES
      );
      const dadosCarrossel = hospitaisFiltrados.map(h => ({
        imagem: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f",
        nome: h.NO_FANTASIA || "Nome não informado",
        endereco: `${h.NO_LOGRADOURO || ""}, ${h.NU_ENDERECO || ""} - ${h.NO_BAIRRO || ""}`,
        lotacao: Math.floor(Math.random() * 100),
        cnes: h.CO_CNES
      }));

      setHospitaisExibidos(dadosCarrossel)
      console.log("Hospitais filtrados:", hospitaisFiltrados);
      }

      else if(data.localizacao !== "" && data.nome !== ""){
        const resposta = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios');
      const municipios: Municipio[] = await resposta.json();

      // Encontrar município pelo nome (normalizando acentos)
      const municipio = municipios.find(
        (m) => normalizar(m.nome) === normalizar(data.localizacao)
      );

      if (!municipio) {
        setErro("Município não encontrado");
        return;
      }
        const respostaJSON = await fetch('/cnes_estabelecimentos.json');
      const respostaJS: Hospital[] = await respostaJSON.json();

      // Ajustar código IBGE para 6 dígitos (CNES não tem dígito verificador)
      const codigoCNES = String(Math.floor(municipio.id / 10));

      // Filtrar hospitais do município
      const hospitaisFiltrados = respostaJS.filter(hospital =>
        hospital.CO_IBGE === codigoCNES && normalizar(hospital.NO_FANTASIA || "").includes(normalizar(data.nome))
      );
      const dadosCarrossel = hospitaisFiltrados.map(h => ({
        imagem: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f",
        nome: h.NO_FANTASIA || "Nome não informado",
        endereco: `${h.NO_LOGRADOURO || ""}, ${h.NU_ENDERECO || ""} - ${h.NO_BAIRRO || ""}`,
        lotacao: Math.floor(Math.random() * 100),
        cnes: h.CO_CNES
      }));

      setHospitaisExibidos(dadosCarrossel)
      console.log("Hospitais filtrados:", hospitaisFiltrados);
      }

    }
    catch{
      console.log("erro inesperado")
    }
  }

  
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
          <div className={estilos.titulo}>Busque pelo Hospital desejado!</div>

          <form onSubmit={handleSubmit(verificarEstabelecimento)}>
            <textarea className={estilos.areaTexto} {...register("localizacao")} placeholder="Digite o nome do municipio"></textarea>
          
            <textarea className={estilos.areaTexto} {...register("nome")} placeholder="Digite o nome do estabelecimento"></textarea>
            <button className={estilos.buscar} type="submit">Buscar</button>
          </form>

          {erro && <p style={{ color: 'red' }}>{erro}</p>}
          


        </div>
      </div>

      {hospitaisExibidos.length > 0 && (
        <CarrosselEsta 
          dados={hospitaisExibidos}
          
        />
      )}

    </div>
  );
}
