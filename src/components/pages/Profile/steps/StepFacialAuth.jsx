import { saveAs } from "file-saver";
import React, { useEffect, useRef, useState } from "react";
import { Button, message } from "antd";
import {
  loadFaceApiModels,
  getFaceDescriptorFromImageURL,
  getFaceDescriptorFromVideo,
  compareFaceDescriptors,
} from "@/utils/faceVerification";
const logErrorToFile = (log) => {
  const blob = new Blob([log], { type: "text/plain;charset=utf-8" });
  saveAs(blob, `face-verification-error-${Date.now()}.log`);
};

const FONT_INFO_IMAGE = "verify-info-image";

const StepFacialAuth = ({ onBack, onSuccess }) => {
  const [cameraOn, setCameraOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      setCameraOn(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      message.error("Không thể truy cập camera");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setCameraOn(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleFaceVerification = async () => {
    setLoading(true);
    let log = `[Face Verification Log - ${new Date().toISOString()}]\n\n`;

    try {
      log += "🔹 Loading face-api models...\n";
      await loadFaceApiModels();
      log += "✅ Models loaded\n";

      if (!videoRef.current) {
        const msg = "⚠️ videoRef is null (camera chưa sẵn sàng)";
        log += msg + "\n";
        throw new Error(msg);
      }

      log += "🔹 Detecting face from webcam...\n";
      const webcamDesc = await getFaceDescriptorFromVideo(videoRef.current);
      if (!webcamDesc) {
        const msg = "❌ Không nhận diện được khuôn mặt từ webcam";
        log += msg + "\n";
        throw new Error(msg);
      }
      log += `✅ Webcam descriptor: [${webcamDesc
        .slice(0, 5)
        .join(", ")}...]\n`;

      const cccdImageUrl = localStorage.getItem(FONT_INFO_IMAGE);
      if (!cccdImageUrl) {
        const msg = "❌ Không tìm thấy ảnh CCCD trong localStorage";
        log += msg + "\n";
        throw new Error(msg);
      }

      log += "🔹 Detecting face from CCCD image...\n";
      const cccdDesc = await getFaceDescriptorFromImageURL(cccdImageUrl);
      if (!cccdDesc) {
        const msg = "❌ Không nhận diện được khuôn mặt từ ảnh CCCD";
        log += msg + "\n";
        throw new Error(msg);
      }
      log += `✅ CCCD descriptor: [${cccdDesc.slice(0, 5).join(", ")}...]\n`;

      const isMatch = compareFaceDescriptors(webcamDesc, cccdDesc);
      log += `🔍 Compare result: ${isMatch ? "✅ MATCH" : "❌ NOT MATCH"}\n`;

      if (isMatch) {
        message.success("Xác minh khuôn mặt thành công!");
        onSuccess();
      } else {
        message.error("Khuôn mặt không khớp với ảnh CCCD.");
      }
    } catch (error) {
      log += `🚨 Error: ${error.message}\n`;
      console.error("Face Verification Error:", error);
      logErrorToFile(log);
      message.error("Có lỗi xảy ra khi xác thực khuôn mặt.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-xl font-bold mb-6 text-blue-600">
        Xác nhận khuôn mặt
      </h2>
      <div
        className="mb-6 flex h-60 w-full items-center justify-center overflow-hidden rounded-xl bg-gray-200 shadow"
        style={{ width: "320px", height: "240px" }}
      >
        {cameraOn ? (
          <video
            ref={videoRef}
            autoPlay
            className="h-[240px] w-[320px] rounded-xl object-cover"
          />
        ) : (
          <span className="text-gray-400">Bật camera để xác thực</span>
        )}
      </div>
      <div className="flex gap-4 justify-center mb-4">
        <Button
          onClick={startCamera}
          disabled={cameraOn}
          className="rounded-lg h-10 px-6"
        >
          Bắt đầu ghi hình
        </Button>
        <Button
          onClick={stopCamera}
          disabled={!cameraOn}
          className="rounded-lg h-10 px-6"
        >
          Tắt camera
        </Button>
      </div>
      <Button
        type="primary"
        loading={loading}
        onClick={handleFaceVerification}
        disabled={!cameraOn}
        className="rounded-lg h-10 px-8 w-full mb-4"
      >
        Nhận diện gương mặt
      </Button>
      <Button onClick={onBack} className="rounded-lg h-10 px-8 w-full">
        Quay lại
      </Button>
      <div className="mt-4 text-center text-sm text-gray-500">
        Hệ thống sẽ so sánh khuôn mặt bạn với ảnh CCCD đã upload.
      </div>
    </div>
  );
};

export default StepFacialAuth;
