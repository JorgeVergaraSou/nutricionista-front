import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { PrivateRoutes } from '../models';
import { AppStore } from '../redux/store';
import { Props } from '../interfaces/roles.interface';

function RoleGuard({ role }: Props) {
  const userState = useSelector((store: AppStore) => store.user);
  return userState.role === role ? <Outlet /> : <Navigate replace to={PrivateRoutes.PRIVATE} />;
}
export default RoleGuard;