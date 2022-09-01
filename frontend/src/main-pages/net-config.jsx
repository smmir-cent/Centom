import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../bulma.min.css';
import './quick-scan.css';
import '../profile-pages/profile.css';
import './loading.css';

const NetConfig = (props) => {
    const [networks, setNetworks] = useState([])
    const [types, setTypes] = useState(["Repeater", "Switch", "Router", "Server", "Other", "All"])
    const [ips, setIps] = useState([])
    const [selectedNet, setSelectedNet] = useState('');
    const [selectedIP, setSelectedIP] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [formValues, setFormValues] = useState([]);
    const [oidParams, setOidParams] = useState([])
    const [result, setResult] = useState('');

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

    let addFormFields = () => {
        setFormValues([...formValues, { params_name: "", rate: "" }])
    }
    let removeFormFields = (i) => {
        let newFormValues = [...formValues];
        newFormValues.splice(i, 1);
        setFormValues(newFormValues)
    }

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
            setSelectedType('');
            setIps([]);
            setConfig({ ...config, ip: "" })
            setConfig({ ...config, network: "" })
        } else {
            setSelectedNet(req_net);
            setConfig({ ...config, network: req_net })
        }
    };
    const handleTypeChange = event => {

        let type = event.target.selectedOptions[0].value
        if (type.length === 0) {
            alert('choose a type')
            setSelectedNet('');
            setSelectedIP('');
            setSelectedType('');
            setIps([]);
            setConfig({ ...config, ip: "" })
            setConfig({ ...config, network: "" })
        } else {
            setSelectedType(type);
        }
    };
    const handleIpChange = event => {

        let req_ip = event.target.selectedOptions[0].value
        if (req_ip.length === 0) {
            alert('choose a ip')
            setSelectedIP('');
            setConfig({ ...config, ip: "" })
        } else {
            setSelectedIP(req_ip);
            setConfig({ ...config, ip: req_ip })
            // get oid_params
            // setOidParams
            axios({
                method: "GET",
                url: "/get-params",
                headers: {
                    Authorization: props.getToken()
                }
            }).then((response) => {
                console.log(response.data.params);
                setOidParams(response.data.params)
            }
            )
        }
    };


    const handleParamChange = (i, e) => {

        let req_param = e.target.value
        console.log("req_param");
        console.log(req_param);
        if (req_param.length === 0) {
            alert('choose a param')

        }
        let newFormValues = [...formValues];
        newFormValues[i][e.target.name] = e.target.value;
        setFormValues(newFormValues);
    };

    useEffect(() => {
        console.log(selectedNet);
        console.log(selectedType);
        if (selectedNet.length !== 0 && selectedNet !== '') {
            axios({
                method: "GET",
                url: "/get-ips",
                headers: {
                    Authorization: props.getToken()
                },
                params: {
                    subnet: selectedNet,
                    type: selectedType,
                }
            }).then((response) => {
                console.log(response.data.ips);
                setIps(response.data.ips)
            })

        }
    }, [selectedType]);

    function createSelectIps() {
        let items = [];
        for (let i = 0; i < ips.length; i++) {
            items.push(<option key={i} value={ips[i]}>{ips[i]}</option>);
        }
        return items;
    }
    function createLeftOids() {
        let items = [];
        let selectedParams = [];
        for (let i = 0; i < formValues.length; i++) {
            selectedParams.push(formValues[i]['params_name']);
        }
        for (let i = 0; i < oidParams.length; i++) {
            items.push(<option key={i} value={oidParams[i]}>{oidParams[i]}</option>);
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
    function submit() {
        console.log(formValues);
        let items = [];
        for (let index = 0; index < formValues.length; index++) {
            const element = formValues[index];
            if (!oidParams.includes(element['params_name'])) {
                alert('invalid param(s)!!');
                return;
            }
            items.push(element['params_name'])
        }
        let find_dup = items.filter((item, index) => items.indexOf(item) !== index);
        if (find_dup.length !== 0 || items.includes("")) {
            alert('duplicate param(s)!!');
            return;
        }
        else {
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
                    params: JSON.stringify(formValues)
                }
            }).then((response) => {
                const res = response.data
                console.log(res.message)
                setResult(res.message)
            }).catch((error) => {
                if (error.response) {
                    // setResult(error.response.data.message)
                    console.log(error.response)
                    console.log(error.response.status)
                    console.log(error.response.headers)
                }
            })
        }

    }
    return (
        <div>
            <div className="container mt-5">
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
                                selectedNet !== '' ? (
                                    <div>
                                        <label style={{ color: "black" }}>Device Types: </label>
                                        <select value={selectedType} id="" className="form-select" onChange={handleTypeChange} >
                                            <option value="">Choose a Type</option>
                                            {
                                                types.map((item, i) =>
                                                    <option key={i} value={item}>{item}</option>
                                                )}
                                        </select>
                                    </div>

                                ) : null
                            }
                            {
                                ips.length !== 0 ? (
                                    <div>
                                        <label style={{ color: "black" }}>IPs: </label>
                                        <select value={selectedIP} id="" className="form-select" onChange={handleIpChange} >
                                            <option value="">Choose a IP</option>
                                            {createSelectIps()}
                                            <option value="all">All</option>

                                        </select>
                                    </div>) : null
                            }

                            {selectedIP !== '' ?
                                (
                                    <div>
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
                                        {formValues.map((element, index) => (
                                            <div className="form-inline" key={index}>
                                                <div className="form-row align-items-center">
                                                    <div className="col-auto my-1">
                                                        <label style={{ color: "black" }}>IPs: </label>
                                                        <select name="params_name" value={formValues[index].params_name} id="" className="form-select" onChange={e => handleParamChange(index, e)} >
                                                            <option value="">Choose a Param</option>
                                                            {createLeftOids()}
                                                        </select>

                                                        <input type="text" name="rate" value={element.rate || ""} onChange={e => handleParamChange(index, e)} />
                                                    </div>
                                                </div>
                                                <button type="button" className="btn btn-danger remove" onClick={() => removeFormFields(index)}>Remove</button>
                                            </div>
                                        ))}

                                        <br />
                                        <div style={{ overflow: "auto" }} id="nextprevious">
                                            <div style={{ float: "right" }}>
                                                <button onClick={submit} type="submit" className="btn btn-success">Submit</button>
                                            </div>
                                            <div style={{ float: "right" }}>
                                                <button className="btn add btn-primary" type="submit" onClick={() => addFormFields()}>Add</button>
                                            </div>
                                        </div>
                                    </div>) : null
                            }
                            {result !== '' ?
                                <div style={{ color: "black" }}>
                                    {result}
                                </div> : null
                            }
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
