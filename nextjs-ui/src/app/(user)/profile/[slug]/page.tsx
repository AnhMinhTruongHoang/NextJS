"use client";

import ProfileTracks from "@/components/header/profile.tracks";
import {
  Container,
  Grid,
  IconButton,
  Typography,
  Box,
  Pagination,
} from "@mui/material";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { useEffect, useState } from "react";

interface IProps {
  params: { slug: string };
}

const ITEMS_PER_PAGE = 6;

const ProfilePage = ({ params }: IProps) => {
  const [data, setData] = useState<ITrackTop[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const paginatedTracks = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/users?current=1&pageSize=100`,
        {
          method: "POST",
          body: JSON.stringify({ id: params.slug }),
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        }
      );
      const result = await res.json();
      setData(result?.data?.result || []);
    };
    fetchData();
  }, [params.slug]);

  return (
    <Container sx={{ my: 5 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Các track đã đăng
      </Typography>

      <Grid container spacing={4}>
        {paginatedTracks.map((item, index) => (
          <Grid item xs={12} md={6} key={index}>
            <ProfileTracks data={item} />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, value) => setCurrentPage(value)}
            color="primary"
            shape="rounded"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
};

export default ProfilePage;
