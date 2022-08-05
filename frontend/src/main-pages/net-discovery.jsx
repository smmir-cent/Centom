import React from 'react';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../bulma.min.css';
import './quick-scan.css';
import '../profile-pages/profile.css';
import axios from 'axios';

function NetDiscovery(props) {

    const [result, setResult] = useState()
    const [ip, setIp] = useState("")

    let handleSubmit = (event) => {
        event.preventDefault();
    }
    function handleIpChange(event) {
        setIp(event.target.value);
    }

    function scanButton() {
        axios({
            method: "POST",
            url: "/net-discovery",
            headers: {
                Authorization: props.getToken()
            },
            data: {
                ip: ip,
            }
        }).then((response) => {
            const res = response.data
            setResult(res.result)
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
                            <p>
                                <input onChange={handleIpChange} placeholder="192.168.1.1 ..." name="ip" />
                            </p>
                            <br />
                            <div style={{ overflow: "auto" }} id="nextprevious">
                                <div style={{ float: "right" }}>
                                    <button onClick={scanButton} type="submit" className="btn btn-success">Scan</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>



        </div>
    );
};




export default NetDiscovery;
