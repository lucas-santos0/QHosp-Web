import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import estilos from "./CarrosselEsta.module.css";

interface ItemCarrossel {
  imagem?: string;
  nome: string;
  lotacao: number;
  endereco: string;
  cnes: string;
}

interface CarrosselProps {
  dados: ItemCarrossel[];
}

export function CarrosselEsta({ dados }: CarrosselProps) {
  const [slideAtual, setSlideAtual] = useState(0);
  const navigate = useNavigate();

  // garante que slideAtual nunca fique maior que o array quando dados mudarem
  useEffect(() => {
    if (dados.length === 0) {
      setSlideAtual(0);
    } else if (slideAtual >= dados.length) {
      setSlideAtual(0);
    }
  }, [dados, slideAtual]);

  const corLotacao = (valor: number) => {
    if (valor < 40) return "#4CAF50";
    if (valor < 70) return "#FFA500";
    return "#FF3B30";
  };

  const imagensHospitais = [
  "https://cdn.esbrasil.com.br/wp-content/uploads/2024/03/fachadaHEVV130711-1.jpg",
  "https://pesqsaude.com.br/wp-content/uploads/2024/01/5-melhores-hospitais-de-Belem-PesQsaude-Blog.png",
  "https://www.ismep.com.br/wp-content/uploads/2020/10/johns-hopkins-hospital.jpg",
  "https://www.ceara.gov.br/wp-content/uploads/2020/11/banner_CB_HGF_ProjetoHGF_16_11_2020-scaled-1-2048x1326.jpg",
  "https://www.mpce.mp.br/wp-content/uploads/2021/09/WhatsApp-Image-2021-09-20-at-18.09.26.jpeg"
];
  // prev / next com proteção para quando não houver dados
  const podeNavegar = dados.length > 0;

  const irPrev = () => {
    if (!podeNavegar) return;
    setSlideAtual((p) => (p - 1 + dados.length) % dados.length);
  };

  const irNext = () => {
    if (!podeNavegar) return;
    setSlideAtual((p) => (p + 1) % dados.length);
  };

  return (
    <div className={estilos.carrosselContainer}>
      <div className={estilos.carrossel}>
        <div
          className={estilos.slides}
          style={{ transform: `translateX(-${slideAtual * 100}%)` }}
        >
          {dados.map((item, index) => (
            <div
              key={item.cnes || index}
              className={estilos.slide}
              onClick={() => navigate(`/CadaHospital/${item.cnes}`)}
            >
              <img
                src={imagensHospitais[index % imagensHospitais.length]}
                className={estilos.imagemSlide}
              />

              <div className={estilos.informacoes}>
                <p className={estilos.nomeEstabelecimento}>{item.nome}</p>

                <div className={estilos.lotacaoWrapper}>
                  <span>Lotação: {item.lotacao}%</span>
                  <div className={estilos.barra}>
                    <div
                      className={estilos.barraPreenchida}
                      style={{
                        width: `${item.lotacao}%`,
                        backgroundColor: corLotacao(item.lotacao),
                      }}
                    />
                  </div>
                </div>

                <p className={estilos.endereco}>{item.endereco}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={irPrev}
          className={estilos.botaoNav}
          aria-label="Anterior"
          disabled={!podeNavegar}
        >
          ‹
        </button>

        <button
          onClick={irNext}
          className={estilos.botaoNav}
          aria-label="Próximo"
          disabled={!podeNavegar}
        >
          ›
        </button>
      </div>
    </div>
  );
}
