import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notify, setNotify] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post('http://localhost:8000/signin', { email, password })
      .then((result) => {
        if (result.data === 'Success') {
          // login succ
          setNotify('Sign Successful');
          navigate('/home');
        } else if (result.data === 'Pass wrong') {
          // wrong pass
          setNotify('Incorrect Password');
        } else {
          // no user
          setNotify('No user found please signup');
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className='flex bg-[#d4d4d8] h-screen'>
      <div className='w-full flex mx-16 my-10 mx-auto shadow-xl rounded-lg justify-center bg-white'>
        <div className='mb-2 mt-2'>
          <input
            className='border border-[#3f3f46]/50 p-1 focus:border-blue-600 shadow-md rounded-l-lg focus:outline-none py-1'
            type='email'
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter Location'
            style={{ width: '300px' }}
          />
        </div>
        <button
          type='submit'
          style={{ marginBottom: '472px' }}
          className='mt-2 bg-blue-600 text-white px-5 shadow-lg py-1 rounded-r-lg focus:outline-none'>
          Search
        </button>
        <button 
          style={{ marginBottom: '472px' }}
          className='mt-2 ml-5 bg-blue-600 text-white px-5 shadow-lg py-1 rounded-lg focus:outline-none'>
          Use Current Location
        </button>
      </div>
    </div>
  );
}

export default Signin;
