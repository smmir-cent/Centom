import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../bulma.min.css';
import './quick-scan.css';
import '../profile-pages/profile.css';
import './loading.css';
import axios from 'axios';


const Monitoring = (props) => {
    const [networks, setNetworks] = useState([])
    const [ips, setIps] = useState([])
    const [selectedNet, setSelectedNet] = useState('');
    const [selectedIP, setSelectedIP] = useState('');
    const [info, setInfo] = useState({
        username: "",
        password: "",
        engineId: "",
        oid_name: "",
        oid_location: "",
        oid_description: ""
    });
    const handleNetChange = event => {

        let req_net = event.target.selectedOptions[0].value
        if (req_net.length === 0) {
            alert('choose a network')
            setSelectedNet('');
            setSelectedIP('');
            setIps([]);
        } else {
            setSelectedNet(req_net);
        }
    };
    const handleIpChange = event => {

        let req_ip = event.target.selectedOptions[0].value
        if (req_ip.length === 0) {
            alert('choose a ip')
            setSelectedIP('');

        } else {
            setSelectedIP(req_ip);
        }
    };
    function createSelectIps() {
        let items = [];
        for (let i = 0; i < ips.length; i++) {
            items.push(<option key={i} value={ips[i]}>{ips[i]}</option>);
        }
        return items;
    }
    useEffect(() => {
        async function getOptions() {
            await axios({
                method: "GET",
                url: "/get-networks",
                headers: {
                    Authorization: props.getToken()
                }
            }).then((response) => {
                setNetworks(response.data['networks'])
            })
        }
        getOptions()
    }, []);
    useEffect(() => {
        console.log(selectedNet);
        if (selectedNet.length !== 0) {
            axios({
                method: "GET",
                url: "/get-ips",
                headers: {
                    Authorization: props.getToken()
                },
                params: {
                    subnet: selectedNet
                }
            }).then((response) => {
                console.log(response.data.ips);
                setIps(response.data.ips)
            })

        }
    }, [selectedNet]);
    function scanButton() {
        // setLoading(true)
        axios({
            method: "POST",
            url: "/monitoring",
            headers: {
                Authorization: props.getToken()
            },
            data: {
                ip: selectedIP,
                network: selectedNet
            }
        }).then((response) => {
            // setLoading(false)
            const res = response.data
            setInfo(res.message)
            console.log(res.message)
            // setResult(res.message)
        }).catch((error) => {
            if (error.response) {
                // setResult(error.response.data.message)
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
                        <div id="regForm">

                            <h1 style={{ color: "black" }} id="register">Monitoring</h1>

                            <h4 style={{ color: "black" }}>Saved Network</h4>
                            <label style={{ color: "black" }}>Networks: </label>
                            <select value={selectedNet} id="" className=" form-select" onChange={handleNetChange} >
                                <option value="">Choose a Network</option>
                                {
                                    networks.map((item, i) =>
                                        <option key={i} value={item.name}>{item.name}</option>
                                    )}
                            </select>

                            {
                                ips.length !== 0 ? (
                                    <div>
                                        <label style={{ color: "black" }}>IPs: </label>
                                        <select value={selectedIP} id="" className=" form-select" onChange={handleIpChange} >
                                            <option value="">Choose a IP</option>
                                            {createSelectIps()}
                                        </select>
                                    </div>) : null
                            }
                            <br />
                            {selectedIP !== '' ? (
                                <div style={{ overflow: "auto" }} id="nextprevious">
                                    <div style={{ float: "right" }}>
                                        <button onClick={scanButton} type="submit" className="btn btn-success">Scan</button>
                                    </div>
                                </div>) : null
                            }
                            <div className="row mt-2">
                                <div className="col-md-6"><label style={{ color: "black", fontSize: 15 }} className="labels">Username</label><input value={info.username} name="username" type="text"
                                    className="form-control" placeholder="username" /></div>
                                <div className="col-md-6"><label style={{ color: "black", fontSize: 15 }} className="labels">Password</label><input value={info.password} name="password" type="text"
                                    className="form-control" placeholder="password" /></div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-12"><label style={{ color: "black", fontSize: 15 }} className="labels">Engine ID</label><input value={info.engineId} name="engineId" type="text"
                                    className="form-control" placeholder="enginID" /></div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-4"><label style={{ color: "black", fontSize: 15 }} className="labels">Name</label><input value={info.oid_name} name="oid_name" type="text"
                                    className="form-control" placeholder="oid name" /></div>
                                <div className="col-md-4"><label style={{ color: "black", fontSize: 15 }} className="labels">Location</label><input value={info.oid_location} name="oid_location" type="text"
                                    className="form-control" placeholder="oid location" /></div>
                                <div className="col-md-4"><label style={{ color: "black", fontSize: 15 }} className="labels">Description</label><input value={info.oid_description} name="oid_description" type="text"
                                    className="form-control" placeholder="oid description" /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


Monitoring.propTypes = {

};


export default Monitoring;
