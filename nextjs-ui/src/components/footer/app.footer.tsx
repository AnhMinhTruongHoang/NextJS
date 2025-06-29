"use client";
import { useHasMounted } from "@/utils/customHook";
import { AppBar, Container } from "@mui/material";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const AppFooter = () => {
  const hasMounted = useHasMounted();
  if (!hasMounted) {
    return <></>;
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
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/hoidanit.mp3`}
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
