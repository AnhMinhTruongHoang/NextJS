import WaveTrack from "@/components/wave-track/wave-track";
import { Container } from "@mui/material";
import { sendRequest } from "@/utils/api";
import { Metadata, ResolvingMetadata } from "next";
import slugify from "slugify";

type IProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// Meta data
export async function generateMetadata(
  { params }: IProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const temp = params?.slug?.split(".html") ?? [];
  const temp1 = (temp[0].split("_") ?? []) as string[];
  const id = temp1[temp1.length - 1];
  const res = await sendRequest<IBackendRes<ITracksTop>>({
    url: `http://localhost:8000/api/v1/tracks/${id}`,
    method: "GET",
    nextOption: { cache: "no-store" },
  });

  return {
    title: res.data?.title ?? "Track Detail",
    description: res.data?.description ?? "Track description",
    openGraph: {
      title: "SoundCloud",
      description: "Beyond Your Coding Skills",
      type: "website",
      images: [
        `https://raw.githubusercontent.com/AnhMinhTruongHoang/NextJS/master/FE/public/vite.svg`,
      ],
    },
  };
}

//
const DetailTrackPage = async (props: any) => {
  //
  const { params } = props;
  const temp = params?.slug?.split(".html") ?? [];
  const temp1 = (temp[0].split("_") ?? []) as string[];
  const id = temp1[temp1.length - 1];
  //
  const res = await sendRequest<IBackendRes<ITracksTop>>({
    url: `http://localhost:8000/api/v1/tracks/${id}`,
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

  const track = res?.data ?? null;
  const comments = res1?.data?.result ?? [];

  return (
    <div>
      <Container>
        <WaveTrack track={track} comments={comments} />
      </Container>
    </div>
  );
};

export default DetailTrackPage;
