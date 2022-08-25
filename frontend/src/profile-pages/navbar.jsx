import React from "react";
import '../bulma.min.css';
import { useContext } from 'react';
import { Filecontext } from './../Filecontext';
import { Link } from "react-router-dom";
function Navbar(props) {
    const permission = useContext(Filecontext);
    return (
        <>
            <div className="hero-head">
                <nav className="navbar">
                    <div className="container">

                        <div id="navbarMenuHeroA" className="navbar navbar-expand-lg navbar-light">
                            <div className="navbar-end">
                                <Link to="/home" className="navbar-item">
                                    Home
                                </Link>

                                {(permission.permission === -1) ?
                                    (
                                        <>
                                            <Link to="/login" className="navbar-item">
                                                Login
                                            </Link>
                                        </>
                                    ) : <></>}
                                {(permission.permission > 1) ? (
                                    <Link to="/register" className="navbar-item">
                                        Register
                                    </Link>) : <></>}
                                {(permission.permission > -1) ?
                                    (
                                        <>
                                            <Link to="/quick-scan" className="navbar-item">
                                                Quick Scan
                                            </Link>
                                        </>
                                    ) : <></>}

                                {(permission.permission > 1) ?
                                    (
                                        <>
                                            <Link to="/net-discovery" className="navbar-item">
                                                Net Discovery
                                            </Link>
                                        </>
                                    ) : <></>}

                                {(permission.permission > 1) ?
                                    (
                                        <>
                                            <Link to="/net-config" className="navbar-item">
                                                Network Config
                                            </Link>
                                        </>
                                    ) : <></>}

                                {(permission.permission > 0) ?
                                    (
                                        <>
                                            <Link to="/monitoring" className="navbar-item">
                                                Monitoring
                                            </Link>
                                        </>
                                    ) : <></>}

                                {(permission.permission > 0) ?
                                    (
                                        <>
                                            <Link to="/notification" className="navbar-item">
                                                Notification
                                            </Link>
                                        </>
                                    ) : <></>}

                                {(permission.permission !== -1) ?
                                    (
                                        <>
                                            <Link to="/logout" className="navbar-item">
                                                Logout
                                            </Link>
                                        </>
                                    ) : <></>}
                                {/* todo: add "about" page */}

                            </div>
                        </div>
                    </div>
                </nav>
            </div>




        </>
    );
};

export default Navbar;