"use client";
import { useTrackContext } from "@/lib/track.wrapper";
import { useHasMounted } from "@/utils/customHook";
import { AppBar, Container } from "@mui/material";
import { useRef } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const AppFooter = () => {
  const hasMounted = useHasMounted();
  const playerRef = useRef(null);
  ///
  if (!hasMounted) {
    return <></>;
  }
  const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;

  console.log(currentTrack);

  //@ts-ignore
  if (currentTrack?.isPlaying) {
    //@ts-ignore
    playerRef?.current?.audio?.current?.play();
  } else {
    //@ts-ignore
    playerRef?.current?.audio?.current?.pause();
  }

  return (
    <div>
      <AppBar
        position="fixed"
        color="primary"
        sx={{
          top: "auto",
          bottom: 0,
          background: "#f2f2f2",
        }}
      >
        <Container sx={{ display: "flex", gap: "20" }}>
          <AudioPlayer
            ref={playerRef}
            onPlay={() => {
              setCurrentTrack({ ...currentTrack, isPlaying: true });
            }}
            onPause={() =>
              setCurrentTrack({ ...currentTrack, isPlaying: false })
            }
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${currentTrack.trackUrl}`}
            volume={0.5}
            style={{ boxShadow: "unset", background: "#f2f2f2" }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              justifyContent: "center",
              minWidth: 100,
              marginLeft: "30px",
            }}
          >
            <div style={{ color: "#ccc" }}>Eric</div>
            <div style={{ color: "black" }}>Who am I ?</div>
          </div>
        </Container>
      </AppBar>
    </div>
  );
};

export default AppFooter;
