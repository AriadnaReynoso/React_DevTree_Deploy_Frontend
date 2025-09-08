import { useEffect, useState } from "react"
import { social } from "../data/social"
import DevTreeInput from "../components/DevTreeInput"
import { isValidUrl } from "../utils"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProfile } from "../api/DevTreeAPI"
import { User } from "../types"
import { SocialNetwork } from '../types/index';

export default function LinkTreeView() {
    const [devTreeLinks, setDevTreeLinks] = useState(social)

    // obtener datos del usuario caheados para enviarlos en la mutacion y actualizar los links
    const queryClient = useQueryClient()
    // forzando que user no sea undefined
    const user : User = queryClient.getQueryData(['user'])!
    const {mutate} = useMutation({
        mutationFn: updateProfile,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
        }
    })

    useEffect(() => {
        //actualizar el estado de los enlaces con los datos del usuario caheados
        // parseando el string de links a un array de objetos
        // actualizando solo los enlaces que esten en el array de links del usuario
        const updatedData = devTreeLinks.map(item => {
            const userLink = JSON.parse(user.links).find((link : SocialNetwork) => link.name === item.name)
            if (userLink) {
                return { ...item, url: userLink.url, enabled: userLink.enabled }
            }
            return item
        })

        setDevTreeLinks(updatedData)
    }, [])
    
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedLinks = devTreeLinks.map(link => link.name === e.target.name ? { ...link, url: e.target.value } : link) // agregando al campo de url el nuevo valor y actualizando solo el enlace que cambio
        setDevTreeLinks(updatedLinks)

    }

    const links : SocialNetwork[] = JSON.parse(user.links)

    const handleEnabledLink = (socialNetwork: string) => {
        const updatedLinks = devTreeLinks.map(link => {
            if (link.name === socialNetwork){
                    if(isValidUrl(link.url)){
                        return { ...link, enabled: !link.enabled } // despues de validar la url pasando al valor contrario del booleano link 
                    }else{
                        toast.error('Url no válida')
                    }
            }
            return link

        }) // pasando al valor contrario del booleano enabled

        setDevTreeLinks(updatedLinks)

        // si el enlace fue habilitado, agregarlo al array de links del usuario
        // si el enlace fue deshabilitado, eliminarlo del array de links del usuario
        
        let updatedItems: SocialNetwork[] = []

        const selectedSocialNetwork = updatedLinks.find(link => link.name === socialNetwork)
        if(selectedSocialNetwork?.enabled){
            
            const id = links.filter(link => link.id).length + 1
            if (links.some(link => link.name === socialNetwork)) {
                //usando some para verificar si el enlace ya existe en el array
                //evitar duplicados
                updatedItems = links.map(link => {
                    if (link.name === socialNetwork) {
                        return { ...link, enabled: true, id: id } // actualizar el enlace existente
                        // asignando un id nuevo para que no haya conflictos en el backend
                    }else{
                        return link
                    }
                })
            }else{
                const newItem = {
                ...selectedSocialNetwork,
                id: links.length + 1 // generando un id para el nuevo enlace
                }    
                updatedItems = [...links, newItem]
            }
           
        }else{
            // buscar el indice del enlace a actualizar
            const indexToUpdate = links.findIndex(link => link.name === socialNetwork) 
            
            updatedItems = links.map(link => {
                if (link.name === socialNetwork) {
                    return { 
                        ...link,
                        id: 0, // poner el id en 0 para que no se tome en cuenta en el backend y se elimine 
                        enabled: false }
                // actualizar los ids de los enlaces que estan despues del enlace eliminado        
                } else if(link.id > indexToUpdate && (indexToUpdate !== 0 && link.id === 1)){
                    return {
                        ...link,
                        id: link.id - 1 // actualizar los ids de los enlaces que estan despues del enlace eliminado
                    }
                }else{
                    return link
                }
            })
        }

        // obtener los datos actuales del usuario caheados y actualizar solo el campo de links
        // guardando los links como un string en formato JSON
        queryClient.setQueryData(['user'], (prevData: User) => {
            return{
                ...prevData,
                links: JSON.stringify(updatedItems)
            }
        })
    }

    return(
        <div className="scpace-y-5">
            {devTreeLinks.map((item) => (
                <DevTreeInput
                    key={item.name}
                    item={item}
                    handleUrlChange={handleUrlChange}
                    handleEnabledLink={handleEnabledLink}
                />
            ))}
            <button 
                className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer hover:bg-cyan-600 hover:text-white transition-colors duration-200 ease-in-out"
                onClick={
                    //que se obtengan los datos actuales del usuario caheados y se envien en la mutacion
                    () => mutate(queryClient.getQueryData(['user'])!)
                }
            >Guardar Cambios</button>
        </div>
    )
}