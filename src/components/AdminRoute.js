import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const { currentUser } = useAuth();
  
  // Lista de correos electrónicos permitidos
  const ALLOWED_EMAILS = [
    'herrerajaviersoto@gmail.com',  // Reemplaza con el primer correo permitido
    'albelcorlione@gmail.com'   // Reemplaza con el segundo correo permitido
  ];

  // Si no hay usuario autenticado, redirigir al login
  if (!currentUser) {
    return <Navigate to="/iniciar-sesion" state={{ from: window.location.pathname }} replace />;
  }

  // Si el correo no está en la lista de permitidos, redirigir al inicio
  if (!ALLOWED_EMAILS.includes(currentUser.email)) {
    return <Navigate to="/" replace />;
  }

  // Si el usuario está autenticado y tiene un correo permitido, mostrar el contenido
  return children;
}
