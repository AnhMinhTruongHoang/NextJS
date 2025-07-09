import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { convertSlugUrl, sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.options";

export const metadata: Metadata = {
  title: "Tracks bạn đã liked",
  description: "miêu tả thôi mà",
};

const LikePage = async () => {
  const session = await getServerSession(authOptions);

  const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
    method: "GET",
    queryParams: { current: 1, pageSize: 100 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ["liked-by-user"] },
    },
  });

  const likes = res?.data?.result ?? [];

  return (
    <Container>
      <div>
        <h3>Hear the tracks you've liked:</h3>
      </div>
      <Divider />
      <Box sx={{ mt: 3, display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {likes.map((track) => {
          return (
            <Box key={track._id}>
              <Image
                style={{ borderRadius: "3px" }}
                alt="avatar track"
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track?.imgUrl}`}
                height={200}
                width={200}
              />
              <div>
                <Link
                  style={{ textDecoration: "none", color: "unset" }}
                  href={`/track/${convertSlugUrl(track.title)}-${
                    track._id
                  }.html?audio=${track.trackUrl}`}
                >
                  <span
                    style={{
                      width: "200px",
                      display: "block",
                      color: "black",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {track.title}
                  </span>
                </Link>
              </div>
            </Box>
          );
        })}
      </Box>
    </Container>
  );
};

export default LikePage;
