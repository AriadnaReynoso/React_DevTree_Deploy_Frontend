import { SocialNetwork, UserHandle } from "../types"

type HandleDataProps = {
    data: UserHandle
}

function HandleData({data}: HandleDataProps) {

    //parseando los links que vienen como string a un array de objetos y filtrando los que estan habilitados
    const links: SocialNetwork[] = JSON.parse(data.links).filter((link: SocialNetwork) => link.enabled)
    

  return (
    <div className="space-y-6 flex flex-col items-center justify-center text-white p-4">
        <p className="text-5xl text-center font-black">{data.handle}</p>
        {data.image && <img src={data.image} alt={data.name} className="max-w-[250px] mx-auto"/>}
        <p className="text-lg text-center font-bold">{data.description}</p>
        <div className="mt-20 flex flex-col gap-6">
            {links.length? 
            links.map((link) => (
                <a 
                key={link.id}
                className="bg-white px-5 py-2 items-center rounded-lg gap-5 text-slate-800 font-bold text-xl hover:bg-slate-200 transition-colors duration-200 ease-in-out flex justify-start"
                href={link.url}
                target="_blank"
                rel="noreferrer noopener"
                >
                    <img  className="w-12 h-12 " src={`/social/icon_${link.name}.svg`} alt="icono red social" />
                    <p>Visita mi: <span className="font-bold">{link.name}</span></p>
                </a>
            ))
            : <p className="text-xl italic text-center">No hay enlaces disponibles</p> }
        </div>
    </div>
  )
}

export default HandleData