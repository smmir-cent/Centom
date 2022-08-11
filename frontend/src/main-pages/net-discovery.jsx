import React from 'react';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../bulma.min.css';
import './quick-scan.css';
import '../profile-pages/profile.css';
import axios from 'axios';
import Network from './network';

function NetDiscovery(props) {

    const [result, setResult] = useState({})
    const [checked, setChecked] = React.useState(false);
    const [info, setInfo] = useState({ name: "", ip: "" })

    let handleSubmit = (event) => {
        event.preventDefault();
    }
    function handleInfoChange(event) {
        const { value, name } = event.target
        setInfo(prevNote => ({
            ...prevNote, [name]: value
        })
        )
    }
    const handleChange = () => {
        setChecked(!checked);
    };

    function scanButton() {
        axios({
            method: "POST",
            url: "/net-discovery",
            headers: {
                Authorization: props.getToken()
            },
            data: {
                ip: info.ip,
                name: info.name,
                save: checked
            }
        }).then((response) => {
            // graph rendering
            const res = response.data
            console.log(res.message)
            setResult(res.message)
        }).catch((error) => {
            if (error.response) {
                setResult(error.response.data.message)
                console.log(error.response)
                console.log(error.response.status)
                console.log(error.response.headers)
            }
        })

    }
    return (
        <div>
            <div className="container mt-5">
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-md-8">
                        <form onSubmit={handleSubmit} id="regForm">
                            <h1 style={{ color: "black" }} id="register">Network Discovery</h1>

                            <h4 style={{ color: "black" }}>Network IP Address</h4>

                            <input onChange={handleInfoChange} placeholder="192.168.1.0/24 ..." name="ip" />
                            <br />
                            <input onChange={handleInfoChange} placeholder="Name ..." name="name" />
                            <div className="bd-example">
                                <div className="form-check">
                                    <input onChange={handleChange} className="form-check-input" style={{ marginTop: "0em" }} name="c_check" type="checkbox" value="sysDescr.0" id="flexCheckDefault" />
                                    <label className="form-check-label" style={{ color: "black", display: "block", float: "left" }} htmlFor="flexCheckDefault">
                                        Save in DB
                                    </label>
                                </div>
                            </div>
                            <br />
                            <div style={{ overflow: "auto" }} id="nextprevious">
                                <div style={{ float: "right" }}>
                                    <button onClick={scanButton} type="submit" className="btn btn-success">Scan</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    {
                        Object.keys(result).length !== 0 ?
                            < div className="container rounded bg-white mt-5 mb-5" >
                                <div className="col-md-auto border-center">
                                    <div className="p-3 py-5">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h4 style={{ color: "black" }} className=" text-right">Result</h4>
                                        </div>
                                        <img src={require("../assets/photos/O18mJ1K.png")} width="100" className="mb-4" />
                                        <div>
                                            <Network id="result" data={result}></Network>
                                        </div>
                                    </div>
                                </div>
                            </div >
                            : null
                    }
                </div>
            </div>



        </div>
    );
};




export default NetDiscovery;
