import { createContext, useState } from "react";
import { useEffect } from "react/cjs/react.development";
import { getUserType } from "../web3/Web3Client";

export const GlobalContext = createContext()

const currentState = {
  actorType: 0,
  name: ''
}

const MyContext = ({children}) => {
    const [userDetails, setUserDetails] = useState(currentState);
    const [tasks, setTasks] = useState([]);

    useEffect(()=>{
      const checkUserType = async () =>{
        const actorTypeResponse = await getUserType();
        setUserDetails({...userDetails, actorType: actorTypeResponse});
      }
      checkUserType();
    }, [userDetails.actorType]);

    return (
        <GlobalContext.Provider value={{userDetails, setUserDetails, tasks, setTasks}}>
            {children}
        </GlobalContext.Provider>
    )
};

export default MyContext;
