"use client";

import { useTheme } from "@mui/material/styles";
import { Box, Typography, IconButton, Avatar, Card } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { useTrackContext } from "@/lib/track.wrapper";
import Link from "next/link";
import { convertSlugUrl } from "@/utils/api";
import "../../styles/track.profile.css";

interface IProps {
  data: ITrackTop;
}

const ProfileTracks = ({ data }: IProps) => {
  const theme = useTheme();
  const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;
  const isPlaying = currentTrack._id === data._id && currentTrack.isPlaying;

  return (
    <Card
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        maxWidth: 600,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      {/* Thumbnail Image */}
      <Avatar
        variant="rounded"
        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${data.imgUrl}`}
        sx={{ width: 64, height: 64, mr: 2 }}
      />

      {/* Info */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Link
          href={`/track/${convertSlugUrl(data.title)}-${data._id}.html?audio=${
            data.trackUrl
          }`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            {data.title}
          </Typography>
        </Link>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            mt: 0.5,
          }}
        >
          {data.description}
        </Typography>
      </Box>

      {/* Play/Pause Button */}
      <IconButton
        onClick={() => setCurrentTrack({ ...data, isPlaying: !isPlaying })}
        sx={{
          backgroundColor: isPlaying ? "#ff5500" : "#eee",
          color: isPlaying ? "#fff" : "#000",
          ml: 2,
          "&:hover": {
            backgroundColor: isPlaying ? "#ff3300" : "#ddd",
          },
        }}
      >
        {isPlaying ? (
          <PauseIcon sx={{ fontSize: 32 }} />
        ) : (
          <PlayArrowIcon sx={{ fontSize: 32 }} />
        )}
      </IconButton>
    </Card>
  );
};

export default ProfileTracks;
