import React, { useState } from "react";
import { Form, Input, Modal, notification, Select, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

interface IProps {
  access_token: string;
  getData: () => Promise<void>;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (v: boolean) => void;
}

const CreateTrackModal = (props: IProps) => {
  const { access_token, getData, isCreateModalOpen, setIsCreateModalOpen } =
    props;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleCloseCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(false);
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const { title, description, category, trackUrl, imgUrl } = values;

      const data = {
        title,
        description,
        category,
        trackUrl,
        imgUrl: values.imgUrl || "default.png",
      };

      const res = await fetch("http://localhost:8000/api/v1/tracks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const d = await res.json();

      if (d.data) {
        await getData();
        notification.success({
          message: "Track created successfully!",
        });
        handleCloseCreateModal();
      } else {
        notification.error({
          message: "Something went wrong!",
          description: JSON.stringify(d.message),
        });
      }
    } catch (error) {
      notification.error({
        message: "Server Error",
        description: "Could not connect to the server.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBeforeUpload = (file: File) => {
    const extension = file.name.substring(file.name.lastIndexOf("."));
    form.setFieldsValue({ trackUrl: extension });
    return false; // Prevent automatic upload
  };

  return (
    <Modal
      title={<div style={{ textAlign: "center" }}>Add New Track</div>}
      open={isCreateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseCreateModal}
      maskClosable={false}
      confirmLoading={loading}
    >
      <Form form={form} name="trackForm" onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input the title!" }]}
          style={{ marginBottom: 5 }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Artist"
          name="description"
          rules={[
            { required: true, message: "Please input the artist's name!" },
          ]}
          style={{ marginBottom: 5 }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please select a category!" }]}
          style={{ marginBottom: 5 }}
        >
          <Select placeholder="Select a category">
            <Option value="CHILL">CHILL</Option>
            <Option value="WORKOUT">WORKOUT</Option>
            <Option value="PARTY">PARTY</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Upload File"
          name="file"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          rules={[{ required: true, message: "Please upload a file!" }]}
          style={{ marginBottom: 5 }}
        >
          <Upload beforeUpload={handleBeforeUpload} maxCount={1}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="File Extension"
          name="trackUrl"
          rules={[{ required: true, message: "Missing file extension!" }]}
        >
          <Input readOnly />
        </Form.Item>

        <Form.Item
          label="Image"
          name="imgUrl"
          rules={[{ required: true, message: "Please upload an image!" }]}
          style={{ marginBottom: 5 }}
        >
          <Upload
            beforeUpload={(file) => {
              form.setFieldsValue({ imgUrl: file.name }); // hoặc URL nếu có
              return false; // prevent auto upload
            }}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTrackModal;
