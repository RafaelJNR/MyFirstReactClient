import { useState } from 'react';
import '../App.css';
import { useNavigate } from "react-router-dom";


function Login() {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  //FUNCION DE LOGIN

  let loginData = {username: username, password: password}
  let loginUrl = new URL('http://localhost:8080/api/userdata/searchbynameandpassword')
  for (let k in loginData){loginUrl.searchParams.append(k, loginData[k])}
  const login = async (e) => {
    e.preventDefault();
    await fetch(loginUrl).
      then(response=>response.text()).
      then(data=>{
      sessionStorage.setItem('username', username)
      if(data!='true'){
      alert("Authentication Error. Incorrect username or password.")
      }else{
      routeChange(username); 
      } 
    }) 
          
  }

    //FUNCION PARA NAVEGAR A ITEM UNA VEZ AUTENTICADO.
  const navigate = useNavigate();
  const routeChange =(username)=>{
    let user = username;
    let path = '/item/';
    navigate(path, {state: user});
  }

  return (

    <div className="App">
      <header className="App-header">
        <div><h1>LOGIN</h1></div>
        <form>
          <p>
            <label>Username:    </label>
              <input type="text" className="form-control" onChange={(e)=>setUsername(e.target.value)}/>
          </p>
          <p>
            <label>
              Password:         </label>
              <input type="password" className="form-control" onChange={(e)=>setPassword(e.target.value)}/>
          </p> 
          <button onClick={login}>Login</button>
        </form>
      </header>
    </div>
  );
}

export default Login;
