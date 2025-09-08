import {useForm} from 'react-hook-form'
import ErrorMessage from '../components/ErrorMessage'
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { ProfileForm, User } from '../types'
import { updateProfile, uploadImage } from '../api/DevTreeAPI'
import { toast } from 'sonner'
import { useEffect, useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

export default function ProfileView() {
    const queryClient = useQueryClient()
    // Usasando useQuery con enabled: false para datos reactivos (suscribe a cambios en caché sin fetch)
    const { data: user } = useQuery<User>({
        queryKey: ['user'],
        enabled: false, // No intenta fetch, solo usa caché existente
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileForm>({
    defaultValues: {
      handle: user?.handle,
      description: user?.description || '',
    },
  });

  //Añadiendo useOutletContext para manejar la vista previa de la imagen desde el componente padre
  //Se usa useOutletContext para obtener setPreviewImage del componente padre Devtree y actualizar la vista previa de la imagen
  const { setPreviewImage } = useOutletContext<{ setPreviewImage: React.Dispatch<React.SetStateAction<string | null>> }>()

  
  // Añadiendo useState para manejar el archivo seleccionado y la URL de la vista previa localmente
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [currentPreviewUrl, setCurrentPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Resetear el formulario cuando los datos del usuario cambien (después de mutación)
  useEffect(() => {
    if (user) {
      reset({
        handle: user.handle,
        description: user.description,
      });
    }
  }, [user, reset]);

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onMutate: async (updatedUser: User) => {
      // Guardar los datos anteriores para rollback
      const previousUser = queryClient.getQueryData(['user']);

      // Actualizar la caché optimistamente
      queryClient.setQueryData(['user'], (prevData: User) => ({
        ...prevData,
        handle: updatedUser.handle,
        description: updatedUser.description,
        image: updatedUser.image, // Asegurarse de no perder la imagen
      }));

      return { previousUser };
    },
    onError: (error, _variables, context) => {
      // Revertir en caso de error
      queryClient.setQueryData(['user'], context?.previousUser);
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      // Opcional: Invalidar para sincronizar si hay fetch en otra parte de la app
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // Limpiando la vista previa y el input de archivo tras guardar exitosamente
      if (currentPreviewUrl) {
        URL.revokeObjectURL(currentPreviewUrl)
      }
      setCurrentPreviewUrl(null) // Limpiar la URL de vista previa localmente
      setPreviewImage(null) // Limpiar la vista previa en el componente padre
      setSelectedFile(null) // Limpiar el archivo seleccionado
      if (fileInputRef.current) {
        fileInputRef.current.value = '' // Limpiar el input de archivo
      }
    },
  });

    const uploadImageMutation = useMutation({
        mutationFn: uploadImage,
        onError: (error)=>{
            toast.error(error.message)
        }
    })


    const { mutateAsync: uploadImageAsync } = uploadImageMutation

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            // Manejar la selección del archivo y crear una URL de vista previa
            const file = e.target.files[0]
            setSelectedFile(file) // Guardar el archivo seleccionado

            const url = URL.createObjectURL(file) // Crear una URL de vista previa temporal local

            setCurrentPreviewUrl(url) // Guardar la URL de vista previa localmente
            setPreviewImage(url) // Actualizar la url de la vista previa en el componente padre
        }
    }

    const handleUserProfileForm = async (formdata: ProfileForm) =>{
        const cachedUser: User = queryClient.getQueryData(['user'])!
        // obtener los datos actuales del usuario caheados para no perder los que no se estan actualizando
        const updatedUser: User = {
        ...cachedUser, // Asegurarse de que no es undefined
        handle: formdata.handle,
        description: formdata.description,
        };
        //validar si hay un archivo seleccionado para subir
        if(selectedFile){
            try {
                //subiendo la imagen y obteniendo la url solo cuando se envia el formulario
            const url = await uploadImageAsync(selectedFile)
            if (typeof url === 'string') {
                updatedUser.image = url // Actualizar la URL de la imagen en los datos del usuario si la subida fue exitosa
            }
            } catch {
                return
            }
        }
        updateProfileMutation.mutate(updatedUser);
    }

    return (
        <form 
            className="bg-white p-10 rounded-lg space-y-5"
            onSubmit={handleSubmit(handleUserProfileForm)}
        >
            <legend className="text-2xl text-slate-800 text-center">Editar Información</legend>
            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="handle"
                >Handle:</label>
                <input
                    type="text"
                    className="border-none bg-slate-100 rounded-lg p-2"
                    placeholder="handle o Nombre de Usuario"
                    {...register('handle', {
                        required: "El nombre de usuario es obligatorio"
                    })}
                />
                {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>}
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="description"
                >Descripción:</label>
                <textarea
                    className="border-none bg-slate-100 rounded-lg p-2"
                    placeholder="Tu Descripción"
                    {...register('description', {
                        required: "La descripción es obligatoria"
                    })}
                />
                {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}

            </div>

            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="handle"
                >Imagen:</label>
                <input
                    id="image"
                    type="file"
                    name="handle"
                    className="border-none bg-slate-100 rounded-lg p-2"
                    accept="image/*"
                    onChange={handleChange}
                />
            </div>

            <input
                type="submit"
                className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer hover:bg-cyan-600 hover:text-white transition-colors duration-200 ease-in-out"
                value='Guardar Cambios'
            />
        </form>
    )
}