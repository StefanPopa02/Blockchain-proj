import { createContext, useState } from "react";
import { useEffect } from "react/cjs/react.development";
import { getUserType } from "../web3/Web3Client";
import { Spin } from 'antd';

export const GlobalContext = createContext()

const currentState = {
  actorType: 0,
  name: ''
}

const MyContext = ({children}) => {
    const [userDetails, setUserDetails] = useState(currentState);
    const [tasks, setTasks] = useState([]);
    const [spinner, setSpinner] = useState(true);

    useEffect(()=>{
      const checkUserType = async () =>{
        const actorTypeResponse = await getUserType();
        setUserDetails({...userDetails, actorType: actorTypeResponse});
        setSpinner(false);
      }
      checkUserType();
    }, [userDetails.actorType]);

    return (
        <GlobalContext.Provider value={{userDetails, setUserDetails, tasks, setTasks, spinner, setSpinner}}>
          <div style={{display: spinner ? 'none' : 'block'}}>
            {children}
          </div>
          <Spin spinning={spinner} size="large" style={{position: 'absolute', top: '50%', left: '50%'}}/> 
        </GlobalContext.Provider>
    )
};

export default MyContext;
