import React, { useEffect, useState } from "react";
import "../../../styles/users.css";
import { Table, Button, notification, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";
import CreateTrackModal from "./create.tracks.modal";
import UpdateTrackModal from "./update.tracks.modal";

export interface ITrackUploader {
  _id: string;
  email: string;
  name: string;
  role: string;
  type: string;
}

export interface ITracks {
  _id: string;
  title: string;
  description: string;
  category: string;
  imgUrl: string;
  trackUrl: string;
  countLike: number;
  countPlay: number;
  uploader: ITrackUploader;
}

const TracksTable = () => {
  const [listTrack, setListTrack] = useState([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [dataUpdate, setDataUpdate] = useState<null | ITracks>(null);

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
      `http://localhost:8000/api/v1/tracks?current=${meta.current}&pageSize=${meta.pageSize}`,
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
    setListTrack(d.data.result);
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
      `http://localhost:8000/api/v1/tracks?current=${page}&pageSize=${pageSize}`,
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
    setListTrack(d.data.result);
    setMeta({
      current: d.data.meta.current,
      pageSize: d.data.meta.pageSize,
      pages: d.data.meta.pages,
      total: d.data.meta.total,
    });
  };

  /////////delete logic
  const confirm = async (tracks: ITracks) => {
    const res = await fetch(
      `http://localhost:8000/api/v1/tracks/${tracks._id}`,
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
        message: "Track Deleted.",
      });
      await getData();
    } else {
      notification.error({
        message: JSON.stringify(d.message),
      });
    }
  };

  ////////////

  const columns: ColumnsType<ITracks> = [
    {
      title: "ID",
      dataIndex: "id",
      responsive: ["sm"],
      render: (value, record) => <a>{record._id}</a>,
    },
    {
      title: "Title",
      dataIndex: "title",
      responsive: ["xs", "sm"],
    },
    {
      title: "Artist",
      dataIndex: "description",
      responsive: ["xs", "sm"],
    },
    {
      title: "Category",
      dataIndex: "category",
      responsive: ["md"],
    },
    {
      title: "Track url",
      dataIndex: "trackUrl",
      responsive: ["md"],
    },
    {
      title: "Uploader",
      dataIndex: ["uploader", "name"],
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
          <Button
            onClick={() => {
              setDataUpdate(record);
              setIsUpdateModalOpen(true);
            }}
            type="default"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete the user"
            description={`Are you sure to delete this user. name = ${record.title}?`}
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
    <div>
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

      <Table
        columns={columns}
        dataSource={listTrack}
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

      <CreateTrackModal
        access_token={access_token}
        getData={getData}
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />

      <UpdateTrackModal
        access_token={access_token}
        getData={getData}
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </div>
  );
};

export default TracksTable;
