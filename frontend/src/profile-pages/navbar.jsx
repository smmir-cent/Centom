import React from "react";
import '../bulma.min.css';

function Navbar(props) {
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
                                {(props.getToken()) ?
                                    (
                                        <>
                                            <a href="/profile" className="navbar-item">
                                                Profile
                                            </a>
                                        </>
                                    ) : <></>}


                                {(!props.getToken()) ?
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
                                {(props.getToken()) ?
                                    (
                                        <>
                                            <a href="/quick-scan" className="navbar-item">
                                                Quick Scan
                                            </a>
                                        </>
                                    ) : <></>}

                                {(props.getToken()) ?
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