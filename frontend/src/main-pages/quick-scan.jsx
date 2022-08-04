import React from 'react';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../bulma.min.css';
import './quick-scan.css';
import '../profile-pages/profile.css';

function QuickScan(props) {
    const [result, setResult] = useState()
    const [scanOption, setScanOption] = useState()
    return (
        <div>
            <div className="container mt-5">
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-md-8">
                        <form id="regForm">
                            <h1 style={{ color: "black" }} id="register">Quick Scan</h1>

                            <h6 style={{ color: "black" }}>IP</h6>
                            <p>
                                {/*onInput="this.className = ''"*/}
                                <input placeholder="192.168.1.1 ..." name="ip" />
                            </p>
                            <h6 style={{ color: "black" }}>OIDs</h6>
                            <div className="bd-example">

                                <div className="form-check">
                                    <input className="form-check-input" name="c_check" type="checkbox" value="sysDescr.0" id="flexCheckDefault" />
                                    <label style={{ color: "black", display: "block", float: "left" }} className="form-check-label" htmlFor="flexCheckDefault">
                                        sysDescr.0
                                    </label>
                                </div>
                                <br />
                                <div className="form-check">
                                    <input className="form-check-input" name="c_check" type="checkbox" value="sysName.0" id="flexCheckChecked" />
                                    <label style={{ color: "black", display: "block", float: "left" }} className="form-check-label" htmlFor="flexCheckChecked">
                                        sysName.0
                                    </label>
                                </div>
                                <br />
                                <div className="form-check">
                                    <input className="form-check-input" name="c_check" type="checkbox" value="sysLocation.0" id="flexCheckChecked" />
                                    <label style={{ color: "black", display: "block", float: "left" }} className="form-check-label" htmlFor="flexCheckChecked">
                                        sysLocation.0
                                    </label>
                                </div>
                            </div>
                            <br />
                            <div style={{ overflow: "auto" }} id="nextprevious">
                                <div style={{ float: "right" }}>
                                    <button type="submit" className="btn btn-success">Scan</button>
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
