import { Form, Modal, Input, InputNumber } from "antd";

const CollectionCreateForm = ({ visible, onCreate, onCancel }) => {
    const [form] = Form.useForm();
    return (
      <Modal
        visible={visible}
        title="Exchange wei for tokens"
        okText="Buy"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onCreate(values);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: 'public',
          }}
        >
          <Form.Item
            name="value"
            label="Amount of tokens"
            rules={[
              {
                required: true,
                message: 'Please input the amount of tokens you want to buy!',
              },
            ]}
          >
            <InputNumber style={{width: '100%'}}/>
          </Form.Item>

        </Form>
      </Modal>
    );
  };

  export default CollectionCreateForm
  
  