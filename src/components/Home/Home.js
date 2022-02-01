import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../context/MyContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Card } from 'antd';
import "./Home.css"
import { getUserDetails } from '../../web3/Web3Client';
import { getActorTypeString } from '../../ActorTypes';

const Home = () => {
    const history = useNavigate();
    const { userDetails, setUserDetails } = useContext(GlobalContext);
    const [name, setName] = useState('');
    const [ready, setReady] = useState(false);

    useEffect(()=>{
        getUserDetails(parseInt(userDetails.actorType)).then((result)=>{
            if(result){ 
                setName(result.nume);            
                setUserDetails({
                    ...userDetails, 
                    ...result
                })
                setReady(true);
            }
        }); 
           
    },[userDetails.actorType])

    useEffect(()=>{
        
    }, [name])

    useEffect(()=>{
        if(ready){
            if(userDetails.actorType == 0){
                history({pathname : '/join'})
            }
        }
    }, [ready, userDetails.actorType])
    
    return (
        <div className='container'>
            <Card className='my-card' title="Tech Freelancing">
                <p>{`Hello, ${userDetails.name}`}</p>
                <p>Welcome back to the marketplace</p>
                {userDetails.actorType && <p>{`Your role: ${getActorTypeString(parseInt(userDetails.actorType))}`}</p>}
                {userDetails.reputatie && <p>{`Your reputation: ${userDetails.reputatie}`}</p>}
                { userDetails.actorType != 0 ? 
                <Button>
                    <Link to={`dashboard/${userDetails.actorType}`}>Next</Link>
                </Button>
                :
                <Button>
                    <Link to="/join">Join</Link>
                </Button>
                }
            </Card>
        </div>
    );
};

export default Home;
