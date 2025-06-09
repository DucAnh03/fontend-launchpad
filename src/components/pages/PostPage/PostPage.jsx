import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";

export default function PostPage() {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await axios.post("/api/posts", values); // đổi endpoint
      message.success("Tạo bài viết thành công!");
    } catch (err) {
      message.error("Có lỗi, thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h1>Tạo bài Post mới</h1>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="content" label="Nội dung" rules={[{ required: true }]}>
          <Input.TextArea rows={6} />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Đăng Post
        </Button>
      </Form>
    </section>
  );
}
