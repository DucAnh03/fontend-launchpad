import React from "react";
import { Button, Form } from "antd";

const StepCountry = ({ onNext }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onNext({ country: values.country });
  };

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      layout="vertical"
      className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8"
    >
      <h2 className="text-xl font-bold mb-6 text-blue-600 text-center">
        Chọn quốc gia
      </h2>
      <Form.Item
        label="Quốc gia"
        name="country"
        rules={[{ required: true, message: "Vui lòng chọn quốc gia" }]}
      >
        <select
          className="w-full rounded-lg h-10 border border-gray-300 px-3"
          onChange={(e) => form.setFieldsValue({ country: e.target.value })}
          value={form.getFieldValue("country") || ""}
        >
          <option value="" disabled>
            Chọn quốc gia
          </option>
          <option value="vn">Việt Nam</option>
          <option value="us">United States</option>
        </select>
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        className="rounded-lg h-10 px-8 w-full mt-4"
      >
        Tiếp tục
      </Button>
    </Form>
  );
};

export default StepCountry;
