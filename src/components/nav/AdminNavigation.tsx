import { useQueryClient } from "@tanstack/react-query"

export default function AdminNavigation() {

   const queryClient = useQueryClient()

    const logout = ()=>{
      localStorage.removeItem('AUTH_TOKEN')
      queryClient.invalidateQueries({queryKey:['user']})

    }
  return (
    <button
       className=" bg-lime-500 p-2 text-slate-800 uppercase font-black text-xs rounded-lg cursor-pointer caret-transparent hover:bg-lime-600 transition-colors duration-200 ease-in-out"
       onClick={logout}
    >
       Cerrar Sesión
    </button>
  )
}
