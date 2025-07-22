import React from "react";
import { Button, Form, Input } from "antd";

const StepPersonalInfo = ({ onNext, onBack }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onNext({ info: values });
  };

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      layout="vertical"
      className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8"
    >
      <h2 className="text-xl font-bold mb-6 text-blue-600 text-center">
        Thông tin cá nhân
      </h2>
      <Form.Item
        label="Họ tên"
        name="fullName"
        rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
      >
        <Input className="rounded-lg h-10" />
      </Form.Item>
      <Form.Item
        label="Ngày sinh"
        name="dob"
        rules={[{ required: true, message: "Vui lòng nhập ngày sinh" }]}
      >
        <Input type="date" className="rounded-lg h-10" />
      </Form.Item>
      <div className="flex gap-4 mt-4 w-full justify-between">
        <Button onClick={onBack} className="rounded-lg h-10 px-8">
          Quay lại
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          className="rounded-lg h-10 px-8"
        >
          Tiếp tục
        </Button>
      </div>
    </Form>
  );
};

export default StepPersonalInfo;
