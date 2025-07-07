"use client";

import { convertSlugUrl, sendRequest } from "@/utils/api";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Link from "next/link";
import { Typography } from "@mui/material";
import Image from "next/image";

const ClientSearch = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [tracks, setTracks] = useState<ITrackTop[]>([]);

  const fetchData = async (query: string) => {
    const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/search`,
      method: "POST",
      body: {
        current: 1,
        pageSize: 10,
        title: query,
      },
    });
    if (res.data?.result) {
      setTracks(res.data.result);
    }
  };
  useEffect(() => {
    //update document title by query
    document.title = `"${query}" trên Hỏi Dân IT SC`;

    //fetch data
    if (query) fetchData(query);
  }, [query]);

  return (
    <div>
      {!query || !tracks.length ? (
        <div>Không tồn tại kết quả tìm kiếm</div>
      ) : (
        <Box>
          <div>
            Kết quả tìm kiếm cho từ khóa: <b>{query}</b>
          </div>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {tracks.map((track) => {
              return (
                <div key={track._id}>
                  <Box sx={{ display: "flex", width: "100%", gap: "20px" }}>
                    <Image
                      style={{ borderRadius: "3px" }}
                      alt="avatar track"
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track?.imgUrl}`}
                      height={50}
                      width={50}
                    />
                    <Typography sx={{ py: 2 }}>
                      <Link
                        style={{ textDecoration: "none", color: "unset" }}
                        href={`/track/${convertSlugUrl(track.title)}-${
                          track._id
                        }.html?audio=${track.trackUrl}`}
                      >
                        {track.title}
                      </Link>
                    </Typography>
                  </Box>
                </div>
              );
            })}
          </Box>
        </Box>
      )}
    </div>
  );
};

export default ClientSearch;
