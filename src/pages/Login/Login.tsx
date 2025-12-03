import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { createUser } from '../../redux/states/user';
import { loginService } from '../../services/auth.service';
import { getRoleRoute } from '../../utilities';
import { PublicRoutes, Roles } from '../../models';

function Login() {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!emailInput || !passwordInput) {
      return setError('Todos los campos son obligatorios');
    }
    setLoading(true);
    setError('');
    try {
      const { token, email, role, name, idUser } = await loginService(emailInput, passwordInput);

      dispatch(createUser({ email, role, token, name, idUser }));

      const roleRoute = getRoleRoute(role as Roles);

      // Obtener la ruta de redirección de la query string
      const query = new URLSearchParams(location.search);
      const redirectPath = query.get('redirect') || roleRoute;

      navigate(redirectPath, { replace: true });
      
    } catch (error: any) {
      setError(error.message); // Mostrar el mensaje de error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>

        <div></div>

        <div>      
          <h2>LOGIN</h2>
          <form onSubmit={handleLogin} >
            <div>
              <label htmlFor='email' >
                Correo electrónico
              </label>
              <input
                name='email'
                id='email'               
                type='text'
                placeholder='email@email.com'
                onChange={(e) => setEmailInput(e.target.value)}
              />
              <label htmlFor='password'>
                Contraseña
              </label>
              <input
                name='password'
                id='password'
                type='password'
                placeholder='******'
                onChange={(e) => setPasswordInput(e.target.value)}
              />
            </div>
            <button type="submit" disabled={loading}>Entrar</button>
            <button onClick={() => navigate(`/${PublicRoutes.REGISTER}`)}>Registrarse</button>

            {error && <p>{error}</p>} {/* Mostrar el error */}
          </form>
        </div>
      </div>

      <div></div>

    </div>
  );
}

export default Login;