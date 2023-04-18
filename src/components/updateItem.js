import '../App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


function UpdateItem() {
    const [suppliers, setSuppliers] = useState([]);
    const [items, setItems] = useState([]);
    const [itemCode, setItemCode] = useState();
    const [itemDescription, setItemDescription] = useState();
    const [itemPrice, setItemPrice] = useState();
    const [reducedPrice, setReducedPrice] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [supplierName, setSupplierName] = useState('');
    const [supplierCountry, setSupplierCountry] = useState('');
    const [foundItem, setFoundItem] = useState({});
    const [reason, setReason] = useState({});

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

    //FUNCIÓN PARA LISTAR LOS ITEMS

    const listItems = async () => {

        await fetch('http://localhost:8080/api/itemdata/')
            .then((response) => { return response.json() })
            .then((data) => {

                setItems(data);
                setFoundItem(data ? data.find((element) => {
                    return element.code === "ch1";
                }) : null)
                console.log(foundItem)
                console.log(foundItem.priceReductions)

            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    let searchItemData = { code: itemCode }
    let deleteItemUrl = new URL('http://localhost:8080/api/itemdata')
    for (let k in searchItemData) { deleteItemUrl.searchParams.append(k, searchItemData[k]) }
    const listItem = async (e) => {
        e.preventDefault();
        await fetch(deleteItemUrl)
            .then((response) => { return response.json() })
            .then((data) => {

                setFoundItem(data);
                console.log(foundItem)
                console.log(foundItem.priceReductions)

            })
            .catch((err) => {
                console.log(err.message);
            });
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

    //FUNCION PARA ACTUALIZAR LOS ITEMS

    const body = {
        code: foundItem.code,
        description: itemDescription??foundItem.description,
        price: itemPrice??foundItem.price,
        state: "ACTIVE",
        priceReductions: [{
            reducedPrice: reducedPrice,
            startDate: startDate,
            endDate: endDate
        }],
        suppliersData: [{
            name: supplierName,
            country: supplierCountry
        }]
    }
    console.log(body)

    const updateItem = (e) => {
        e.preventDefault();

        if(foundItem.state==="ACTIVE"){
            fetch('http://localhost:8080/api/itemdata', {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json; charset=UTF-8',
            }
        }).then(() => routeChange())
            .catch((err) => { console.log(err.message); });


        }else{
            alert("Only active items can be updated.")
        }

        
    };

    //FUNCION PARA DESACTIVAR LOS ITEMS

    const desactivateBody = {
        itemDto:
        {
            code: itemCode
        },
        username: user,
        reason: reason,
        observation: "Este es un dato inservible que nunca vamos a usar"
    }
    console.log(desactivateBody)
    const desactivateItem = async (e) => {
        e.preventDefault();
        await fetch("http://localhost:8080/api/itemdata/discontinue", {
            method: 'PUT',
            body: JSON.stringify(desactivateBody),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json; charset=UTF-8',
            }
        }).then((response) => {
            if (response.status === 201) {
                listItem(e);
                alert("Item " + itemCode + " have been discontinued.")
            } else {
                alert("Item " + itemCode + " not found.")
            }
        });
    };

    useEffect(() => {
        //  addEventListener("Clipboard", (evenet)=>console.log(evenet))...
        console.log(user)
        if(user===null){
            navigate("/");
        }
        //console.log(foundItem.code)
    }, [])

    console.log(foundItem)

    return (

        <div className="App">
            <header className="App-header">
                <div>
                    <button onClick={routeChange}>USERS</button>
                </div>
                <form>
                    <div className="items">
                        <p>UPDATE ITEM</p>
                        <label>Item Code:         </label>
                        <input type="text" className="form-control-description" onChange={(e) => setItemCode(e.target.value)} />
                        <button onClick={listItem}>Search Item</button>
                    </div>
                    <p>
                        <label>Description:         </label>
                        <input type="text" placeholder={foundItem.description} className="form-control-description" onChange={(e) => setItemDescription(e.target.value)} />

                        <label>Price:         </label>
                        <input type="text" placeholder={foundItem.price} className="form-control-price" onChange={(e) => setItemPrice(e.target.value)} />
                    </p>

                    <div>
                        <p>ADD SUPPLIER TO ITEM</p>
                        <p>
                            <label>NAME:    </label>
                            <input id="code" type="text" className="form-control-itemcode" onChange={(e) => setSupplierName(e.target.value)} />

                            <label>COUNTRY:         </label>
                            <input type="text" className="form-control-description" onChange={(e) => setSupplierCountry(e.target.value)} />
                        </p>
                    </div>
                    <div>
                        <p>ADD PRICE REDUCTION TO ITEM</p>
                        <p>
                            <label>REDUCED PRICE:    </label>
                            <input id="code" type="text" className="form-control-itemcode" onChange={(e) => setReducedPrice(e.target.value)} />

                            <label>START DATE:         </label>
                            <input type="text" className="form-control-description" onChange={(e) => setStartDate(e.target.value)} />

                            <label>END DATE:         </label>
                            <input type="text" className="form-control-description" onChange={(e) => setEndDate(e.target.value)} />
                        </p>
                    </div>
                    <div>
                        <label>REASON:         </label>
                        <select name="form-control" id="reasons" onChange={(e) => setReason(e.target.value)}>
                            <option >SELECT REASON</option>
                            <option value="DEFECTIVED">DEFECTIVED</option>
                            <option value="UNAVAILABLE">UNAVAILABLE</option>
                            <option value="UNEVEN">UNEVEN</option>
                            <option value="UNPROVIDED">UNPROVIDED</option>
                        </select>
                        <button onClick={desactivateItem}>DISCONTINUE ITEM</button>
                        <button onClick={updateItem}>UPDATE ITEM</button>
                        <button onClick={routeChange}>CANCEL</button>
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
                                <tr >
                                    <td>{foundItem ? foundItem.code : null}</td>
                                    <td>{foundItem ? foundItem.description : null}</td>
                                    <td>{foundItem ? foundItem.state : null}</td>
                                    <td>{foundItem ? foundItem.price : null}</td>
                                    <td>{foundItem ? foundItem.creationDate : null}</td>
                                    <td>{foundItem ? foundItem.username : null}</td>
                                </tr>
                                <tr>
                                    <th>SUPPLIER NAME</th>
                                    <th>SUPPLIER COUNTRY</th>
                                </tr>
                                {foundItem && foundItem.suppliersData?.map((foundSupplierData, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{foundSupplierData ? foundSupplierData.name : null}</td>
                                            <td>{foundSupplierData ? foundSupplierData.country : null}</td>

                                        </tr>
                                    );
                                })}

                                <tr>
                                    <th>PRICE REDUCTION</th>
                                    <th>START DATE</th>
                                    <th>END DATE</th>
                                </tr>
                                {foundItem && foundItem.priceReductions?.map((foundPriceReduction, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{foundPriceReduction ? foundPriceReduction.reducedPrice : null}</td>
                                            <td>{foundPriceReduction ? foundPriceReduction.startDate : null}</td>
                                            <td>{foundPriceReduction ? foundPriceReduction.endDate : null}</td>
                                        </tr>
                                    );
                                })}
                                <tr >
                                </tr>

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

export default UpdateItem;