import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';



const Notification = () => {
    const [traps, setTraps] = useState([]);
    const [loading, setLoading] = useState(false);

    let handleSubmit = (event) => {
        event.preventDefault();
    }
    useEffect(() => {
        if (loading) {

            let url = 'http://localhost:5000/notification'
            // url = url.concat("ip=").concat(selectedIP).concat('&')
            // url = url.concat("network=").concat(selectedNet).concat('&')
            // url = url.concat("name=").concat(info.oid_name).concat('&')
            // url = url.concat("location=").concat(info.oid_location).concat('&')
            // url = url.concat("description=").concat(info.oid_description)
            const sse = new EventSource(url)

            function handleStream(e) {
                //processing data
                const recieved_data = JSON.parse(e.data)
                console.log(recieved_data);
                if (recieved_data['trap']) {
                    setTraps([...traps, recieved_data['trap']]);
                }
            }

            sse.onmessage = e => { handleStream(e) }
            sse.onerror = () => {
                // error log here 

                sse.close();
            }
            // return () => {
            //     sse.close();
            // };
        }
    });
    function fetch() {
        setLoading(true);
    }
    return (
        <div>

            <div className="container mt-5">
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-md-8">
                        <form onSubmit={handleSubmit} id="regForm">
                            <h1 style={{ color: "black" }} id="register">Notification</h1>

                            <h3 style={{ color: "black" }}>Listen</h3>
                            <button onClick={fetch} type="submit" className="btn btn-success">Listen</button>
                            {
                                traps.map((trap) => (
                                    <div>
                                        <textarea className="form-control" id="exampleFormControlTextarea3" rows="1" readOnly value={trap}></textarea>
                                    </div>
                                ))
                            }
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};


Notification.propTypes = {

};


export default Notification;
