import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Login} from '../paginas/Login'
import {Cadastro} from '../paginas/Cadastro'
import {Sobre} from '../paginas/Sobre'
import {Contato} from '../paginas/Contato'
import { Inicial } from '../paginas/Inicial'   
import { Ficha_medica } from '../paginas/Ficha_medica' 
import { CadHospital } from '../paginas/CadHospital'
import { EditHospital } from '../paginas/EditHosptial'
import { Navbar } from '../componentes/Navbar'
import { Rodape } from '../componentes/Rodape'
import { Outlet } from 'react-router-dom';
import {EsqueceuSenha} from '../paginas/EsqueceuSenha'
import {RedefinirSenha} from '../paginas/RedefinirSenha'
import {CadaHospital} from '../paginas/CadaHospital';

//mostrar navbar
export function ComNavbar() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Outlet /> 
      </div>
      <Rodape />
    </div>
  );
}

export function Rotas(){
    return(
    <BrowserRouter>
      <Routes>

        {/* Rotas sem Navbar */}
        <Route path='/' element={< Login/>} />
        <Route path='/cadastro' element={<Cadastro />} />
        <Route path='/esqueceuSenha' element={<EsqueceuSenha/>} />
        <Route path='/redefinirSenha' element={<RedefinirSenha/>} />
        
        {/* Rotas com Navbar */}
        <Route element={<ComNavbar />} >
          <Route path='/inicial' element={<Inicial/>} />
          <Route path='/sobre' element={<Sobre />} />
          <Route path='/contato' element={<Contato/>} />
          <Route path='/cadHospital' element={<CadHospital/>} />
          <Route path='/editHospital' element={<EditHospital/>} />
          <Route path='/ficha' element={<Ficha_medica/>} />
          <Route path="/CadaHospital/:id" element={<CadaHospital />} />
        </Route>
      </Routes>
    </BrowserRouter>
    )
}