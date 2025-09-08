import {Link, useNavigate} from 'react-router-dom'
import { useForm } from "react-hook-form";
import ErrorMessage from '../components/ErrorMessage';
import { LoginForm } from '../types';
import api from '../config/axios';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';

export default function LoginView() {
    const navigate = useNavigate()
    const initialValues:LoginForm = {
        email:'',
        password:''
    }

    const {register,  handleSubmit, formState:{errors}} = useForm({defaultValues:initialValues})

    const handleLogin = async (formData : LoginForm)=>{
        try {
            const {data} = await api.post(`/auth/login`,formData )
            localStorage.setItem('AUTH_TOKEN', data)
            navigate('/admin')
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response?.data.error)
            }
        }

    }

    return(
        <>
            <h1 className='text-4xl font-semibold text-white text-center caret-transparent'>Iniciar Sesión</h1>
            <form onSubmit={handleSubmit(handleLogin)}
            className="bg-white px-5 py-20 rounded-lg space-y-10 mt-10"noValidate>
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="email" className="text-2xl text-slate-500 caret-transparent">E-mail</label>
                    <input
                    id="email"
                    type="email"
                    placeholder="Email de Registro"
                    className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                    {...register("email", {
                        required: "El Email es obligatorio",
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: "E-mail no válido",
                            },
                    })}
                    />
                    {errors.email && (
                    <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                </div>
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="password" className="text-2xl text-slate-500 caret-transparent">Password</label>
                    <input
                    id="password"
                    type="password"
                    placeholder="Password de Registro"
                    className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                    {...register("password", {
                        required: "El Password es obligatorio",
                    })}
                    />
                    {errors.password && (
                    <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                </div>

                <input
                type="submit"
                className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer hover:bg-cyan-500 transition-colors duration-200 ease-in-out caret-transparent hover:text-white"
                value='Iniciar Sesión'
                />
            </form>
            <nav className='mt-10'>
                <Link to="/auth/register" className='text-center font-semibold text-lg block caret-transparent underline text-lime-400 hover:text-lime-700  transition-colors duration-200 ease-in-out'>
                    Crear Cuenta
                </Link>
            </nav>
        </>
    )
}