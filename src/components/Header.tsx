import { useSelector } from "react-redux";
import { AppStore } from "../redux/store";
import DropdownMenu from "./NavBars/DropdownMenu";

function Header() {
    const user = useSelector((state: AppStore) => state.user);

    const isAuthenticated = user && user.token;

    return (
        <>
            <header>
                {isAuthenticated && <DropdownMenu />}
            </header>
        </>
    );
}

export default Header;
