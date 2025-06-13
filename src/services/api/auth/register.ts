import api from "../axios";

export async function postRegister(data: {
    name: string;
    username: string;
    email: string;
    password: string;
}): Promise<any> {
    const res = await api.post("/auth/register", data);
    return res.data;
} 