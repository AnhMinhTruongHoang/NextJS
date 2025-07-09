import { Button, notification, Popconfirm, Table } from "antd";
import React, { useEffect, useState } from "react";
import CreateCommentModal from "./comments.create";
import UpdateCommentModal from "./comments.update";
import { PlusOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";

export interface IComment {
  _id: string;
  content: string;
  moment: number;
  user: {
    _id: string;
    email: string;
    name: string;
    role: "ADMIN" | "USER" | string;
    type: "SYSTEM" | "NORMAL" | string;
  };
  track: {
    _id: string;
    title: string;
    description: string;
    trackUrl: string;
  };
  isDeleted: boolean;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

const CommentsTable = () => {
  const [listComments, setListComments] = useState([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [dataUpdate, setDataUpdate] = useState<null | IComment>(null);

  const access_token = localStorage.getItem("access_token") as string;

  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });

  useEffect(() => {
    //update
    getData();
  }, []);

  //Promise fetch data
  const getData = async () => {
    const res = await fetch(
      `http://localhost:8000/api/v1/comments?current=${meta.current}&pageSize=${meta.pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const d = await res.json();
    if (!d.data) {
      notification.error({
        message: JSON.stringify(d.message),
      });
    }

    setListComments(d.data.result);
    setMeta({
      current: d.data.meta.current,
      pageSize: d.data.meta.pageSize,
      pages: d.data.meta.pages,
      total: d.data.meta.total,
    });
  };

  ////////// change page
  const handleOnChange = async (page: number, pageSize: number) => {
    const res = await fetch(
      `http://localhost:8000/api/v1/comments?current=${page}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const d = await res.json();
    if (!d.data) {
      notification.error({
        message: JSON.stringify(d.message),
      });
    }
    setListComments(d.data.result);
    setMeta({
      current: d.data.meta.current,
      pageSize: d.data.meta.pageSize,
      pages: d.data.meta.pages,
      total: d.data.meta.total,
    });
  };

  // Hàm xác nhận xóa 1 track
  const confirm = async (comments: IComment) => {
    const res = await fetch(
      `http://localhost:8000/api/v1/comments/${comments._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const d = await res.json();
    if (d.data) {
      notification.success({
        message: "Comment Deleted.",
      });
      await getData(); // Cập nhật lại bảng sau khi xóa
    } else {
      notification.error({
        message: JSON.stringify(d.message),
      });
    }
  };

  ///

  // Cấu hình các cột cho bảng track
  const columns: ColumnsType<IComment> = [
    {
      title: "ID",
      dataIndex: "id",
      responsive: ["sm"],
      render: (value, record) => <a>{record._id}</a>,
    },
    {
      title: "Content",
      dataIndex: "content",
      responsive: ["xs", "sm"],
    },
    {
      title: "Track",
      dataIndex: "track",
      render: (track) => track?.title,
      responsive: ["xs", "sm"],
    },
    {
      title: "User",
      dataIndex: "user",
      render: (user) => user?.email,
      responsive: ["md"],
    },

    {
      title: "Actions",
      align: "center",
      responsive: ["xs", "sm", "md", "lg"],
      render: (value, record) => (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          {/* Nút xóa với xác nhận */}
          <Popconfirm
            title="Delete the Comment"
            description={`Are you sure to delete this comment. name = ${record.title}?`}
            onConfirm={() => confirm(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <div>
        {/* Tiêu đề và nút tạo mới */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>Table Tracks</h2>
          <div>
            <Button
              icon={<PlusOutlined />}
              type={"primary"}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Add new
            </Button>
          </div>
        </div>

        {/* Bảng hiển thị dữ liệu */}
        <Table
          columns={columns}
          dataSource={listComments}
          rowKey={"_id"}
          pagination={{
            current: meta.current,
            pageSize: meta.pageSize,
            total: meta.total,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            onChange: (page: number, pageSize: number) =>
              handleOnChange(page, pageSize),
            showSizeChanger: true,
          }}
        />
      </div>
    </>
  );
};

export default CommentsTable;
