import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../bulma.min.css';
import './quick-scan.css';
import '../profile-pages/profile.css';
import './loading.css';

const NetConfig = (props) => {
    const [networks, setNetworks] = useState([])
    const [ips, setIps] = useState([])
    const [selectedNet, setSelectedNet] = useState('');
    const [selectedIP, setSelectedIP] = useState('');
    const [config, setConfig] = useState({
        ip: "",
        network: "",
        username: "",
        password: "",
        engineId: "",
        oid_name: "",
        oid_location: "",
        oid_description: "",
        params: ""
    });
    let json_sample = {
        params: [
            {
                name: "fav_name",
                oid: "value",
                rate: 5
            },
            {
                name: "fav_name2",
                oid: "value2",
                rate: 52
            }
        ]
    };

    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Sample</Popover.Header>
            <Popover.Body>
                <pre>{JSON.stringify(json_sample, null, 2)}</pre>
            </Popover.Body>
        </Popover>
    );


    function handleChange(event) {
        const { value, name } = event.target
        setConfig({
            ...config, [name]: value
        })

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
    let handleSubmit = (event) => {
        event.preventDefault();
    }
    const handleNetChange = event => {

        let req_net = event.target.selectedOptions[0].value
        if (req_net.length === 0) {
            alert('choose a network')
            setSelectedNet('');
            setSelectedIP('');
            setIps([]);
            setConfig({ ...config, ip: "" })
            setConfig({ ...config, network: "" })
        } else {
            setSelectedNet(req_net);
            setConfig({ ...config, network: req_net })
        }
    };
    const handleIpChange = event => {

        let req_ip = event.target.selectedOptions[0].value
        if (req_ip.length === 0) {
            alert('choose a ip')
            setSelectedIP('');
            setConfig({ ...config, ip: "" })
            // config.ip = ""
        } else {
            setSelectedIP(req_ip);
            // config.ip = req_ip
            setConfig({ ...config, ip: req_ip })


        }
    };
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


    useEffect(() => {
        console.log(selectedIP);
        if (selectedNet.length !== 0) {
            axios({
                method: "GET",
                url: "/get-ip-info",
                headers: {
                    Authorization: props.getToken()
                },
                params: {
                    ip: selectedIP,
                    subnet: selectedNet
                }
            }).then((response) => {
                console.log(response.data);
            })

        }
    }, [selectedIP]);



    function createSelectIps() {
        let items = [];
        for (let i = 0; i < ips.length; i++) {
            items.push(<option key={i} value={ips[i]}>{ips[i]}</option>);
        }
        return items;
    }

    function submitButton() {
        console.log(JSON.stringify(config, null, 2))
        axios({
            method: "POST",
            url: "/net-config",
            headers: {
                Authorization: props.getToken()
            },
            data: {
                ip: config.ip,
                network: config.network,
                username: config.username,
                password: config.password,
                engineId: config.engineId,
                oid_name: config.oid_name,
                oid_location: config.oid_location,
                oid_description: config.oid_description,
                params: config.params
            }
        }).then((response) => {
            // graph rendering
            // setLoading(false)
            // const res = response.data
            // console.log(res.message)
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
            <div className="container mt-10">
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-md-8">
                        <form onSubmit={handleSubmit} id="regForm">
                            <h1 style={{ color: "black" }} id="register">Network Configuration</h1>

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
                                            <option value="all">All</option>

                                        </select>
                                    </div>) : null
                            }




                            <div className="row mt-2">
                                <div className="col-md-6"><label style={{ color: "black", fontSize: 15 }} className="labels">Username</label><input onChange={handleChange} name="username" type="text"
                                    className="form-control" placeholder="username" /></div>
                                <div className="col-md-6"><label style={{ color: "black", fontSize: 15 }} className="labels">Password</label><input onChange={handleChange} name="password" type="text"
                                    className="form-control" placeholder="password" /></div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-12"><label style={{ color: "black", fontSize: 15 }} className="labels">Engine ID</label><input onChange={handleChange} name="engineId" type="text"
                                    className="form-control" placeholder="enginID" /></div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-4"><label style={{ color: "black", fontSize: 15 }} className="labels">Name</label><input onChange={handleChange} name="oid_name" type="text"
                                    className="form-control" placeholder="oid name" /></div>
                                <div className="col-md-4"><label style={{ color: "black", fontSize: 15 }} className="labels">Location</label><input onChange={handleChange} name="oid_location" type="text"
                                    className="form-control" placeholder="oid location" /></div>
                                <div className="col-md-4"><label style={{ color: "black", fontSize: 15 }} className="labels">Description</label><input onChange={handleChange} name="oid_description" type="text"
                                    className="form-control" placeholder="oid description" /></div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-4">
                                    <label style={{ color: "black", fontSize: 20 }} htmlFor="exampleFormControlTextarea3">params in json format</label>
                                </div>
                                <div className="col-md-4">
                                    <OverlayTrigger trigger="click" placement="right" overlay={popover}>
                                        <Button variant="success">Sample Input</Button>
                                    </OverlayTrigger>

                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-12">
                                    <textarea className="form-control" id="exampleFormControlTextarea3" rows="7" onChange={handleChange} name="params"></textarea>
                                </div>
                            </div>
                            <br />
                            <div style={{ overflow: "auto" }} id="nextprevious">
                                <div style={{ float: "right" }}>
                                    <button onClick={submitButton} type="submit" className="btn btn-success">Scan</button>
                                </div>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div >
    );
};




NetConfig.propTypes = {

};


export default NetConfig;
