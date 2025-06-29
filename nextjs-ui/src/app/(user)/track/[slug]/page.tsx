"use client";
import WaveTrack from "@/components/wave-track/wave-track";
import { useSearchParams } from "next/navigation";
import { Container } from "@mui/material";

const DetailTrackPage = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  return (
    <div>
      <div>
        <WaveTrack />
      </div>
    </div>
  );
};

export default DetailTrackPage;
