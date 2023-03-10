import { useState, useEffect, useRef } from 'react';
import { Outlet, useOutlet, useNavigate } from "react-router-dom";

import ConnectionTest from '../../components/ConnectionTest/ConnectionTest';

import Button from '../../components/Button/Button';

import './Root.css';
import axios from 'axios';

function Root() {

    let outlet = useOutlet();
    const [loginStatus, setLoginStatus] = useState(false);
    const [userAdmin, setUserAdmin] = useState(false);
    const [axiosURL, setAxiosURL] = useState([]);
    const [userName, setUserName] = useState("");

    const [errMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    useEffect( () => {
        if(outlet === null){
            window.location.href = "/main";
        }
    }, [] );

    useEffect( () => {
        if(window.location.href.indexOf("/admin") !== -1 && !userAdmin){
            window.location.href = "/login";
        }
    } )

    useEffect( () => {
        if (errMessage !== ""){
            navigate("/error");
        }
    }, [errMessage] )

    useEffect( () => {
        if(!loginStatus && axiosURL.length > 0){
            let URL = axiosURL + "Connection_test.php";
            axios.post(URL,{
                type: "getUser"
            }).then( (responce) => {
                if(responce.data){
                    setLoginStatus(true);
                    setUserName(responce.data);
                }
            } )
        }
    } )

    useEffect( () => {
        if(loginStatus && axiosURL.length > 0){
            let URL = axiosURL + "Connection_test.php";
            axios.post(URL,{
                type: "getPermissions"
            }).then( (responce) => {
                if(responce.data >= 90){
                    setUserAdmin(true);
                }
            } )
        }
    }, [loginStatus] )

    function LogOut(){
        let URL = axiosURL + "Logout.php"
        axios.post(URL,{
            logout: true
        })
        .then( () => {
            window.location.reload();
        } )
    }

    // if(axiosURL.length !== 0) console.log("current link: " + axiosURL);

    return (
        <div>
            {(axiosURL.length === 0)
            ?<div>
            <ConnectionTest 
                script = "Connection_test.php"
                callBack = { setAxiosURL }
                errCallBack = { setErrorMessage }
            />
            </div>
            :<header>
                <nav className='container-md'>
                    <div className='navButtons'>
                        <Button 
                            type="Button"
                            text="??????????????"
                            href="/main"
                        />
                        {userAdmin
                        ?<Button 
                            type="Button"
                            text="???????????? ????????????????????????????"
                            href="/admin"
                        />
                        :<div></div>
                        }
                    </div>
                    <div>
                        {loginStatus
                        ? <div className='LoginRegister'>
                            <h2>???????????? { userName }</h2>
                            <Button 
                                type="Button"
                                text="??????????"
                                state={ LogOut }
                            />
                        </div>
                        : <div className='LoginRegister'>
                            <Button 
                                type="Button"
                                text="????????"
                                href="/login"
                            />
                            <Button 
                                type="Button"
                                text="??????????????????????"
                                href="/registration"
                            />
                        </div>
                        }
                    </div>
                </nav>
                <hr />
            </header>}

            <div className='container-md'>
                <Outlet context={[errMessage, axiosURL]}/>
            </div>
        </div>
    );
}

export default Root;
