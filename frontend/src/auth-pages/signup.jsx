import axios from 'axios';
import React from 'react';
import { useState } from 'react';

function SignUp(props) {
    const [signUpForm, setSignUpForm] = useState({
        email: "",
        name: "",
        surname: "",
        mobile_number: "",
        password: "",
        message: ""
    })

    function signUpButton(event) {
        axios({
            method: "POST",
            url: "/sign-up",
            data: {
                email: signUpForm.email,
                name: signUpForm.name,
                surname: signUpForm.surname,
                mobile_number: signUpForm.mobile_number,
                password: signUpForm.password,
            }
        })
            .then((response) => {
                updateErrMsg(response.data.message)
            }).catch((error) => {
                if (error.response) {
                    updateErrMsg(error.response.data.message)
                    console.log(error.response)
                    console.log(error.response.status)
                    console.log(error.response.headers)
                }
            })
        setSignUpForm(({
            email: "",
            name: "",
            surname: "",
            mobile_number: "",
            password: "",
            message: ""
        }))
        event.preventDefault()
    }


    const updateErrMsg = (msg) => {
        setSignUpForm(previousState => {
            return { ...previousState, message: msg }
        });
    }
    function handleChange(event) {
        const { value, name } = event.target
        setSignUpForm(prevNote => ({
            ...prevNote, [name]: value
        })
        )
    }

    return (
        <div className="column is-4 is-offset-4">
            <h3 className="title">Sign Up</h3>
            <div className="box">

                <div className={signUpForm.message.includes("exist") ? "notification is-danger" : (signUpForm.message.includes("Success") ? "notification is-success" : "")}>{signUpForm.message ? signUpForm.message : ""}</div>

                <form>
                    <div className="field">
                        <div className="control">
                            <input onChange={handleChange} className="input is-large" type="email" name="email" placeholder="Email" autoFocus="" />
                        </div>
                    </div>

                    <div className="field">
                        <div className="control">
                            <input onChange={handleChange} className="input is-large" type="text" name="name" placeholder="Name" autoFocus="" />
                        </div>
                    </div>

                    <div className="field">
                        <div className="control">
                            <input onChange={handleChange} className="input is-large" type="text" name="surname" placeholder="Surname" autoFocus="" />
                        </div>
                    </div>

                    <div className="field">
                        <div className="control">
                            <input onChange={handleChange} className="input is-large" type="text" name="mobile_number" placeholder="Mobile Number"
                                autoFocus="" />
                        </div>
                    </div>

                    <div className="field">
                        <div className="control">
                            <input onChange={handleChange} className="input is-large" type="password" name="password" placeholder="Password" />
                        </div>
                    </div>

                    <button className="button is-block is-info is-large is-fullwidth" onClick={signUpButton}>Sign Up</button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
