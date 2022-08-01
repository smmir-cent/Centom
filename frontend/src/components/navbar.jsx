import React from "react";
import '../bulma.min.css';
import useToken from './useToken'
import Login from '../pages/login';

const Navbar = () => {
    const { token, removeToken, setToken } = useToken();

    return (
        <>
            <div class="hero-head">
                <nav class="navbar">
                    <div class="container">

                        <div id="navbarMenuHeroA" class="navbar navbar-expand-lg navbar-light">
                            <div class="navbar-end">
                                <a href="/home" class="navbar-item">
                                    Home
                                </a>

                                {(!token && token !== "" && token !== undefined) ?

                                    (
                                        <>
                                            <a href="/profile" class="navbar-item">
                                                Profile
                                            </a>
                                        </>
                                    ) : {}}


                                {/* {% if current_user.is_authenticated %} */}
                                {/* {% endif %} */}
                                {/* {% if not current_user.is_authenticated %} */}
                                <a href="/login" class="navbar-item">
                                    Login
                                </a>
                                <a href="/sign-up" class="navbar-item">
                                    Sign Up
                                </a>
                                {/* {% endif %} */}

                                {/* {% if current_user.is_authenticated %} */}
                                <a href="/quick-scan" class="navbar-item">
                                    Quick Scan
                                </a>
                                {/* {% endif %} */}

                                {/* {% if current_user.is_authenticated %} */}
                                <a href="/Logout" class="navbar-item">
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