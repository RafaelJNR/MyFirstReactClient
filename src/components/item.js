import '../App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


function Item() {
    const [suppliers, setSuppliers] = useState([]);
    const [items, setItems] = useState([]);
    const [itemCode, setItemCode] = useState([]);
    const [itemDescription, setItemDescription] = useState([]);
    const [itemPrice, setItemPrice] = useState([]);
    const [itemUsername, setItemUsername] = useState([]);
    const [itemState, setItemState] = useState([]);



    const { state } = useLocation();          //CON ESTA FUNCION ALMACENAMOS EL USER EN STATE PARA LUEGO ALMACENARLO EN USER
    let user = state;

    // FUNCIÓN PARA CAMBIAR A LA PÁGINA DE USUARIOS

    const routeChange = () => {
        sessionStorage.setItem('user', user)
        routeChangeUser(user);
    }
    const navigate = useNavigate();
    const routeChangeUser = (user) => {
        let path = '/user/';
        navigate(path, { state: user });
    }

    // FUNCIÓN PARA CAMBIAR A LA PÁGINA DE AÑADIR ITEM
    const routeChangeCreate = () => {
        sessionStorage.setItem('user', user)
        routeChangeCreateItem(user);
    }
  
    const routeChangeCreateItem = (user) => {
        let path = '/createitem/';
        navigate(path, { state: user });
    }

    // FUNCIÓN PARA CAMBIAR A LA PÁGINA DE AÑADIR ITEM
    const routeChangeUpdate = () => {
        sessionStorage.setItem('user', user)
        routeChangeUpdateItem(user);
    }
  
    const routeChangeUpdateItem = (user) => {
        let path = '/updateitem/';
        navigate(path, { state: user });
    }

    //FUNCIÓN PARA LISTAR LOS SUPPLIERS

    const listSuppliers = async () => {

        await fetch('http://localhost:8080/api/supplier/getall')
            .then((response) => { return response.json() })
            .then((data) => {
                console.log(data);
                setSuppliers(data);
            })
            .catch((err) => {
                console.log(err.message);
            });

    }

        //FUNCION PARA LISTAR LOS ITEMS

    const listItems = async () => {

        await fetch('http://localhost:8080/api/itemdata/getall')
            .then((response) => { return response.json() })
            .then((data) => {
                console.log(data);
                setItems(data);
            })
            .catch((err) => {
                console.log(err.message);
            });

    }

        //FUNCION PARA BORRAR LOS ITEMS POR EL CODE
    let deleteItemData = { code: itemCode }
    let deleteItemUrl = new URL('http://localhost:8080/api/itemdata')
    for (let k in deleteItemData) { deleteItemUrl.searchParams.append(k, deleteItemData[k]) }
    console.log(deleteItemUrl)
    const deleteItem = async (e) => {
        if (itemCode == '') {
            e.preventDefault();
            alert("Error. Insert a valid Username.")
        } else {
            e.preventDefault();
            await fetch(deleteItemUrl, {
                method: 'DELETE',
            }).then((response) => {
                if (response.status === 204) {
                    alert("User " + itemCode + " have been eliminated.")
                    listItems();
                } else {
                    alert("User " + itemCode + " not found.")
                }
            });
        }
    };


    useEffect(() => {
        //  addEventListener("Clipboard", (evenet)=>console.log(evenet))...
        listItems();
        console.log(user)
    }, [])

    return (

        <div className="App">
            <header className="App-header">
                <div>
                    <button onClick={routeChange}>USERS</button>
                </div>
                <form>
                    <p>
                        <label>Item Code:    </label>
                        <input id="code" type="text" className="form-control-itemcode" onChange={(e) => setItemCode(e.target.value)} />
                    </p>
                    <div>
                        <button onClick={routeChangeCreate}>ADD ITEM</button>
                        <button onClick={deleteItem}>DELETE ITEM</button>
                        <button onClick={routeChangeUpdate}>UPDATE ITEM</button>
                        
                    </div>
                </form>

                <div className="items">
                    <p>ITEMS LIST</p>
                    <div className="items-table" >
                        <table summary="ITEMS LIST">
                            <tbody>
                                <tr>
                                    <th>ITEM CODE</th>
                                    <th>DESCRIPTION</th>
                                    <th>STATE</th>
                                    <th>PRICE</th>
                                    <th>CREATION DATE</th>
                                    <th>CREATOR</th>
                                </tr>
                                {items.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.code}</td>
                                            <td>{item.description}</td>
                                            <td>{item.state}</td>
                                            <td>{item.price}</td>
                                            <td>{item.creationDate}</td>
                                            <td>{item.username}</td>
                                        </tr>
                                    );
                                })
                                }
                            </tbody>
                        </table>
                    </div>

                </div>


                <div className="suppliers-container">
                    {suppliers.map((supplier, index) => {

                        return (
                            <div className="supplier-name" key={index}>
                                <h4>Supplier: {supplier}</h4>
                            </div>

                        );
                    })
                    }
                </div>
            </header>
        </div>

    );
}

export default Item;