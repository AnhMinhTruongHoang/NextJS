import Container from "@mui/material/Container";
import Box from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Fragment } from "react";
import type { Metadata } from "next";
import NewPlaylist from "./new.playlist";
import AddPlaylistTrack from "./add.playlist.track";
import CurrentTrack from "./current.track";

export const metadata: Metadata = {
  title: "Playlist bạn đã tạo",
  description: "miêu tả thôi mà",
};

const PlaylistPage = async () => {
  const session = await getServerSession(authOptions);

  const res = await sendRequest<IBackendRes<IModelPaginate<IPlaylist>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/by-user`,
    method: "POST",
    queryParams: { current: 1, pageSize: 100 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ["playlist-by-user"] },
    },
  });

  const res1 = await sendRequest<IBackendRes<IModelPaginate<ITracksTop>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks`,
    method: "GET",
    queryParams: { current: 1, pageSize: 100 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  });

  const playlists = res?.data?.result ?? [];
  const tracks = res1?.data?.result ?? [];

  return (
    <Container sx={{ mt: 3, p: 3, background: "#f3f6f9", borderRadius: "3px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Danh sách phát</h3>
        <div style={{ display: "flex", gap: "20px" }}>
          <NewPlaylist />
          <AddPlaylistTrack playlists={playlists} tracks={tracks} />
        </div>
      </Box>
      <Divider variant="middle" />
      <Box sx={{ mt: 3 }}>
        {playlists?.map((playlist) => {
          return (
            <Accordion key={playlist._id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontSize: "20px", color: "#ccc" }}>
                  {playlist.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {playlist?.tracks?.map((track, index: number) => {
                  return (
                    <Fragment key={track._id}>
                      {index === 0 && <Divider />}
                      <CurrentTrack track={track} />
                      <Divider />
                    </Fragment>
                  );
                })}
                {playlist?.tracks?.length === 0 && <span>No data.</span>}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </Container>
  );
};

export default PlaylistPage;
