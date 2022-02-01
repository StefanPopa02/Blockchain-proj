import { Form, Input, Button, Card, Select } from "antd";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ACTOR_TYPES from "../../ActorTypes";
import CATEGORIES from "../../Categories";
import { GlobalContext } from "../../context/MyContext";
import { createNewEvaluator, createNewFinantator, createNewFreelancer, createNewManager, init } from "../../web3/Web3Client";
import "./Login.css";

const { Option } = Select; 

export default function Login() {
  const { userDetails, setUserDetails } = useContext(GlobalContext);
  const [ additionalInfo, setAdditionalInfo ] = useState(false);
  const history = useNavigate();
  const onFinish = (values) => {
    console.log("Success:", values);
    const role = values.role;
    const username = values.username;
    const category = values.category;
    switch(role){
      case ACTOR_TYPES.MANAGER:
        createNewManager(username).then((result)=>{
          console.log("create Manager", result);
          if(result.status){
            history({pathname : '/'})
            window.location.reload();
          }
        }).catch((err) => {

        });
        return;

      case ACTOR_TYPES.FINANTATOR:
        createNewFinantator(username).then((result)=>{
          console.log("create Finantator", result);
          if(result.status){
            history({pathname : '/'})
            window.location.reload();
          }
        }).catch((err) => {

        });
        return;
      
      case ACTOR_TYPES.FREELANCER:
        createNewFreelancer(username, category).then((result)=>{
          console.log("create Freelancer", result);
          if(result.status){
            history({pathname : '/'})
            window.location.reload();
          }
        }).catch((err)=>{

        });
        return;
            
      case ACTOR_TYPES.EVALUATOR:
        createNewEvaluator(username, category).then((result)=>{
          console.log("create Evaluator", result);
          if(result.status){
            history({pathname : '/'})
            window.location.reload();
          }
        }).catch((err)=>{

        });
        return;
      
      default:
        return;
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onRoleChanged = (value) =>{
    switch(value){
      case ACTOR_TYPES.MANAGER:
        setAdditionalInfo(false);
        return;
      
      case ACTOR_TYPES.FREELANCER:
        setAdditionalInfo(true);
        return;
      
      case ACTOR_TYPES.FINANTATOR:
        setAdditionalInfo(false);
        return;
            
      case ACTOR_TYPES.EVALUATOR:
        setAdditionalInfo(true);
        return;
      
      default:
        return;
    }
  }

  return (
    <div className="container">
      <h2>Welcome to the Market!</h2>
      <Card className="loginCard">
        <Form
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
        >
        <Form.Item
          name="role"
          label="Role"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            placeholder="Select an actor type"
            onChange={onRoleChanged}
            allowClear
          >
            <Option value={ACTOR_TYPES.MANAGER}>Manager</Option>
            <Option value={ACTOR_TYPES.FREELANCER}>Freelancer</Option>
            <Option value={ACTOR_TYPES.EVALUATOR}>Evaluator</Option>
            <Option value={ACTOR_TYPES.FINANTATOR}>Finantator</Option>
          </Select>
        </Form.Item>
          <Form.Item
            label="Username"
            name="username"
            wrapperCol={{
              span: 16,
            }}
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          {additionalInfo &&
          <Form.Item
          name="category"
          label="Category"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            placeholder="Select a category"
            allowClear
          >
            <Option value={CATEGORIES.WEB}>Web</Option>
            <Option value={CATEGORIES.DESKTOP}>Desktop</Option>
            <Option value={CATEGORIES.MOBILE}>Mobile</Option>
            <Option value={CATEGORIES.CONSOLE}>Console</Option>
          </Select>
        </Form.Item>}

          <Form.Item
            wrapperCol={{
              offset: 5,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
                Join
            </Button>
            <Button>
                    <Link to="/">Home</Link>
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
