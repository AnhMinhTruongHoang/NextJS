import Container from "@mui/material/Container";
import { sendRequest } from "@/utils/api";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import WaveTrack from "@/components/wave-track/wave-track";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const temp = params?.slug?.split(".html") ?? [];
  const temp1 = (temp[0]?.split("-") ?? []) as string[];
  const id = temp1[temp1.length - 1];

  const res = await sendRequest<IBackendRes<ITracksTop>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
    method: "GET",
  });
  return {
    title: res.data?.title,
    description: res.data?.description,

    openGraph: {
      title: "SoundCloud",
      description: "Update Beyond Your Coding Skills",
      type: "website",
      images: [
        `https://raw.githubusercontent.com/hoidanit/images-hosting/master/eric.png`,
      ],
    },
  };
}

export async function generateStaticParams() {
  return [
    { slug: "nu-hon-bisou-6507bf9cf423204f73c438cc.html" },
    { slug: "le-luu-ly-6507bf9cf423204f73c438cf.html" },
    { slug: "sau-con-mua-6507bf9cf423204f73c438d0.html" },
  ];
}

const DetailTrackPage = async (props: any) => {
  const { params } = props; //regx

  const temp = params?.slug?.split(".html") ?? [];
  const temp1 = (temp[0]?.split("-") ?? []) as string[];
  const id = temp1[temp1.length - 1];

  const res = await sendRequest<IBackendRes<ITracksTop>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
    method: "GET",
    nextOption: {
      // cache: "no-store"
      next: { tags: ["track-by-id"] },
    },
  });

  const res1 = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`,
    method: "POST",
    queryParams: {
      current: 1,
      pageSize: 100,
      trackId: id,
      sort: "-createdAt",
    },
    nextOption: {
      // cache: "no-store"
      next: { tags: ["track-comment"] },
    },
  });
  // await new Promise(resolve => setTimeout(resolve, 5000))

  if (!res?.data) notFound();

  return (
    <Container>
      <div>
        <WaveTrack
          track={res?.data ?? null}
          comments={res1?.data?.result ?? []}
        />
      </div>
    </Container>
  );
};

export default DetailTrackPage;
