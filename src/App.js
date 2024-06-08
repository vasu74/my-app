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
    transition: "transform 0.3s",
    "&:hover": {
      transform: "scale(1.05)",
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
    <Container>
      <TextField
        label="Search by title"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={handleSearch}
      />
      {loading ? (
        <Grid container justifyContent="center">
          <CircularProgress />
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
