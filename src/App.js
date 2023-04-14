
import './App.css';
import { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Users from './components/user';
import Home from './components/login';
import Items from './components/item';
import CreateItems from './components/createItem';
import UpdateItems from './components/updateItem';



function App() {
  

  useEffect(() => {
    //  addEventListener("Clipboard", (evenet)=>console.log(evenet))...
  }, [])

  return (
    
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user" element={<Users />} />
            <Route path="/item" element={<Items />}/>
            <Route path="/createitem" element={<CreateItems />}/>
            <Route path="/updateitem" element={<UpdateItems />}/>
         </Routes>
      </BrowserRouter>
     
  );
}

export default App;
