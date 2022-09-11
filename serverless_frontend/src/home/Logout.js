
import { useEffect } from 'react';
import { ReactSession } from 'react-client-session';
import { useNavigate } from 'react-router-dom';

export default function Logout(props) {

    let navigate = useNavigate();
    useEffect(() => {        
        ReactSession.setStoreType('localStorage');
        localStorage.clear();
        navigate("/");
    }, []);
}