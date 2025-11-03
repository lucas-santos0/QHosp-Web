import estilos from './Sobre.module.css'


export function Sobre() {

  return (
    <div className={estilos.tudo}>
      {/* Banner principal azul */}
      <div className={estilos.bannerPrincipal}>
        <div className={estilos.bannerContent}>
          <div className={estilos.bannerText}>
            <h1 className={estilos.bannerTitle}>QHosp</h1>
            <p className={estilos.bannerSubtitle}>
              Transformando a gestão hospitalar e melhorando o acesso à saúde pública no Brasil
            </p>
            
            <div className={estilos.bannerStats}>
              </div>
          </div>
        </div>
      </div>

      {/* Seção de conteúdo */}
      <div className={estilos.conteudoSection}>
        <h2 className={estilos.sectionTitle}>Sobre o Projeto</h2>
        
        <div className={estilos.conteudoGrid}>
          <div className={estilos.conteudoCard}>
            <h3 className={estilos.cardTitle}>Missão</h3>
            <p className={estilos.cardText}>
              Contribuir para a melhoria da organização hospitalar, reduzindo a superlotação 
              e facilitando o dia a dia de quem precisa frequentar esses ambientes.
            </p>
          </div>

          <div className={estilos.conteudoCard}>
            <h3 className={estilos.cardTitle}>Plataforma</h3>
            <p className={estilos.cardText}>
              Site voltado à gestão hospitalar e aplicativo direcionado ao suporte ao paciente, 
              oferecendo informações úteis para uma tomada de decisão mais consciente.
            </p>
          </div>

          <div className={estilos.conteudoCard}>
            <h3 className={estilos.cardTitle}>Benefícios</h3>
            <p className={estilos.cardText}>
              Reduzir deslocamentos desnecessários, aumentar a satisfação dos usuários, 
              otimizar a gestão hospitalar e oferecer dados atualizados sobre ocupação e serviços.
            </p>
          </div>
        </div>
      </div>

      {/* Seção da equipe */}
      <div className={estilos.equipeSection}>
        <div className={estilos.equipeContent}>
          <h2 className={estilos.equipeTitle}>Nossa Equipe</h2>
          
          <div className={estilos.equipeGrid}>
            <div className={estilos.cardMembro}>
              <div className={estilos.fotoMembro}>
                <div className={estilos.placeholderFoto}>LM</div>
              </div>
              <h3 className={estilos.nomeMembro}>Lucas Maurício</h3>
              <p className={estilos.cargoMembro}>Desenvolvedor</p>
            </div>

            <div className={estilos.cardMembro}>
              <div className={estilos.fotoMembro}>
                <div className={estilos.placeholderFoto}>LS</div>
              </div>
              <h3 className={estilos.nomeMembro}>Lucas Santos</h3>
              <p className={estilos.cargoMembro}>Desenvolvedor</p>
            </div>

            <div className={estilos.cardMembro}>
              <div className={estilos.fotoMembro}>
                <div className={estilos.placeholderFoto}>MP</div>
              </div>
              <h3 className={estilos.nomeMembro}>Mariana Patrício</h3>
              <p className={estilos.cargoMembro}>Desenvolvedora</p>
            </div>

            <div className={estilos.cardMembro}>
              <div className={estilos.fotoMembro}>
                <div className={estilos.placeholderFoto}>OA</div>
              </div>
              <h3 className={estilos.nomeMembro}>Olivia Atanagildo</h3>
              <p className={estilos.cargoMembro}>Desenvolvedora</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}