// src/App.js
import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  CircularProgress,
  Box,
  Skeleton,
} from "@mui/material";
import { fetchPosts } from "./api";
import Pagination from "@mui/material/Pagination";
import { styled } from "@mui/system";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    const getPosts = async () => {
      const data = await fetchPosts();
      setPosts(data);
      setFilteredPosts(data);
      setLoading(false);
    };
    getPosts();
    const timer = setTimeout(() => {
      setLoading(false);
    }, 8000); // Show skeleton for 8 seconds
    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredPosts(
      posts.filter((post) => post.title.toLowerCase().includes(query))
    );
    setPage(1); // Reset to first page on new search
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const indexOfLastPost = page * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const cardStyles = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "250px", // fixed height
    width: "100%", // full width of its container
    overflow: "hidden",
    transition: "transform 0.3s, box-shadow 0.3s",
    background: "rgba(255, 255, 255, 0.8)", // semi-transparent background
    backdropFilter: "blur(10px)", // blur effect
    borderRadius: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
    },
  };

  const avatarStyles = {
    width: "40px",
    height: "40px",
    marginBottom: "16px",
  };

  const titleStyles = {
    fontSize: "1.25rem",
    fontWeight: "bold",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const bodyStyles = {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 4, // limits to 4 lines
  };

  const HoverCard = styled(Card)(cardStyles);

  return (
    <Container style={{ marginTop: "20px" }}>
      <TextField
        label="Search by title"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={handleSearch}
      />
      {loading ? (
        <Grid container spacing={2}>
          {Array.from(new Array(10)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card style={cardStyles}>
                <CardContent>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={30}
                    style={{ marginBottom: 16 }}
                  />
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="100%" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          <Grid container spacing={2}>
            {currentPosts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <HoverCard>
                  <CardContent>
                    <Avatar style={avatarStyles}>{post.id}</Avatar>
                    <Typography style={titleStyles}>{post.title}</Typography>
                    <Typography style={bodyStyles}>{post.body}</Typography>
                  </CardContent>
                </HoverCard>
              </Grid>
            ))}
          </Grid>
          <Grid container justifyContent="center" marginTop={2}>
            <Pagination
              count={Math.ceil(filteredPosts.length / postsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Grid>
        </>
      )}
    </Container>
  );
};

export default App;
