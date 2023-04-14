import '../App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


function CreateItem() {
    const [suppliers, setSuppliers] = useState([]);
    const [items, setItems] = useState([]);
    const [itemCode, setItemCode] = useState([]);
    const [itemDescription, setItemDescription] = useState([]);
    const [itemPrice, setItemPrice] = useState([]);
    const [itemUsername, setItemUsername] = useState([]);
    const [itemState, setItemState] = useState([]);



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

  const addItem = async (e) => {
    if (itemCode == '' || itemDescription == '' || itemPrice == '') {
      e.preventDefault();
      alert("Error. Insert username, password and rol.")
    } else {
        e.preventDefault();
        await fetch('http://localhost:8080/api/itemdata', {
          method: 'POST',
          body: JSON.stringify({
            code: itemCode,
            description: itemDescription,
            price: itemPrice,
            state: "ACTIVE",
            username: user
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        }).then(() => routeChange())
          .catch((err) => { console.log(err.message); });
    }
  };

    useEffect(() => {
        //  addEventListener("Clipboard", (evenet)=>console.log(evenet))...
        console.log(user)
    }, [])

    return (

        <div className="App">
            <header className="App-header">
                <div>
                    <button onClick={routeChange}>USERS</button>
                </div>
                <form>
                <div className="items">
                    <p>CREATE ITEM</p>

                </div>
                    <p>
                        <label>Item Code:    </label>
                        <input id="code" type="text" className="form-control-itemcode" onChange={(e) => setItemCode(e.target.value)} />
                    </p>
                    <p>
                        <label>Description:         </label>
                        <input type="text" className="form-control-description" onChange={(e) => setItemDescription(e.target.value)} />
                    </p>
                    <p>
                        <label>Price:         </label>
                        <input type="text" className="form-control-price" onChange={(e) => setItemPrice(e.target.value)} />
                    </p>
                    <div>
                        <button onClick={addItem}>ADD ITEM</button>
                        <button onClick={routeChange}>CANCEL</button>
                    </div>
                </form>

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

export default CreateItem;