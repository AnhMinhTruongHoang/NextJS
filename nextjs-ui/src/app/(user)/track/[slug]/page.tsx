import Container from "@mui/material/Container";
import { sendRequest } from "@/utils/api";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import WaveTrack from "@/components/wave-track/wave-track";
import next from "next";

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

  const res = await sendRequest<IBackendRes<ITrackTop>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
    method: "GET",
    nextOption: {
      next: { tags: ["track-by-id"] },
    },
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
    { slug: "nu-hon-bisou-6846fb82bb0dbdc3010844f6.html" },
    { slug: "who-you-know-6846fb82bb0dbdc301084503.html" },
    { slug: "send-me-on-my-way-6846fb82bb0dbdc30108450a.html" },
  ];
}

const DetailTrackPage = async (props: any) => {
  const { params } = props; //regx

  const temp = params?.slug?.split(".html") ?? [];
  const temp1 = (temp[0]?.split("-") ?? []) as string[];
  const id = temp1[temp1.length - 1];

  const res = await sendRequest<IBackendRes<ITrackTop>>({
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
