import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PrivateRoutes, PublicRoutes } from '../models';
import { AppStore } from '../redux/store';
import { Props } from '../interfaces/guard.interface';
import { clearLocalStorage } from '../utilities';
import { UserKey, resetUser } from '../redux/states/user';

export const AuthGuard = ({ privateValidation }: Props) => {
  const userState = useSelector((store: AppStore) => store.user);
  const token = useSelector((store: AppStore) => store.user.token);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate(); // <-- usar navigate

  useEffect(() => {
    if (token) {
      try {
        const { exp } = JSON.parse(atob(token.split('.')[1]));
        const expirationDate = new Date(exp * 1000);
        const currentDate = new Date();

        if (expirationDate <= currentDate) {
          clearLocalStorage(UserKey);
          dispatch(resetUser());
          navigate(PublicRoutes.LOGIN, { replace: true }); // <- usar navigate
        }
      } catch (error) {
        clearLocalStorage(UserKey);
        dispatch(resetUser());
        navigate(PublicRoutes.LOGIN, { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, token, dispatch, navigate]);

  if (!userState.name) {
    return <Navigate replace to={PublicRoutes.LOGIN} />;
  }

  return privateValidation ? <Outlet /> : <Navigate replace to={PrivateRoutes.PRIVATE} />;
};

export default AuthGuard;
