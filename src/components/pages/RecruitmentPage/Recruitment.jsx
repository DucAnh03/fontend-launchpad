import { useEffect, useState } from "react";
import { Card, Spin } from "antd";
import axios from "axios";

export default function Recruitment() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/recruitments"); // đổi thành endpoint thật
        setPosts(data.metadata || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Spin fullscreen />;

  return (
    <section style={{ padding: 24, maxWidth: 920, margin: "0 auto" }}>
      <h1>Recruitment Posts</h1>
      {posts.map((p) => (
        <Card key={p._id} style={{ marginBottom: 16 }}>
          <h3>{p.title}</h3>
          <p>{p.company}</p>
          <p>{p.location}</p>
        </Card>
      ))}
    </section>
  );
}
