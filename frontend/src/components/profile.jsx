import { useState } from 'react'
import axios from "axios";
import useToken from './useToken'

function Profile(props) {

    const [profileData, setProfileData] = useState({ profile_name: "", about_me: "" })
    const { token, removeToken, setToken, getToken } = useToken();

    function getData() {
        axios({
            method: "GET",
            url: "/profile",
            headers: {
                Authorization: 'Bearer ' + props.token
            }
        })
            .then((response) => {
                const res = response.data
                res.access_token && props.setToken(res.access_token)
                setProfileData(({
                    profile_name: res.name,
                    about_me: res.about
                }))
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                    console.log(error.response.status)
                    console.log(error.response.headers)
                }
            })
    }

    return (
        <div className="Profile">

            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous" />
            <link href="../assets/css/profile.css')}}" rel="stylesheet" />
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossOrigin="anonymous"></script>
            <div className="container rounded bg-white mt-5 mb-5">
                <div className="row">
                    <div className="col-md-auto border-right">
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 style="color:black" className=" text-right">Profile Settings</h4>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-6"><label style="color:black" className="labels">Name</label><input type="text"
                                    className="form-control" placeholder="first name" value="{{ name }}" /></div>
                                <div className="col-md-6"><label style="color:black" className="labels">Surname</label><input type="text"
                                    className="form-control" value="{{ surname }}" placeholder="surname" /></div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-12"><label style="color:black" className="labels">Role</label><input type="text"
                                    className="form-control" placeholder="Your Role" value="------------------------" /></div>
                                <div className="col-md-12"><label style="color:black" className="labels">Mobile Number</label><input type="text"
                                    className="form-control" placeholder="enter phone number" value="{{ mobile_number }}" /></div>
                                <div className="col-md-12"><label style="color:black" className="labels">Email ID</label><input type="text"
                                    className="form-control" placeholder="enter email id" value="{{ email }}" /></div>
                            </div>
                            <div className="mt-5 text-center"><button className="btn btn-primary profile-button" type="button">Save Profile</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5 border-left">
                        <div className="d-flex flex-column align-items-center text-center p-3 py-5"><img className="mt-5"
                            src="../assets/photos/centom.jpg" /><span
                                className="text-black-50">support@centom.com</span><span> </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;