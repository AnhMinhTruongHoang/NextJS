"use client";

import { useEffect, useState } from "react";
import UsersTable from "./components/table.user";

type SearchParams = { [key: string]: string | string[] | undefined };

const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b2tlbiBsb2dpbiIsImlzcyI6ImZyb20gc2VydmVyIiwiX2lkIjoiNjg0NmZiODJiYjBkYmRjMzAxMDg0NGVmIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJhZGRyZXNzIjoiVmlldE5hbSIsImlzVmVyaWZ5Ijp0cnVlLCJuYW1lIjoiSSdtIGFkbWluIiwidHlwZSI6IlNZU1RFTSIsInJvbGUiOiJBRE1JTiIsImdlbmRlciI6Ik1BTEUiLCJhZ2UiOjY5LCJpYXQiOjE3NTIwODIwNDcsImV4cCI6MTgzODQ4MjA0N30.bcNd-_WOSV193isCQvSQVcTrUDIBrJbJjGdw9nnaQx0";
const LIMIT = 5;

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  const [users, setUsers] = useState([]);
  const page = Number(searchParams?.page) || 1;

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `http://localhost:8000/api/v1/users?current=${page}&pageSize=${LIMIT}&sort=-updatedAt`,
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      setUsers(data?.data || []);
    };

    fetchData();
  }, [page]);

  return (
    <div>
      <UsersTable />
    </div>
  );
}
