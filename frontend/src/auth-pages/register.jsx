import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';

function Register(props) {
    const [signUpForm, setSignUpForm] = useState({
        email: "",
        role: "",
        password: "",
        message: ""
    })
    const [roles, setRoles] = useState([]);

    function signUpButton(event) {
        axios({
            method: "POST",
            url: "/register",
            headers: {
                Authorization: props.getToken()
            },
            data: {
                email: signUpForm.email,
                role: signUpForm.role,
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
            role: "",
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
    const handleRoleChange = event => {

        let req_net = event.target.selectedOptions[0].value
        if (req_net.length === 0) {
            setSignUpForm({ ...signUpForm, role: "" });
            alert('choose a Role')
        } else {
            setSignUpForm({ ...signUpForm, role: req_net });
        }
    };
    useEffect(() => {
        async function getOptions() {
            await axios({
                method: "GET",
                url: "/get-roles",
                headers: {
                    Authorization: props.getToken()
                }
            }).then((response) => {
                setRoles(response.data.roles);
                console.log(response.data.roles);
            })
        }
        getOptions();
    }, []);
    return (
        <div className="column is-4 is-offset-4">
            <h3 className="title">Register</h3>
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
                            <input onChange={handleChange} className="input is-large" type="password" name="password" placeholder="Password" />
                        </div>
                    </div>

                    <div className="field">
                        <div className="control">

                            <select value={signUpForm.role} id="" className="input is-medium form-select" onChange={handleRoleChange} >
                                <option value="">Choose a Role</option>
                                {
                                    roles.map((item, i) =>
                                        <option key={i} value={item.role_name}>{item.role_name}</option>
                                    )}
                            </select>
                        </div>
                    </div>
                    <button className="button is-block is-info is-large is-fullwidth" onClick={signUpButton}>Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
