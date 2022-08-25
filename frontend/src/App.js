import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route }
  from 'react-router-dom';

import Navbar from './profile-pages/navbar';

import Home from './main-pages';

import Login from './auth-pages/login';
import Logout from './auth-pages/logout';
import useToken from './auth-pages/useToken'
import Register from './auth-pages/register';

import QuickScan from './main-pages/quick-scan';
import NetDiscovery from './main-pages/net-discovery';
import NetConfig from './main-pages/net-config';
import Monitoring from './main-pages/monitoring';
import Stream from './main-pages/stream';
import Notification from './main-pages/notification';
import { Filecontext } from './Filecontext';
import axios from 'axios';

function App() {
  const { token, removeToken, setToken, getToken } = useToken();
  const [permission, setPermission] = useState(-1);
  const setPer = (per) => {
    setPermission(per);
  };
  useEffect(() => {
    axios({
      method: "GET",
      url: "/get-role",
      headers: {
        Authorization: getToken()
      }
    }).then((response) => {
      console.log(response.data.role);
      setPermission(response.data.role)
    })

  });
  return (
    <Router>
      <div>
        <section className="hero is-primary is-fullheight">
          <Filecontext.Provider value={{ permission: permission, setPermission: setPer }}>
            <Navbar />
            <div className="hero-body">
              <div className="container has-text-centered">
                <Routes>
                  <Route exact path='/' element={<Home />} />
                  <Route exact path='/home' element={<Home />} />
                  <Route exact path='/logout' element={<Logout getToken={getToken} removeToken={removeToken} />} />
                  <Route exact path="/login" element={<Login token={token} setToken={setToken} />}></Route>
                  <Route exact path='/register' element={<Register getToken={getToken} />} />
                  <Route exact path='/quick-scan' element={<QuickScan getToken={getToken} />} />
                  <Route exact path='/net-discovery' element={<NetDiscovery getToken={getToken} />} />
                  <Route exact path='/net-config' element={<NetConfig getToken={getToken} />} />
                  <Route exact path='/monitoring' element={<Monitoring getToken={getToken} />} />
                  <Route exact path='/notification' element={<Notification getToken={getToken} />} />
                  <Route exact path='/stream' element={<Stream getToken={getToken} />} />

                </Routes>
              </div>
            </div>
          </Filecontext.Provider>
        </section>
      </div>
    </Router>
  );
}


export default App;