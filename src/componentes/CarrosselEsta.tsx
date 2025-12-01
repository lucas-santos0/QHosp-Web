import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import estilos from './CarrosselEsta.module.css';

interface ItemCarrossel {
  imagem: string;
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

  const corLotacao = (valor: number) => {
    if (valor < 40) return "#4CAF50";
    if (valor < 70) return "#FFA500";
    return "#FF3B30";
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
              key={index}
              className={estilos.slide}
              onClick={() => navigate(`/CadaHospital/${item.cnes}`)}
            >
              <img src={item.imagem} className={estilos.imagemSlide} />

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
          onClick={() =>
            setSlideAtual((p) => (p - 1 + dados.length) % dados.length)
          }
          className={estilos.botaoNav}
        >
          ‹
        </button>

        <button
          onClick={() => setSlideAtual((p) => (p + 1) % dados.length)}
          className={estilos.botaoNav}
        >
          ›
        </button>
      </div>
    </div>
  );
}
