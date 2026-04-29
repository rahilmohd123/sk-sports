import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const { adminInfo } = useSelector((state) => state.adminAuth);
  return adminInfo && adminInfo.isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
