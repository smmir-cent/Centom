import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from "axios";

import '../bulma.min.css';

const Login = (props) => {
    const [loginForm, setloginForm] = useState({
        email: "",
        password: ""
    })

    function loginButton(event) {
        axios({
            method: "POST",
            url: "/token",
            data: {
                email: loginForm.email,
                password: loginForm.password
            }
        })
            .then((response) => {
                props.setToken(response.data.access_token)
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                    console.log(error.response.status)
                    console.log(error.response.headers)
                }
            })

        setloginForm(({
            email: "",
            password: ""
        }))

        event.preventDefault()
    }

    function handleChange(event) {
        const { value, name } = event.target
        setloginForm(prevNote => ({
            ...prevNote, [name]: value
        })
        )
    }

    return (
        <div class="column is-4 is-offset-4">
            <h3 class="title">Login</h3>
            <div class="box">

                <div class="notification is-danger">

                </div>

                <form method="POST" action="/login">
                    <div class="field">
                        <div class="control">
                            <input onChange={handleChange} class="input is-large" type="email" name="email" placeholder="Your Email" autofocus="" />
                        </div>
                    </div>

                    <div class="field">
                        <div class="control">
                            <input onChange={handleChange} class="input is-large" type="password" name="password" placeholder="Your Password" />
                        </div>
                    </div>
                    <div class="field">
                        <label class="checkbox">
                            <input onChange={handleChange} type="checkbox" />
                            Remember me
                        </label>
                    </div>
                    <button onClick={loginButton} class="button is-block is-info is-large is-fullwidth">Login</button>
                </form>
            </div>
        </div>
    );
};


Login.propTypes = {

};


export default Login;
