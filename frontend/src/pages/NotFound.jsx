import React from 'react'
import { Link } from 'react-router-dom'


const NotFound = () => {
  return (
  <>
  <section className="notfound min-h-screen bg-gray-100 flex items-center justify-center">
  <div className="content text-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
    <h1 className="text-4xl font-extrabold text-gray-800 mb-4">404 Not Found</h1>
    <p className="text-lg text-gray-600 mb-6">Your visited page is not found. You may go back to the home page.</p>
    <Link 
      to="/" 
      className="btn bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out"
    >
      Back to Home Page
    </Link>
  </div>
</section>

  </>
  )
}

export default NotFound