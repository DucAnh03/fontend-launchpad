import { useAuthContext } from "@/contexts/AuthContext";

export default function Portfolio() {
  const { userInfo } = useAuthContext();

  return (
    <section style={{ padding: 24 }}>
      <h1>My Portfolio</h1>
      {userInfo?._id ? (
        <>
          <p>Tên: {userInfo.userInfo?.fullName}</p>
          {/* render danh sách project, chứng chỉ, ảnh… */}
        </>
      ) : (
        <p>Bạn cần đăng nhập để xem Portfolio.</p>
      )}
    </section>
  );
}
