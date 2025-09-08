import { Link, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy,arrayMove } from "@dnd-kit/sortable";
import NavigationTabs from "./NavigationTabs";
import { SocialNetwork, User } from "../types";
import { useEffect, useState } from "react";
import DevtreeLink from "./DevtreeLink";
import { useQueryClient } from "@tanstack/react-query";
import Header from "./Header";

type DevtreePorpops = {
    data: User
}

export default function Devtree({data}:DevtreePorpops) {

    //añadiendo useState para manejar los enlaces habilitados y la vista previa de la imagen
    const [enabledLinks, setEnabledLinks] = useState<SocialNetwork[]>(JSON.parse(data.links).filter((item: SocialNetwork) => item.enabled))
    //añadiendo useState para manejar la url de la vista previa de la imagen
    const [previewImage, setPreviewImage] = useState<string | null>(null)

    useEffect(() => {
        //actualizar los enlaces habilitados cuando cambien los datos del usuario
        setEnabledLinks(JSON.parse(data.links).filter((item: SocialNetwork) => item.enabled))
    }, [data.links])

    const queryClient = useQueryClient()

    function handleDragEnd(e: DragEndEvent) {
        
        const {active, over} = e

        if(over && over.id){
            //encontrar la posicion del elemento que se arrastro y el elemento sobre el que se soltó respecto al array original
             const prevIndex = enabledLinks.findIndex(link => link.id === active.id)
            const newIndex = enabledLinks.findIndex(link => link.id === over.id)

            //reordenar el array
            const order = arrayMove(enabledLinks, prevIndex, newIndex)
            setEnabledLinks(order)

            //recuperar los enlaces deshabilitados
            const disabledLinks: SocialNetwork[] = JSON.parse(data.links).filter((item: SocialNetwork) => !item.enabled)

            //unir los enlaces habilitados y deshabilitados
            const links = [...order, ...disabledLinks]

            //actualizar el cache de react query con el nuevo orden
            queryClient.setQueryData(['user'], (prevData : User) => {
                return {
                    ...prevData,
                    links: JSON.stringify(links)
                }
            })
        }

       
    }

    return(
        <>
            <Header/>
            <div className="bg-gray-100  min-h-screen py-10">
                <main className="mx-auto max-w-5xl p-10 md:p-0">
                    <NavigationTabs/>
                    
                    <div className="flex justify-end">
                        <Link 
                            className="text-slate-800 font-bold text-xl "
                            to={`/admin/${data.handle}`}
                            target="_blank"
                            rel="noreferrer noopener"
                        >Visitar Mi Perfil: <span className="text-lime-500 hover:underline hover:text-lime-600">/{data.handle}</span></Link>
                    </div>

                    <div className="flex flex-col md:flex-row gap-10 mt-10">
                        <div className="flex-1 ">
                            {/* pasando setPreviewImage como contexto al outlet para manejar la vista previa de la imagen */}
                            <Outlet context={{setPreviewImage}}/>
                        </div>
                        <div className="w-full md:w-96 bg-slate-800 px-5 py-10 space-y-6">
                            <p className="text-4xl text-center text-white">{data.handle}</p>
                            {/* mostrando la vista previa de la imagen si existe, sino la imagen del usuario */}
                            {(previewImage || data.image) && 
                                <img src={previewImage ?? data.image} alt="Imagen de Perfil" className="mx-auto max-w-[250px" />
                            }

                            <p className="text-lg text-center text-white font-black">{data.description}</p>

                            <DndContext
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                            <div className="mt-20 flex flex-col gap-5">
                                <SortableContext
                                    //pasando los elementos a ordenar
                                    items={enabledLinks}
                                    //pasando la estrategia de ordenamiento vertical
                                    strategy={verticalListSortingStrategy}
                                >
                                    {enabledLinks.map(link =>(
                                    <DevtreeLink key={link.name} item={link}/>
                                ))}
                                </SortableContext>
                            </div>

                            </DndContext>
                        </div>
                    </div>
                </main>
            </div>
            <Toaster position="top-right" />
        </>
    )
}
