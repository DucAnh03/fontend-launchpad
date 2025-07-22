import React, { useState } from "react";
import { Button, Upload, message } from "antd";

const StepUploadCCCD = ({ onNext, onBack }) => {
  const [imageUrl, setImageUrl] = useState(null);

  const beforeUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
      localStorage.setItem("verify-info-image", reader.result);
    };
    reader.readAsDataURL(file);
    return false;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-xl font-bold mb-6 text-blue-600">Tải ảnh CCCD</h2>
      <Upload
        showUploadList={false}
        beforeUpload={beforeUpload}
        accept="image/*"
      >
        <Button className="rounded-lg h-10 px-8 mb-4" type="primary">
          Chọn ảnh CCCD
        </Button>
      </Upload>
      {imageUrl && (
        <img
          src={imageUrl}
          alt="CCCD"
          className="w-72 mb-4 rounded-lg shadow-md border border-gray-200"
          style={{ maxWidth: 320 }}
        />
      )}
      <div className="flex gap-4 mt-4 w-full justify-between">
        <Button onClick={onBack} className="rounded-lg h-10 px-8">
          Quay lại
        </Button>
        <Button
          type="primary"
          className="rounded-lg h-10 px-8"
          onClick={() => {
            if (imageUrl) onNext({ cccdImage: imageUrl });
            else message.warning("Vui lòng upload ảnh CCCD");
          }}
        >
          Tiếp tục
        </Button>
      </div>
    </div>
  );
};

export default StepUploadCCCD;
