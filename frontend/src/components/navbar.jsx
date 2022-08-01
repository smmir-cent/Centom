import React from "react";
import '../bulma.min.css';
import useToken from './useToken'
import Login from '../pages/login';

const Navbar = () => {
    const { token, removeToken, setToken, getToken } = useToken();

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
                                {/* {console.log(getToken())} */}
                                {(getToken()) ?
                                    (
                                        <>
                                            <a href="/profile2" className="navbar-item">
                                                Profile
                                            </a>
                                        </>
                                    ) : <></>}


                                {(!getToken()) ?
                                    (
                                        <>
                                            <a href="/login" className="navbar-item">
                                                Login
                                            </a>
                                        </>
                                    ) : <></>}

                                <a href="/sign-up" className="navbar-item">
                                    Sign Up
                                </a>
                                {(getToken()) ?
                                    (
                                        <>
                                            <a href="/quick-scan" className="navbar-item">
                                                Quick Scan
                                            </a>
                                        </>
                                    ) : <></>}

                                {(getToken()) ?
                                    (
                                        <>
                                            <a href="/logout" className="navbar-item">
                                                Logout
                                            </a>
                                        </>
                                    ) : <></>}

                            </div>
                        </div>
                    </div>
                </nav>
            </div>




        </>
    );
};

export default Navbar;