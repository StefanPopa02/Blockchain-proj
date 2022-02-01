import React from "react";
import "./TaskCreate.css";
import { Form, Input, Button, Select, Card, InputNumber, Alert } from 'antd';
import CATEGORIES from "../../../../Categories";
import { useState } from "react/cjs/react.development";
import { createNewTask } from "../../../../web3/Web3Client";


const { Option } = Select;

export default function TaskCreate() {
  const formRef = React.createRef();

  const warnings = { 
    ready: false,
    success: true
  }
  const [alert, setAlert] = useState(warnings)
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const onFinish = (values) => {
    console.log("values from form", values);
    const description = values.description;
    const RF = values.rf;
    const RE = values.re;
    const category = values.category;
    createNewTask(description, RF, RE, category).then((result) =>{
      if(result.status){
        setAlert({
          ready: true,
          success: true
        })
        return;
      }
      setAlert({
        ready: true,
        success: false
      })
    })
  }

  return (
    <div className="container">
      <h2>Create New Task</h2>
      <Card className="my-card">
        <Form {...layout} name="control-ref" onFinish={onFinish}>
            <Form.Item name="description" label="Description" rules={[{ required: true }]}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="rf" label="RF" rules={[{ required: true }]}>
              <InputNumber />
            </Form.Item>
            <Form.Item name="re" label="RE" rules={[{ required: true }]}>
              <InputNumber />
            </Form.Item>
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
              placeholder="Select an actor type"
            >
              <Option value={CATEGORIES.WEB}>Web</Option>
              <Option value={CATEGORIES.DESKTOP}>Desktop</Option>
              <Option value={CATEGORIES.MOBILE}>Mobile</Option>
              <Option value={CATEGORIES.CONSOLE}>Console</Option>
            </Select>
          </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
            {
              alert.ready && 
              (alert.success ? 
            <Alert
              message="Success"
              description="Task created succesfully!"
              type="success"
              showIcon
            />
              :
            <Alert
            message="Fail"
            description="Creating task failed!"
            type="error"
            showIcon
          />)
           }
        </Form>
      </Card>
    </div>
  );
}
