import React from 'react'
import {useNavigate} from 'react-router-dom'
import Footer from './Footer';

function Home() {

  const navigate = useNavigate();

  const handleClick = (event) => {
    event.preventDefault()

    navigate('/signin');
  }

  return (
    <>
    <div className='bg-blue-600 flex mt-1.5 rounded-full'>
      <h1 className='text-white mt-1 font-bold flex justify-center ml-40'>WELCOME TO DASHBOARD</h1>
      <button
      type='submit'
      onClick={handleClick}
      className='ml-auto mr-16 mt-1 bg-white mb-1.5 flex font-bold justify-center shadow-2xl text-black/65 px-4 py-0.8 rounded-full'>
        Logout
      </button>
    </div>
    <div className='h-screen bg-white'></div>
    <Footer/>
    </>
  )
}

export default Home
