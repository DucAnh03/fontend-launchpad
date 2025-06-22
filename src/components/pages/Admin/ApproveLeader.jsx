import { useEffect, useState } from "react";
import api from "@/services/api/axios";

export default function AdminApproveLeader() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/admin/approve-leader")
      .then(res => setMessage(res.data.message))
      .catch(err => setError(err?.response?.data?.message || "Lỗi xác thực hoặc quyền hạn."));
  }, []);

  return (
    <div>
      <h1>Duyệt Leader</h1>
      {message && <p>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}