import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const UserContext = React.createContext(null);

const UserProvider = ({ children }) => {
    const [user, setUser] = useState({});

    const loginContext = (data) => {
        setUser(data);
    };

    const logoutContext = () => {
        Cookies.remove("jwt");
        setUser({});
    };

    useEffect(() => {
        const jwtToken = Cookies.get("jwt");
        if (jwtToken && jwtToken !== "undefined") {
            const decoded = jwtDecode(jwtToken);
            setUser(decoded);
        } else {
            setUser({})
        }
    }, []);

    return <UserContext.Provider value={{ user, setUser, loginContext, logoutContext }}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
