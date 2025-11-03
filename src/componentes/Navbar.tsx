import estilos from './Navbar.module.css';
import logo from '../assets/logo.png';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

export function Navbar() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const navegação = useNavigate();

  useEffect(() => {
    async function buscarAdm() {
      const user = auth.currentUser;

      if (user) {
        const docRef = doc(db, "Usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setIsAdmin(data.adm === true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    }

    buscarAdm();
  }, []);

  async function deslogar() {
    try {
      await signOut(auth);
      navegação("/");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  }



  return (
    <div className={estilos.geral}>
      <div className={estilos.logo}>
        <img src={logo} alt="Logo" />
      </div>

      <div className={estilos.links}>

        {isAdmin ? (
          // Só mostra o link admin para admins
          <>
            <NavLink className={({ isActive }) => isActive ? estilos.linkActive : estilos.link} to={'/cadHospital'}>Cadastro de Hospital</NavLink>
            <NavLink className={({ isActive }) => isActive ? estilos.linkActive : estilos.link} to={'/editHospital'}>Editor de Hospital</NavLink>
          </>

        ) : (
          // Usuário normal vê os links padrão
          <>
            <NavLink className={({ isActive }) => isActive ? estilos.linkActive : estilos.link} to={'/inicial'}>Início</NavLink>
            <NavLink className={({ isActive }) => isActive ? estilos.linkActive : estilos.link} to={'/ficha'}>Prontuário</NavLink>
          </>
        )}

        <NavLink className={({ isActive }) => isActive ? estilos.linkActive : estilos.link} to={'/sobre'}>Sobre</NavLink>
        <NavLink className={({ isActive }) => isActive ? estilos.linkActive : estilos.link} to={'/contato'}>Contato</NavLink>
      </div>

      <div className={estilos.sair}>
        <button onClick={deslogar}>Sair</button>
      </div>
    </div>
  );
}
