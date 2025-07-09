"use server";

import { notification } from "antd";
import { revalidateTag } from "next/cache";
import { IUsers } from "../types/backend.type";

/// update

export const updateUserAction = async (data: any, access_token: any) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const res = await fetch("http://localhost:8000/api/v1/users", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const d = await res.json();
  revalidateTag("listUsers");
  return d;
};

/////////delete logic
export const deleteUserAction = async (user: IUsers, access_token: string) => {
  const res = await fetch(`http://localhost:8000/api/v1/users/${user._id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });

  const d = await res.json();
  revalidateTag("listUsers");
  return d;
};
