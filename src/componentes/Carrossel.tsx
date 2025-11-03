import { useState, useEffect } from 'react';
import estilos from './Carrossel.module.css';

interface CarrosselProps {
  imagens: string[];
  autoplay?: boolean;
  intervalo?: number;
}

export function Carrossel({ imagens, autoplay = true, intervalo = 3000 }: CarrosselProps) {
  const [slideAtual, setSlideAtual] = useState(0);

  useEffect(() => {
    if (!autoplay || imagens.length <= 1) return;

    const timer = setInterval(() => {
      setSlideAtual((prev) => (prev + 1) % imagens.length);
    }, intervalo);

    return () => clearInterval(timer);
  }, [autoplay, intervalo, imagens.length]);

  const proximoSlide = () => {
    setSlideAtual((prev) => (prev + 1) % imagens.length);
  };

  const slideAnterior = () => {
    setSlideAtual((prev) => (prev - 1 + imagens.length) % imagens.length);
  };

  const irParaSlide = (index: number) => {
    setSlideAtual(index);
  };

  if (imagens.length === 0) {
    return (
      <div className={estilos.carrosselContainer}>
        <div className={estilos.semImagens}>
          <p>Nenhuma imagem disponível</p>
        </div>
      </div>
    );
  }

  return (
    <div className={estilos.carrosselContainer}>
      <div className={estilos.carrossel}>
        <div 
          className={estilos.slides}
          style={{ transform: `translateX(-${slideAtual * 100}%)` }}
        >
          {imagens.map((imagem, index) => (
            <div key={index} className={estilos.slide}>
              <img 
                src={imagem} 
                alt={`Slide ${index + 1}`}
                className={estilos.imagemSlide}
              />
            </div>
          ))}
        </div>

        {/* Botões de navegação */}
        <button 
          className={`${estilos.botaoNav} ${estilos.botaoAnterior}`}
          onClick={slideAnterior}
          aria-label="Slide anterior"
        >
          &#8249;
        </button>
        
        <button 
          className={`${estilos.botaoNav} ${estilos.botaoProximo}`}
          onClick={proximoSlide}
          aria-label="Próximo slide"
        >
          &#8250;
        </button>

        {/* Indicadores */}
        {imagens.length > 1 && (
          <div className={estilos.indicadores}>
            {imagens.map((_, index) => (
              <button
                key={index}
                className={`${estilos.indicador} ${
                  index === slideAtual ? estilos.indicadorAtivo : ''
                }`}
                onClick={() => irParaSlide(index)}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
