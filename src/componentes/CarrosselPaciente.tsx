import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import estilos from './CarrosselEsta.module.css';

interface ItemCarrossel {
    id: string;
    nome: string;
    cpf: number;
    endereco: string;
}

interface CarrosselProps {
  dados: ItemCarrossel[];
}

export function CarrosselPaciente({ dados }: CarrosselProps) {
  const [slideAtual, setSlideAtual] = useState(0);
  const navigate = useNavigate();


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
              onClick={() => navigate(`/CadaPaciente/${item.id}`)}
            >
            
              <div className={estilos.informacoes}>
                <p className={estilos.nome}>{item.nome}</p>
                <p className={estilos.cpf}>{item.cpf}</p>
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
