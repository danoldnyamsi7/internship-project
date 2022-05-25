import React from 'react';


function Searchbar(props) {
      const inputEl = React.useRef("");

      

      const handleSubmit = (e)=>{
           e.preventDefault();
           
      }

      const getSearchTerm = ()=>{
            console.log(inputEl.current.value)
            props.searchKeyword(inputEl.current.value)
      }


     

      return (

            <div className=" bg-white p-3 ">
                  {/* <form action='/' method='GET' onSubmit={handleSubmit} autoComplete="off"> */}
                  <form action='/' method='GET' autoComplete="off" onSubmit={handleSubmit}>
                        {/* <input value={props.term} ref={inputEl} onChange={getSearchTerm} className="rounded bg-gray-200 w-2/4 text-black-300 py-2 pl-2" type="search" name="search" placeholder='search...' autoComplete='off' /> */}
                        <input ref={inputEl} onChange={getSearchTerm} className="rounded bg-gray-200 w-2/4 text-black-300 py-2 pl-2" type="search" name="search" placeholder='search...' defaultValue={props.term} autoComplete='off' />
                        <button className="rounded bg-gray-500 w-20 py-2.5 hover:bg-gray-700 text-white ml-3 text-sm " type="submit">Search</button>
                  </form>
            </div>
            
      )
}

export default Searchbar;