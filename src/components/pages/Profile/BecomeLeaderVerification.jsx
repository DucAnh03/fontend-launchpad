import { Modal, message } from "antd";
import StepCountry from "./steps/StepCountry";
import StepPersonalInfo from "./steps/StepPersonalInfo";
import StepUploadCCCD from "./steps/StepUploadCCCD";
import StepFacialAuth from "./steps/StepFacialAuth";
import api from "@/services/api/axios";
import { useAuthContext } from "@/contexts/AuthContext";
import React, { useEffect, useState } from "react";
const BecomeLeaderVerification = ({ open, onClose }) => {
  const [step, setStep] = useState("country");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthContext();

  const next = (data) => {
    if (data) setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => {
      switch (prev) {
        case "country":
          return "info";
        case "info":
          return "upload"; // Bỏ qua document, sang upload luôn
        case "upload":
          return "face";
        case "face":
          return "done";
        default:
          return "country";
      }
    });
  };

  const back = () => {
    setStep((prev) => {
      switch (prev) {
        case "info":
          return "country";
        case "upload":
          return "info"; // Bỏ qua document
        case "face":
          return "upload";
        default:
          return "country";
      }
    });
  };

  const handleSuccess = async () => {
    setLoading(true);
    try {
      await api.post("/users/make-leader");
      message.success("Bạn đã trở thành leader!");
      const { data } = await api.get("/users/profile");
      setUser(data.data);
      onClose();
    } catch (err) {
      message.error("Không thể cập nhật role. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  let content;
  switch (step) {
    case "country":
      content = <StepCountry onNext={next} />;
      break;
    case "info":
      content = <StepPersonalInfo onNext={next} onBack={back} />;
      break;
    case "upload":
      content = <StepUploadCCCD onNext={next} onBack={back} />;
      break;
    case "face":
      content = <StepFacialAuth onBack={back} onSuccess={handleSuccess} />;
      break;
    case "done":
      content = (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-4xl mb-4">🎉</div>
          <div className="text-xl font-bold text-green-600 mb-2">
            Xác minh thành công!
          </div>
          <div className="text-gray-500">Bạn đã trở thành leader.</div>
        </div>
      );
      break;
    default:
      content = null;
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={520}
      destroyOnClose
      className="rounded-xl p-0"
      style={{ top: 40 }}
      bodyStyle={{ padding: 0, borderRadius: 16 }}
    >
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-t-xl px-8 py-5 text-white text-center">
        <h2 className="text-2xl font-bold mb-0">Xác thực Leader</h2>
      </div>
      <div className="p-8 bg-white rounded-b-xl min-h-[320px] flex flex-col justify-center">
        {content}
        {loading && (
          <div className="text-center text-blue-600 mt-4">Đang cập nhật...</div>
        )}
      </div>
    </Modal>
  );
};

export default BecomeLeaderVerification;
