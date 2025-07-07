"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Settings } from "react-slick";
import { Box } from "@mui/material";
import Button from "@mui/material/Button/Button";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Divider from "@mui/material/Divider";
import Link from "next/link";
import { convertSlugUrl } from "@/utils/api";
import Image from "next/image";
interface IProps {
  data: ITrackTop[];
  title: string;
}

const MainSlider = (props: IProps) => {
  const { data, title } = props;

  const NextArrow = (props: any) => {
    return (
      <Button
        color="inherit"
        variant="contained"
        onClick={props.onClick}
        sx={{
          position: "absolute",
          right: 25,
          top: "25%",
          zIndex: 2,
          minWidth: 30,
          width: 35,
        }}
      >
        <ChevronRightIcon />
      </Button>
    );
  };

  const PrevArrow = (props: any) => {
    return (
      <Button
        color="inherit"
        variant="contained"
        onClick={props.onClick}
        sx={{
          position: "absolute",
          top: "25%",
          zIndex: 2,
          minWidth: 30,
          width: 35,
        }}
      >
        <ChevronLeftIcon />
      </Button>
    );
  };

  const settings: Settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  //box === div
  return (
    <Box
      sx={{
        margin: "0 50px",
        ".track": {
          padding: "0 10px",

          img: {
            height: 150,
            width: 150,
          },
        },
        h3: {
          border: "1px solid #ccc",
          padding: "20px",
          height: "200px",
        },
      }}
    >
      <h2> {title} </h2>
      <Slider {...settings}>
        {data.map((track) => {
          return (
            <div className="track" key={track._id}>
              <div
                style={{
                  position: "relative",
                  height: "150px",
                  width: "150px",
                }}
              >
                <Image
                  alt="eric image"
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                  fill
                  style={{
                    objectFit: "contain",
                  }}
                />
              </div>

              <Link
                style={{
                  textDecoration: "none",
                  color: "unset",
                  fontSize: "14px",
                }}
                href={`/track/${convertSlugUrl(track.title)}-${
                  track._id
                }.html?audio=${track.trackUrl}`}
              >
                <div
                  style={{
                    margin: "12px 0 15px 0",
                  }}
                >
                  {track.title}
                </div>
              </Link>
              <div
                style={{
                  marginBottom: "7px",
                  color: "#ccc",
                  fontSize: "13px",
                }}
              >
                {track.description}
              </div>
            </div>
          );
        })}
      </Slider>
      <Divider />
    </Box>
  );
};

export default MainSlider;
