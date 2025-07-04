"use client";

import { useTheme } from "@mui/material/styles";
import { Box, Card, IconButton, Typography, Avatar, Link } from "@mui/material";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { PauseCircleOutline } from "@mui/icons-material";
import { useTrackContext } from "@/lib/track.wrapper";
import { convertSlugUrl } from "@/utils/api";

const ProfileTracks = ({ data }: any) => {
  const theme = useTheme();
  const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;

  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        padding: 2,
        mb: 2,
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.02)",
        },
      }}
    >
      <Avatar
        variant="rounded"
        src={`http://localhost:8000/images/${data.imgUrl}`}
        alt={data.title}
        sx={{ width: 80, height: 80, mr: 2 }}
      />

      <Box sx={{ flex: 1 }}>
        <Link
          href={`/track/${convertSlugUrl(data.title)}-${data.__id}.html?audio=${
            data.trackUrl
          }`}
          underline="none"
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {data.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {data.description}
          </Typography>
        </Link>

        <Box
          sx={{
            height: 4,
            width: "100%",
            backgroundColor: "#eee",
            borderRadius: 2,
            mt: 1,
            mb: 0.5,
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: "30%",
              backgroundColor: theme.palette.primary.main,
              borderRadius: 2,
            }}
          />
        </Box>
      </Box>

      <Box>
        <IconButton>
          {theme.direction === "rtl" ? <SkipNextIcon /> : <SkipPreviousIcon />}
        </IconButton>

        {(data._id !== currentTrack._id ||
          (data._id === currentTrack._id &&
            currentTrack.isPlaying === false)) && (
          <IconButton
            aria-label="play/pause"
            onClick={(e) => {
              setCurrentTrack({ ...data, isPlaying: true });
            }}
          >
            <PlayArrowIcon sx={{ height: 38, width: 38 }} />
          </IconButton>
        )}

        {data._id === currentTrack._id && currentTrack.isPlaying === true && (
          <IconButton
            aria-label="play/pause"
            onClick={(e) => {
              setCurrentTrack({ ...data, isPlaying: false });
            }}
          >
            <PauseCircleOutline sx={{ height: 38, width: 38 }} />
          </IconButton>
        )}

        <IconButton>
          {theme.direction === "rtl" ? <SkipPreviousIcon /> : <SkipNextIcon />}
        </IconButton>
      </Box>
    </Card>
  );
};

export default ProfileTracks;
