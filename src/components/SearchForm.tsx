import { useForm } from "react-hook-form";
import slugify from 'react-slugify';
import ErrorMessage from "./ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { searchByHandle } from "../api/DevTreeAPI";
import { Link } from "react-router-dom";

export default function SearchForm() {
   const {register, formState:{errors}, watch, handleSubmit} = useForm({
    defaultValues:{
        handle: ""
    }
});

    const mutation = useMutation({
        mutationFn: searchByHandle,

    })

    console.log(mutation)

    //utilizando watch para obtener el valor del input en tiempo real
    const handle = watch("handle")
    const handleSearch = () => {
        const slug = slugify(handle);
        mutation.mutate(slug)
    }
  return (
    <form 
        onSubmit={handleSubmit(handleSearch)} 
        className="space-y-5 mt-10">
      <div className="relative flex items-center  bg-white px-2 ">
        <label htmlFor="handle">devtree.com/</label>
        <input
          type="text"
          id="handle"
          className="border-none bg-transparent p-2 focus:ring-0 flex-1 "
          placeholder="elonmusk, zuck, jeffbezos"
          {...register("handle", {
            required: "Un Nombre de Usuario es obligatorio",
          })}
        />
      </div>
      {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>}

      <div className="mt-10">
        {mutation.isPending && <p className="text-center">Cargando...</p>}
        {mutation.isError && <p className="text-center text-red-600 font-bold caret-transparent">{mutation.error.message}</p>}
        {mutation.data && <p className="text-center text-cyan-500 font-bold caret-transparent">{mutation.data} ir a <Link to={`/auth/register`} className="underline text-lime-500 hover:text-lime-600 transition-colors duration-200 ease-in-out caret-transparent" state={{handle: slugify(handle)}}>Crear Cuenta</Link></p>}
      </div>

      <input
        type="submit"
        className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer hover:bg-cyan-500 transition-colors duration-200 ease-in-out hover:text-white caret-transparent"
        value="Obtener mi DevTree"
      />
    </form>
  );
}
