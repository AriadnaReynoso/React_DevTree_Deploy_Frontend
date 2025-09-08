import { useQuery } from "@tanstack/react-query";
import { Navigate} from "react-router-dom";
import { getUser } from "../api/DevTreeAPI";
import Devtree from "../components/Devtree";

export default function AppLayout() {

    const { data, isLoading, isError} = useQuery({
        queryFn: getUser,
        queryKey: ['user'],
        retry: 1,
        refetchOnWindowFocus: false
    })


    //validaciones cuando no exista un token
    if (isLoading) return 'Cargando...'

    //por si intentan entrar a admin a la fuerza
    if (isError){
        return <Navigate to={'/'}/>
    }
    

    if (data) return (
        <Devtree data={data}/>
    )
}