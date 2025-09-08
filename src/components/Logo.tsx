import { Link } from 'react-router-dom'

export default function Logo() {
  return (
     <Link to="/">
        <img src="/logoDev.png" className="w-full block caret-transparent" alt="Logotipo Devtree" />
    </Link>
  )
}
