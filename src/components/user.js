import '../App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


function User() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('');
  const [userRol, setUserRol] = useState()

  const { state } = useLocation();          //CON ESTA FUNCION ALMACENAMOS EL USER EN STATE PARA LUEGO ALMACENARLO EN USER
  let user = state;

  //FUNCION PARA NAVEGAR A ITEMS
  const routeChange = () => {
    sessionStorage.setItem('user', user)
    routeChangeItem(user);
  }
  const navigate = useNavigate();
  const routeChangeItem = (user) => {
    let path = '/item/';
    navigate(path, { state: user });
  }

  const listUsers = async () => {
    await fetch('http://localhost:8080/api/userdata/getall')
      .then((response) => { return response.json() })
      .then((data) => {
        console.log(data);
        setUsers(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  const adminUsers = async () => {
    await fetch('http://localhost:8080/api/userdata/getall')
      .then((response) => { return response.json() })
      .then((data) => {
        console.log(data);
        setUserRol(data ? data.find((element) => {
          if(data.username===element.username){
            return element.rol
          }
          console.log(userRol)
      }) : null)
      })
      .catch((err) => {
        console.log(err.message);
      });
  }


  //añadir usuario

  let addUserData = { username: username, password: password, rol: rol }
  let addUserUrl = new URL('http://localhost:8080/api/userdata')
  for (let k in addUserData) { addUserUrl.searchParams.append(k, addUserData[k]) }
  const addUser = async (e) => {
    if (username == '' || password == '' || rol == '') {
      e.preventDefault();
      alert("Error. Insert username, password and rol.")
    } else {
  
      if (rol === 'ADMIN' || rol === 'USER') {
        e.preventDefault();
        await fetch(addUserUrl, {
          method: 'POST',
          body: JSON.stringify({
            username: username,
            password: password,
            rol: rol,
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        }).then((data) => {
          setUsername('');
          setPassword('');
          setRol('');
          alert("User " + username + " have been added.")
          listUsers();
        })
          .catch((err) => { console.log(err.message); });
      } else {
        e.preventDefault();
        alert("Error. Only values ADMIN or USER allowed in ROL.")
      }
    }
  };


  //actualizar usuario

  let updateUserData = { username: username }
  let updateUserUrl = new URL('http://localhost:8080/api/userdata')
  for (let k in updateUserData) { updateUserUrl.searchParams.append(k, updateUserData[k]) }

  const updateUser = async (e) => {
    if (username == '' || password == '' || rol == '') {
      e.preventDefault();
      alert("Error. Insert username, password and rol.")
    } else {
      if (rol === 'ADMIN' || rol === 'USER') {
        e.preventDefault();
        await fetch(updateUserUrl, {
          method: 'PUT',
          body: JSON.stringify({
            username: username,
            password: password,
            rol: rol,
          }),
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          }
        })
          .then((response) => response.json())
          .then((data) => {
            setUsername('');
            setPassword('');
            setRol('');
            alert("User " + username + " have been updated.")
            listUsers();
          })
          .catch((err) => { console.log(err.message); });
      } else {
        e.preventDefault();
        alert("Error. Only values ADMIN or USER allowed in ROL.")
      }
    }
  };

  //borrar usuario

  let deleteUserData = { username: username }
  let deleteUserUrl = new URL('http://localhost:8080/api/userdata')
  for (let k in deleteUserData) { deleteUserUrl.searchParams.append(k, deleteUserData[k]) }
  const deleteUser = async (e) => {
    if (username == '') {
      e.preventDefault();
      alert("Error. Insert a valid Username.")
    } else {
      await fetch(deleteUserUrl, {
        method: 'DELETE',
      }).then((response) => {
        e.preventDefault();
        if (response.status === 204) {
          alert("User " + username + " have been eliminated.")
          listUsers();
        } else {
          alert("User " + username + " not found.")
        }
      });
    }
  };

  useEffect(() => {
    //  addEventListener("Clipboard", (evenet)=>console.log(evenet))...
    listUsers();
    if(user===null){
      navigate("/");
    }
    console.log(user)

  }, [])

  return (

    <div className="App">
      <header className="App-header">

        <div>
          <button onClick={routeChange}>ITEMS</button>
        </div>
        <div><h1>USERS</h1></div>
        <form>
          <p>
            <label>Username:    </label>
            <input type="text" className="form-control" onChange={(e) => setUsername(e.target.value)} />
          </p>
          <p>
            <label>
              Password:         </label>
            <input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} />
          </p>
          <p>
            <label>
              Rol:         </label>
          <select name="form-control" id="rols" onChange={(e) => setRol(e.target.value)}>
              <option >CHOOSE A ROL</option>
              <option value="ADMIN">ADMIN</option>
              <option value="USER">USER</option>
          </select>
          </p>
          <div>
            <button onClick={addUser}>ADD USER</button>
            <button onClick={deleteUser}>DELETE USER</button>
            <button onClick={updateUser}>UPDATE USER</button>
          </div>
        </form>

        <div className="users-table">
          <p>USERS LIST</p>
          <div className="users-name" >
            <table summary="USERS LIST">
              <tbody>
                <tr>
                  <th>USERNAME</th>
                  <th>PASSWORD</th>
                  <th>ROL</th>
                  <th> </th>
                  <th> </th>
                </tr>
                {users.map((user, index) => {
                  return (
                    <tr key={index}>
                      <td>{user.username}</td>
                      <td>{user.password}</td>
                      <td>{user.rol}</td>
                    </tr>
                  );

                })
                }
              </tbody>
            </table>
          </div>

        </div>

      </header>
    </div>
  );
}

export default User;
