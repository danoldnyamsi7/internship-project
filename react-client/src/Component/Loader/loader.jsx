import React from 'react'

function Loader() {
  return (
    <div className="bg-green-800 h-screen">
          <img className="rounded-full outline outline-white p-1 outline-[10px] w-[350px] h-[350px] transform translate-y-[50%] translate-x-[150%]" src={require('../../favicon.gif')} alt="" />
    </div>
  )
}

export default Loader;