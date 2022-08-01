import { useState } from 'react'
import axios from "axios";

function Profile(props) {

    const [profileData, setProfileData] = useState(null)
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
                integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous" />
            <link href="../assets/css/profile.css')}}" rel="stylesheet" />
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
            <div class="container rounded bg-white mt-5 mb-5">
                <div class="row">
                    <div class="col-md-auto border-right">
                        <div class="p-3 py-5">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h4 style="color:black" class=" text-right">Profile Settings</h4>
                            </div>
                            <div class="row mt-2">
                                <div class="col-md-6"><label style="color:black" class="labels">Name</label><input type="text"
                                    class="form-control" placeholder="first name" value="{{ name }}" /></div>
                                <div class="col-md-6"><label style="color:black" class="labels">Surname</label><input type="text"
                                    class="form-control" value="{{ surname }}" placeholder="surname" /></div>
                            </div>
                            <div class="row mt-3">
                                <div class="col-md-12"><label style="color:black" class="labels">Role</label><input type="text"
                                    class="form-control" placeholder="Your Role" value="------------------------" /></div>
                                <div class="col-md-12"><label style="color:black" class="labels">Mobile Number</label><input type="text"
                                    class="form-control" placeholder="enter phone number" value="{{ mobile_number }}" /></div>
                                <div class="col-md-12"><label style="color:black" class="labels">Email ID</label><input type="text"
                                    class="form-control" placeholder="enter email id" value="{{ email }}" /></div>
                            </div>
                            <div class="mt-5 text-center"><button class="btn btn-primary profile-button" type="button">Save Profile</button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-5 border-left">
                        <div class="d-flex flex-column align-items-center text-center p-3 py-5"><img class="mt-5"
                            src="../assets/photos/centom.jpg" /><span
                                class="text-black-50">support@centom.com</span><span> </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;