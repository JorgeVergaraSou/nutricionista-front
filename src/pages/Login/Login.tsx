import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { createUser } from "../../redux/states/user";
import { loginService } from "../../services/auth.service";
import { getRoleRoute } from "../../utilities";
import { Roles } from "../../models";
import "@css/Login.css";

function Login() {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!emailInput || !passwordInput) {
      return setError("Todos los campos son obligatorios");
    }

    setLoading(true);
    setError("");

    try {
      const { token, email, role, name, idUser } = await loginService(
        emailInput,
        passwordInput
      );

      dispatch(createUser({ email, role, token, name, idUser }));

      const roleRoute = getRoleRoute(role as Roles);
      const query = new URLSearchParams(location.search);
      const redirectPath = query.get("redirect") || roleRoute;

      navigate(redirectPath, { replace: true });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      {/* Columna izquierda con imagen */}
      <div className="login-left">
        <h1 className="big-title">Bienestar & Nutrición</h1>
        <p className="subtitle">Sistema para nutricionistas</p>
      </div>

      {/* Columna derecha con formulario */}
      <div className="login-right">
        <div className="form-box">
          <h2 className="form-title">Iniciar sesión</h2>

          <form onSubmit={handleLogin}>
            <label htmlFor="email">Correo electrónico</label>
            <input
              name="email"
              id="email"
              type="email"
              placeholder="email@email.com"
              onChange={(e) => setEmailInput(e.target.value)}
            />

            <label htmlFor="password">Contraseña</label>
            <input
              name="password"
              id="password"
              type="password"
              placeholder="******"
              onChange={(e) => setPasswordInput(e.target.value)}
            />

            {error && <p className="error-msg">{error}</p>}

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? "Ingresando..." : "Entrar"}
            </button>


          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
