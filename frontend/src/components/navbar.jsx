import React from "react";
import '../bulma.min.css';
import useToken from './useToken'
import Login from '../pages/login';

const Navbar = () => {
    const { token, removeToken, setToken } = useToken();

    return (
        <>
            <div className="hero-head">
                <nav className="navbar">
                    <div className="container">

                        <div id="navbarMenuHeroA" className="navbar navbar-expand-lg navbar-light">
                            <div className="navbar-end">
                                <a href="/home" className="navbar-item">
                                    Home
                                </a>

                                {(!token && token !== "" && token !== undefined) ?

                                    (
                                        <>
                                            <a href="/profile" className="navbar-item">
                                                Profile
                                            </a>
                                        </>
                                    ) : {}}


                                {/* {% if current_user.is_authenticated %} */}
                                {/* {% endif %} */}
                                {/* {% if not current_user.is_authenticated %} */}
                                <a href="/login" className="navbar-item">
                                    Login
                                </a>
                                <a href="/sign-up" className="navbar-item">
                                    Sign Up
                                </a>
                                {/* {% endif %} */}

                                {/* {% if current_user.is_authenticated %} */}
                                <a href="/quick-scan" className="navbar-item">
                                    Quick Scan
                                </a>
                                {/* {% endif %} */}

                                {/* {% if current_user.is_authenticated %} */}
                                <a href="/logout" className="navbar-item">
                                    Logout
                                </a>
                                {/* {% endif %} */}
                            </div>
                        </div>
                    </div>
                </nav>
            </div>




        </>
    );
};

export default Navbar;