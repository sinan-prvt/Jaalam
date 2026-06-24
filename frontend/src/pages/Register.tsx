import { Navigate } from 'react-router-dom';

export default function Register() {
  // Since we only use Google Auth, Registration and Login are the same flow.
  return <Navigate to="/login" replace />;
}
