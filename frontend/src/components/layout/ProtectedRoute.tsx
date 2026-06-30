import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

export default function ProtectedRoute({ component: Component }: { component: any }) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Component />;
}
