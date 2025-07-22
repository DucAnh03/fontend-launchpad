import * as faceapi from "face-api.js";

export async function loadFaceApiModels() {
    await faceapi.nets.tinyFaceDetector.loadFromUri("models/tiny_face_detector");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models/face_landmark_68");
    await faceapi.nets.faceRecognitionNet.loadFromUri("/models/face_recognition");
  }

export async function getFaceDescriptorFromImageURL(imageUrl: string): Promise<Float32Array | null> {
  const img = await faceapi.fetchImage(imageUrl);
  const detection = await faceapi
    .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();
  return detection?.descriptor || null;
}

export async function getFaceDescriptorFromVideo(videoElement: HTMLVideoElement): Promise<Float32Array | null> {
  const detection = await faceapi
    .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();
  return detection?.descriptor || null;
}

export function compareFaceDescriptors(
  desc1: Float32Array | null,
  desc2: Float32Array | null,
  threshold = 0.5
): boolean {
  if (!desc1 || !desc2) return false;
  const distance = faceapi.euclideanDistance(desc1, desc2);
  return distance < threshold;
}