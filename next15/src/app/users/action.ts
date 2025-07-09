"use server";

export const handleLogin = async (prevState: any, formData: any) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const res = await fetch("http://localhost:8000/api/v1/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: formData.get("username"),
      password: formData.get("password"),
    }),
  });

  return await res.json();
};

export const handleLoginAntd = async (formData: any) => {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Giả lập delay

  const res = await fetch("http://localhost:8000/api/v1/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: formData.username,
      password: formData.password, // <-- sửa lại chỗ này
    }),
  });

  return await res.json();
};
