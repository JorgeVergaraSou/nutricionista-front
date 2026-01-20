// src/App.tsx
import { Navigate, Route } from 'react-router-dom';
import { PrivateRoutes, PublicRoutes, Roles } from './models';
import { AuthGuard } from './guards';
import { Suspense, lazy } from 'react';
import RoleGuard from './guards/rol.guard';
import Admin from './pages/Private/Admin/Admin';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import UserPage from './pages/Private/User/User';
import ProfilePage from './pages/Private/Profile';
import RoutesWithNotFound from './utilities/RoutesWithNotFound.utility';
import GuestPage from './pages/Private/Guest/Guest';

import PrivateWrapper from './layouts/PrivateWrapper';
import BuscarPaciente from './pages/Private/Pacientes/BuscarPaciente';
import NuevoPaciente from './pages/Private/Pacientes/NuevoPaciente';
import AgendaTurnos from './pages/Private/Turnos/AgendaTurnos';

const Login = lazy(() => import('./pages/Login/Login'));
const Private = lazy(() => import('./pages/Private/Private'));

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Suspense fallback={<div>Loading...</div>}>        

        <RoutesWithNotFound>
          {/* Rutas públicas */}
          <Route path='/' element={<Navigate replace to={PrivateRoutes.PRIVATE} />} />
          <Route path={PublicRoutes.LOGIN} element={<Login />} />
          

          {/* Rutas privadas protegidas por AuthGuard */}
          <Route element={<AuthGuard privateValidation={true} />}>
            {/* Este Route envuelve TODAS las rutas privadas con el MainLayout (left menu) */}
            <Route element={<PrivateWrapper />}>
              <Route path={`${PrivateRoutes.PRIVATE}/*`} element={<Private />} />
              <Route path={PrivateRoutes.PERFIL} element={<ProfilePage />} />
              <Route path={PrivateRoutes.BUSCAR_PACIENTE} element={<BuscarPaciente/>} />
              <Route path={PrivateRoutes.NUEVO_PACIENTE} element={<NuevoPaciente/>} />
              <Route path={PrivateRoutes.AGENDA_TURNOS} element={<AgendaTurnos/>} />

              <Route element={<RoleGuard role={Roles.ADMIN} />}>
                <Route path={PrivateRoutes.ADMIN} element={<Admin />} />
              </Route>

              <Route element={<RoleGuard role={Roles.USER} />}>
                <Route path={PrivateRoutes.USER} element={<UserPage />} />
              </Route>

              <Route element={<RoleGuard role={Roles.GUEST} />}>
                <Route path={PrivateRoutes.GUEST} element={<GuestPage />} />
              </Route>

              <Route path={PrivateRoutes.LOGOUT} element={<Navigate replace to={PublicRoutes.LOGIN} />} />
            </Route>
          </Route>
        </RoutesWithNotFound>
      </Suspense>
    </LocalizationProvider>
  );
}

export default App;
