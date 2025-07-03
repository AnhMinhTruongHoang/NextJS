"use client";
import WaveTrack from "@/components/wave-track/wave-track";
import { useSearchParams } from "next/navigation";
import { Container } from "@mui/material";
import { sendRequest } from "@/utils/api";

const DetailTrackPage = async (props: any) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const { params } = props;

  const res = await sendRequest<IBackendRes<ITracksTop>>({
    url: `http://localhost:8000/api/v1/tracks/${params.slug}`,
    method: "GET",
    nextOption: { cache: "no-store" },
  });

  const res1 = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
    url: `http://localhost:8000/api/v1/tracks/comments`,
    method: "POST",
    queryParams: {
      current: 1,
      pageSize: 100,
      trackId: params.slug,
      sort: "-createdAt",
    },
  });

  return (
    <div>
      <div>
        <WaveTrack track={res?.data ?? null} />
      </div>
    </div>
  );
};

export default DetailTrackPage;
