import { useState } from 'react';
import axios from "axios";
import useToken from '../components/useToken'

function Login(props) {

    const [loginForm, setloginForm] = useState({
        email: "",
        password: "",
        is_remember: "off",
        message: ""
    })
    const { token, removeToken, setToken, getToken } = useToken();

    function loginButton(event) {
        axios({
            method: "POST",
            url: "/login",
            data: {
                email: loginForm.email,
                password: loginForm.password,
                is_remember: loginForm.is_remember,
            }
        })
            .then((response) => {
                if (response.data.access_token) {
                    props.setToken(response.data.access_token)
                    setToken(response.data.access_token)
                    token = response.data.access_token
                }
            }).catch((error) => {
                if (error.response) {
                    updateErrMsg(error.response.data.message)
                    console.log(error.response)
                    console.log(error.response.status)
                    console.log(error.response.headers)
                }
            })

        setloginForm(({
            email: "",
            password: "",
            is_remember: false,
            message: ""
        }))

        event.preventDefault()
    }
    const updateErrMsg = (msg) => {
        setloginForm(previousState => {
            return { ...previousState, message: msg }
        });
    }
    function handleChange(event) {
        const { value, name } = event.target
        setloginForm(prevNote => ({
            ...prevNote, [name]: value
        })
        )
    }

    return (
        <div className="column is-4 is-offset-4">
            <h3 className="title">Login</h3>
            <div className="box">

                <div className={loginForm.message ? "notification is-danger" : ""}>{loginForm.message ? loginForm.message : ""}</div>



                <form className="login">
                    <div className="field">
                        <div className="control">
                            <input onChange={handleChange} className="input is-large" type="email" name="email" placeholder="Your Email" autoFocus="" value={loginForm.email} />
                        </div>
                    </div>

                    <div className="field">
                        <div className="control">
                            <input onChange={handleChange} className="input is-large" type="password" name="password" placeholder="Your Password" text={loginForm.password} value={loginForm.password} />
                        </div>
                    </div>
                    <div className="field">
                        <label className="checkbox">
                            <input onChange={handleChange} type="checkbox" name="is_remember" />
                            Remember me
                        </label>
                    </div>
                    <button onClick={loginButton} className="button is-block is-info is-large is-fullwidth">Login</button>
                </form>
            </div>
        </div>
    );
};


Login.propTypes = {

};


export default Login;
