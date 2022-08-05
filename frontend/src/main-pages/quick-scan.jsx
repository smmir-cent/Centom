import React from 'react';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../bulma.min.css';
import './quick-scan.css';
import '../profile-pages/profile.css';
import axios from 'axios';

function QuickScan(props) {
    const [result, setResult] = useState()
    const [ip, setIp] = useState("")
    const [formValues, setFormValues] = useState([{ mode: "get", oid: "" }])
    let handleChange = (i, e) => {
        let newFormValues = [...formValues];
        newFormValues[i][e.target.name] = e.target.value;
        setFormValues(newFormValues);
    }
    let addFormFields = () => {
        setFormValues([...formValues, { mode: "get", oid: "" }])
    }
    let removeFormFields = (i) => {
        let newFormValues = [...formValues];
        newFormValues.splice(i, 1);
        setFormValues(newFormValues)
    }
    let handleSubmit = (event) => {
        event.preventDefault();
    }
    function handleIpChange(event) {
        setIp(event.target.value);
    }
    function ValidateIPaddress(ipaddress) {
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
            return (true)
        }
        return (false)
    }
    function scanButton() {
        console.log(formValues)
        if (ValidateIPaddress(ip) && formValues.length != 0) {
            axios({
                method: "POST",
                url: "/quick-scan",
                headers: {
                    Authorization: props.getToken()
                },
                data: {
                    ip: ip,
                    options: formValues
                }
            }).then((response) => {
                setResult(response.data.message)
            }).catch((error) => {
                if (error.response) {
                    setResult(error.response.data.message)
                    console.log(error.response)
                    console.log(error.response.status)
                    console.log(error.response.headers)
                }
            })

        } else {
            alert("You have entered an invalid IP address or empty oids!!")
        }
    }
    return (
        <div>
            <div className="container mt-5">
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-md-8">
                        <form onSubmit={handleSubmit} id="regForm">
                            <h1 style={{ color: "black" }} id="register">Quick Scan</h1>

                            <h3 style={{ color: "black" }}>IP</h3>
                            <p>
                                <input onChange={handleIpChange} placeholder="192.168.1.1 ..." name="ip" />
                            </p>
                            <h3 style={{ color: "black" }}>OIDs</h3>

                            {formValues.map((element, index) => (
                                <div className="form-inline" key={index}>
                                    <div className="form-row align-items-center">
                                        <div className="col-auto my-1">
                                            <select name="mode" onChange={e => handleChange(index, e)} defaultValue={'get'} className="custom-select mr-sm-2" id="inlineFormCustomSelect">
                                                <option value="get">get</option>
                                                <option value="walk">Walk</option>
                                            </select>
                                            <input type="text" name="oid" value={element.oid || ""} onChange={e => handleChange(index, e)} />
                                        </div>
                                    </div>
                                    {
                                        index ?
                                            <button type="button" className="btn btn-danger remove" onClick={() => removeFormFields(index)}>Remove</button>
                                            : null
                                    }
                                </div>
                            ))}

                            <br />
                            <div style={{ overflow: "auto" }} id="nextprevious">
                                <div style={{ float: "right" }}>
                                    <button onClick={scanButton} type="submit" className="btn btn-success">Scan</button>
                                </div>
                                <div style={{ float: "right" }}>
                                    <button className="btn add btn-primary" type="submit" onClick={() => addFormFields()}>Add</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>





            {/* /////////////// */}



            < div className="container rounded bg-white mt-5 mb-5" >
                <div className="col-md-auto border-center">
                    <div className="p-3 py-5">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 style={{ color: "black" }} className=" text-right">Result</h4>
                        </div>
                        <img src={require("../assets/photos/O18mJ1K.png")} width="100" className="mb-4" />
                        <div>
                            {/* <span style={{ color: "black" }}> {{ result }}</span> */}
                        </div>
                    </div>
                </div>
            </div >
        </div>
    )

};


QuickScan.propTypes = {

};


export default QuickScan;
