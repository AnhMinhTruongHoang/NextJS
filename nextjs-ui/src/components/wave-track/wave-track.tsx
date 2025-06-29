"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useWavesurfer } from "@/utils/customHook";
import { WaveSurferOptions } from "wavesurfer.js";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import "./wave.scss";
import { Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import { sendRequest } from "@/utils/api";
import noIMG from "../../../public/images/noimage.png";
import { useTrackContext } from "@/lib/track.wrapper";

interface IProps {
  track: ITracksTop | null;
}

const WaveTrack = (props: IProps) => {
  const { track } = props;
  const searchParams = useSearchParams();
  const fileName = searchParams.get("audio");
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState<string>("0:00");
  const [duration, setDuration] = useState<string>("0:00");
  const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;

  const optionsMemo = useMemo((): Omit<WaveSurferOptions, "container"> => {
    let gradient, progressGradient;
    if (typeof window !== "undefined") {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      // Define the waveform gradient
      gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
      gradient.addColorStop(0, "#656666"); // Top color
      gradient.addColorStop((canvas.height * 0.7) / canvas.height, "#656666"); // Top color
      gradient.addColorStop(
        (canvas.height * 0.7 + 1) / canvas.height,
        "#ffffff"
      ); // White line
      gradient.addColorStop(
        (canvas.height * 0.7 + 2) / canvas.height,
        "#ffffff"
      ); // White line
      gradient.addColorStop(
        (canvas.height * 0.7 + 3) / canvas.height,
        "#B1B1B1"
      ); // Bottom color
      gradient.addColorStop(1, "#B1B1B1"); // Bottom color

      // Define the progress gradient
      progressGradient = ctx.createLinearGradient(
        0,
        0,
        0,
        canvas.height * 1.35
      );
      progressGradient.addColorStop(0, "#EE772F"); // Top color
      progressGradient.addColorStop(
        (canvas.height * 0.7) / canvas.height,
        "#EB4926"
      ); // Top color
      progressGradient.addColorStop(
        (canvas.height * 0.7 + 1) / canvas.height,
        "#ffffff"
      ); // White line
      progressGradient.addColorStop(
        (canvas.height * 0.7 + 2) / canvas.height,
        "#ffffff"
      ); // White line
      progressGradient.addColorStop(
        (canvas.height * 0.7 + 3) / canvas.height,
        "#F6B094"
      ); // Bottom color
      progressGradient.addColorStop(1, "#F6B094"); // Bottom color
    }

    return {
      waveColor: gradient,
      progressColor: progressGradient,
      height: 100,
      barWidth: 3,
      url: `/api?audio=${fileName}`,
    };
  }, []);
  const wavesurfer = useWavesurfer(containerRef, optionsMemo);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  // Initialize wavesurfer when the container mounts
  // or any of the props change
  useEffect(() => {
    if (!wavesurfer) return;
    setIsPlaying(false);

    const hover = hoverRef.current!;
    const waveform = containerRef.current!;
    waveform.addEventListener(
      "pointermove",
      (e) => (hover.style.width = `${e.offsetX}px`)
    );

    const subscriptions = [
      wavesurfer.on("play", () => setIsPlaying(true)),
      wavesurfer.on("pause", () => setIsPlaying(false)),
      wavesurfer.on("decode", (duration) => {
        setDuration(formatTime(duration));
      }),
      wavesurfer.on("timeupdate", (currentTime) => {
        setTime(formatTime(currentTime));
      }),
      wavesurfer.once("interaction", () => {
        wavesurfer.play();
      }),
    ];

    return () => {
      subscriptions.forEach((unsub) => unsub());
    };
  }, [wavesurfer]);

  // On play button click
  const onPlayClick = useCallback(() => {
    if (wavesurfer) {
      wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
    }
  }, [wavesurfer]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };

  const calLeft = (moment: number) => {
    const hardCodeDuration = wavesurfer?.getDuration() ?? 0;
    const percent = (moment / hardCodeDuration) * 100;
    return `${percent}%`;
  };

  useEffect(() => {
    if (track?._id === currentTrack?._id && wavesurfer) {
      currentTrack.isPlaying ? wavesurfer.pause() : wavesurfer.play();
    }
  }, [currentTrack]);

  useEffect(() => {
    if (wavesurfer && currentTrack.isPlaying) {
      wavesurfer.pause();
    }
  }, [currentTrack]);

  useEffect(() => {
    if (track?._id && !currentTrack?._id) {
      setCurrentTrack({ ...track, isPlaying: false });
    }
  }, [track]);

  return (
    <div style={{ marginTop: 20 }}>
      <div
        style={{
          display: "flex",
          gap: 15,
          padding: 20,
          height: 250,
          background:
            "linear-gradient(135deg, rgb(106, 112, 67) 0%, rgb(11, 15, 20) 100%)",
        }}
      >
        {/* Left Side (Text + Waveform) */}
        <div
          style={{
            width: "75%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {track?.title}
          <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
            {/* Play Button */}
            <div
              onClick={() => {
                onPlayClick();
                if (track && wavesurfer) {
                  setCurrentTrack({
                    ...currentTrack,
                    isPlaying: false,
                  });
                }
              }}
              style={{
                borderRadius: "50%",
                background: "#f50",
                height: "50px",
                width: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              {isPlaying ? (
                <PauseIcon sx={{ fontSize: 30, color: "white" }} />
              ) : (
                <PlayArrowIcon sx={{ fontSize: 30, color: "white" }} />
              )}
            </div>

            {/* Title + Host */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "18px",
                  padding: "4px 8px",
                  background: "rgba(0,0,0,0.4)",
                  borderRadius: "4px",
                }}
              >
                {track?.title || "Đang tải tiêu đề..."}
              </div>
              <div
                style={{
                  color: "#ccc",
                  fontSize: "14px",
                  padding: "2px 6px",
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: "4px",
                  marginTop: "4px",
                  width: "fit-content",
                }}
              >
                with {track?.uploader?.name || track?.description}
              </div>
            </div>
          </div>

          {/* Waveform */}
          <div ref={containerRef} className="wave-form-container">
            <div className="time">{time}</div>
            <div className="duration">{duration}</div>
            <div ref={hoverRef} className="hover-wave"></div>
            <div
              className="overlay"
              style={{
                position: "absolute",
                height: "30px",
                width: "100%",
                bottom: "0",
                backdropFilter: "brightness(0.5)",
              }}
            ></div>
          </div>
        </div>

        {/* Right Side (Image Placeholder) */}
        <div
          style={{
            width: "25%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={typeof track?.imgUrl === "string" ? track?.imgUrl : noIMG.src}
            alt="No image"
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "200px",
              objectFit: "cover",
              background: "#ccc",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default WaveTrack;
