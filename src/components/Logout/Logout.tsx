import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetUser, UserKey } from '../../redux/states/user';
import { clearLocalStorage } from '../../utilities';
import { PublicRoutes } from '../../models';

function useLogout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logOut = () => {
    clearLocalStorage(UserKey);
    dispatch(resetUser());
    navigate(PublicRoutes.LOGIN, { replace: true });
  };

  return logOut;
}

export default useLogout;
