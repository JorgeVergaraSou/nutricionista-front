import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
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

  useEffect(() => {
    if (token) {
      try {
        const { exp } = JSON.parse(atob(token.split('.')[1]));
        const expirationDate = new Date(exp * 1000);
        const currentDate = new Date();

        if (expirationDate <= currentDate) {
          clearLocalStorage(UserKey);
          dispatch(resetUser());
          window.location.href = `${PublicRoutes.LOGIN}`;
        }
      } catch (error) {
        clearLocalStorage(UserKey);
        dispatch(resetUser());
        window.location.href = `${PublicRoutes.LOGIN}`;
      }
    }
  }, [location, token, dispatch]);

  if (!userState.name) {
    return <Navigate replace to={`${PublicRoutes.LOGIN}`} />;
  }

  return privateValidation ? <Outlet /> : <Navigate replace to={PrivateRoutes.PRIVATE} />;
};

export default AuthGuard;

/* import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
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

  console.log('AuthGuard se está ejecutando en la ruta:', location.pathname);

  useEffect(() => {
    console.log('useEffect en AuthGuard se ha disparado.');

    if (token) {
      try {
        const { exp } = JSON.parse(atob(token.split('.')[1]));
        const expirationDate = new Date(exp * 1000);
        const currentDate = new Date();

        console.log('Token expira en:', expirationDate);
        console.log('Fecha actual:', currentDate);

        if (expirationDate <= currentDate) {
          console.log('Token expirado. Redirigiendo al login.');
          clearLocalStorage(UserKey);
          dispatch(resetUser());
          window.location.href = PublicRoutes.LOGIN;
        }
      } catch (error) {
        console.error('Error al verificar el token:', error);
        clearLocalStorage(UserKey);
        dispatch(resetUser());
        window.location.href = PublicRoutes.LOGIN;
      }
    }
  }, [location, token, dispatch]);

  if (!userState.name) {
    console.log('Usuario no autenticado. Redirigiendo al login.');
    return <Navigate replace to={PublicRoutes.LOGIN} state={{ from: location }} />;
  }

  return privateValidation ? <Outlet /> : <Navigate replace to={PrivateRoutes.PRIVATE} />;
};

export default AuthGuard;
*/