import React, { useState } from 'react';
import axios from 'axios';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notify, setNotify] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('http://localhost:8000/signup', { name, email, password })
      .then((result) => {

        if (result.data === 'User found') {
          // already regis
          setNotify('Already registered please Sign in')
          setTimeout(() => {
            navigate('/signin');
          }, 2000);
          
        } else {
          // new regis
          setNotify('Registered Successfully....!')
          setTimeout(() => {
            navigate('/home');
          }, 1000); 
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
    <div className='flex items-center justify-center bg-[#d4d4d8] h-screen'>
    <div className='w-full max-w-md mx-auto shadow-xl rounded-lg pl-20 pr-20 bg-white'>
      <div className='mb-3 ml-24'>
        <h1 className='font-bold mt-3 text-2xl'>Sign Up</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='mb-5'>
          <input
            className='border border-[#3f3f46]/50 p-2 focus:border-blue-600 shadow-md rounded-lg focus:outline-none w-full py-1.5'
            type='text'
            onChange={(e) => setName(e.target.value)}
            placeholder='Name'
          />
        </div>
        <div className='mb-5'>
          <input
            className='border border-[#3f3f46]/50 p-2 focus:border-blue-600 shadow-md rounded-lg focus:outline-none w-full py-1.5'
            type='email'
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email id'
          />
        </div>
        <div className='mb-5'>
          <input
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            required
            className='border border-[#3f3f46]/50 p-2 focus:border-blue-600 shadow-md rounded-lg focus:outline-none w-full py-1.5'
          />
        </div>
        <button
          type='submit'
          className='w-3/4 mb-2 ml-8 bg-blue-600 shadow-md text-white px-4 py-2 rounded-full'
        >
          Register
        </button>
        <div className='mb-2'>
          <h1 className='text-[#16a34a]/80'>{notify}</h1>
        </div>
      </form>
    </div>
    </div>
    <Footer/>
    </>
  );
}

export default Signup;
