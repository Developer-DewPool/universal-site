import React, { useState } from 'react';
import axios from 'axios';
import { setUserSession } from '../Utils/Common';

function Login(props) {
  const [loading, setLoading] = useState(false);
  const username = useFormInput('');
  const password = useFormInput('');
  const [error, setError] = useState(null);

  // handle button click of login form
  const handleLogin = () => {
    setError(null);
    setLoading(true);
    axios.post('http://127.0.0.1:8000/student/login', { username: username.value, hashcode: password.value }).then(response => {
      // console.log(response)
      if (!response.data.error) {
        setLoading(false);
        setUserSession(response.data.token, response.data.data);
        props.history.push('/dashboard');
      } else {
        console.log(response.data.message);
        setLoading(false);
        if (response.data.error) setError(response.data.message);
        else setError("Something went wrong. Please try again later.");
      }
      
    }).catch(error => {
      console.log(error.data.message);
      setLoading(false);
      if (error.error === 401) setError(error.data.message);
      else setError("Something went wrong. Please try again later.");
    });
  }

  return (
    <div>
      Login<br /><br />
      <div>
        Username<br />
        <input type="text" {...username} autoComplete="new-password" />
      </div>
      <div style={{ marginTop: 10 }}>
        Password<br />
        <input type="password" {...password} autoComplete="new-password" />
      </div>
      <br />
      {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
      <input type="button" value={loading ? 'Loading...' : 'Login'} onClick={handleLogin} disabled={loading} /><br />
    </div>
  );
}

const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}

export default Login;