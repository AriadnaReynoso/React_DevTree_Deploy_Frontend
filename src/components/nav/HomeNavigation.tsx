import { Link } from "react-router-dom"

export default function HomeNavigation() {
  return (
    <>
        <Link 
          to="/auth/login" 
          className=" bg-lime-500 p-2 text-slate-800 uppercase font-black text-xs rounded-lg cursor-pointer caret-transparent hover:bg-lime-600 transition-colors duration-200 ease-in-out">
            Iniciar Sesión
        </Link>
        <Link 
          to="/auth/register" 
          className=" bg-slate-200 p-2 text-slate-800 uppercase font-black text-xs rounded-lg cursor-pointer ml-5 caret-transparent hover:bg-slate-300 transition-colors duration-200 ease-in-out">
            Crear Cuenta
        </Link>
    </>
  )
}
