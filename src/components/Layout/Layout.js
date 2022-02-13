import React, { useEffect, useState } from 'react'
import { Outlet, Link } from 'react-router-dom';
import { exchangeWeiForTokensWeb3, getCurrentUserBalanceWeb3 } from '../../web3/Web3Client';
import CollectionCreateForm from './CustomModal';
const Layout = () => {

    const [currentBalance, setCurrentBalance] = useState(0);
    useEffect(()=>{
        const loadCurrentBalance = async () =>{
            const balance = await getCurrentUserBalanceWeb3();
            setCurrentBalance(balance);
        }
        loadCurrentBalance();
    },[])

    const [visible, setVisible] = useState(false);
    
    const onCreate = (values) => {
        console.log('Received values of form: ', values);
        setVisible(false);
        exchangeWeiForTokensWeb3(String(values.value)).then((result)=>{
            if(result.status){
                window.location.reload();
            }
        })
    };
      
    return (
        <div>
          <h2 
          style={{cursor: 'pointer'}}
          onClick={() => {
          setVisible(true);
        }}>{`Your balance: ${currentBalance}`}</h2>
            <CollectionCreateForm
                visible={visible}
                onCreate={onCreate}
                onCancel={() => {
                setVisible(false);
                }}
            />
          <main>
            <Outlet />
          </main>
        </div>
      );
}





export default Layout