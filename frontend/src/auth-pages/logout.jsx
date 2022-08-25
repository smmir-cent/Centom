import axios from "axios";
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Filecontext } from './../Filecontext';
import { useContext } from 'react';

function Logout(props) {
    const navigate = useNavigate();
    const permission = useContext(Filecontext);

    function logMeOut() {
        axios({
            method: "POST",
            url: "/logout",
            headers: {
                Authorization: props.getToken()
            }
        })
            .then((response) => {
                props.removeToken()
                permission.setPermission(-1);
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                    console.log(error.response.status)
                    console.log(error.response.headers)
                }
            })
        props.removeToken()
    }
    useEffect(() => {
        logMeOut();
        navigate("/login");
    }, []);
    return
}

export default Logout;