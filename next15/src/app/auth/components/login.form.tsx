"use client";
import { handleLoginAntd } from "@/app/users/action";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input } from "antd";
import { useState } from "react";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const LoginForm = () => {
  //
  const [isSubmit, setIsSubmit] = useState(false);
  //
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const res = await handleLoginAntd(values);
    setIsSubmit(true);
    console.log(values);
  };
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5", // Optional: adds a light background
      }}
    >
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ width: 400 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        scrollToFirstError
      >
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          name="remember"
          valuePropName="checked"
          label={null}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item label={null}>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmit}
            style={{ width: "100%" }}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
