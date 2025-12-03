import { useSelector } from 'react-redux';
import { AppStore } from '../../../redux/store';


function UserPage() {
  const user = useSelector((state: AppStore) => state.user);

  return (
    <div>
      <h1>Bienvenido {user.name}</h1>
      <p>Correo: {user.email}</p>
      <p>Rol: {user.role}</p>
    </div>
  );
}

export default UserPage;
