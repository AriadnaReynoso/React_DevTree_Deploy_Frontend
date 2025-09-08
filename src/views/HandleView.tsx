import { useQuery } from "@tanstack/react-query"
import { Navigate, useParams } from "react-router-dom"
import { getUserByHandle } from "../api/DevTreeAPI"
import HandleData from "../components/HandleData"

function HandleView() {
  const params = useParams()
  const handle = params.handle!

  //cacheando la peticion con react query 
  const {data, error, isLoading} = useQuery({
    queryFn: () => getUserByHandle(handle),
    queryKey: ['handle', handle],
    retry: 1
  })

  if(isLoading) return <div className="flex items-center justify-center mt-40"><h1 className="text-4xl text-white text-center font-bold">Cargando...</h1></div>
  if(error) return <Navigate to='/404'/>

  if (data) return (
    <HandleData data={data}/>
  )
}

export default HandleView