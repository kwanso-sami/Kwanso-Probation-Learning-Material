// Requiring module
const express = require("express");
const logger = require('morgan');

const axios = require("axios");
// Creating express object
const app = express();
app.use(logger('dev'));

app.get("/AsyncAwait", async (req, res) => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users", {
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      res.send(`HTTP error! Status: ${response.status}`);
    }

    const users = await response.json();
    const phoneNumbers = users.map((user) => user.phone);

    res.status(200).json({
      status: "success",
      data: phoneNumbers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/then", (req, res) => {
  const url = "https://jsonplaceholder.typicode.com/users";
  fetch(url, {
    signal: AbortSignal.timeout(5000),
  })
    .then((response) => response.json())
    .then((users) => {
      const phoneNumbers = users.map((user) => user.phone);
      res.status(200).json({
        status: "success",
        data: phoneNumbers,
      });
    })
    .catch((error) => {
      console.error("error in execution", error);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/callback", (req, res) => {
  const url = "https://jsonplaceholder.typicode.com/users";

  fetchUsers(url, (error, data) => {
    if (error) {
      console.error("Error fetching data:", error);
      res.status(500).send("Internal Server Error");
    } else {
      const phoneNumbers = data.map((user) => user.phone);

      res.status(200).json({
        status: "success",
        data: phoneNumbers,
      });
    }
  });
});

async function fetchUsers(url, fetchContacts) {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      return fetchContacts(`HTTP error! status: ${response.status}`);
    }
    const users = await response.json();
    return fetchContacts(null, users);
  } catch (error) {
    return fetchContacts(error);
  }
}

app.get("/photos", async (req, res) => {
  try {
    const photosResponse = await fetch(
      "https://jsonplaceholder.typicode.com/photos",
      {
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!photosResponse.ok) {
      res.send(`HTTP error! Status: ${photosResponse.status}`);
    }

    const photos = await photosResponse.json();

    res.status(200).json({
      status: "success",
      data: photos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/posts", async (req, res) => {
  try {
    const postsResponse = await fetch(
      "https://jsonplaceholder.typicode.com/posts",
      {
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!postsResponse.ok) {
      res.send(`HTTP error! Status: ${postsResponse.status}`);
    }

    let posts = await postsResponse.json();

    const { title, body, sort } = req.query;

    if (title) {
      posts = posts.filter((post) => post.title.includes(title.trim()));
    }

    if (body) {
      posts = posts.filter((post) =>
        post.body
          .replace(/(\n)/gm, " ")
          .includes(body.replace(/(\n)/gm, " ").trim())
      );
    }

    if (sort) {
      const sortOptions = sort.split(",");

      for (let i in sortOptions) {
        let sortOption = sortOptions[i].trim();

        if (sortOption.startsWith("-")) {
          // Descending Order Sorting
          sortOption = sortOption.slice(1);
          posts.sort((a, b) => b[sortOption].localeCompare(a[sortOption]));
        } else {
          // Ascending Order Sorting
          posts.sort((a, b) => a[sortOption].localeCompare(b[sortOption]));
        }
      }
    }

    res.status(200).json({
      status: "success",
      data: posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/users", async (req, res) => {
  try {
    const usersResponse = await fetch(
      "https://jsonplaceholder.typicode.com/users",
      {
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!usersResponse.ok) {
      res.send(`HTTP error! Status: ${usersResponse.status}`);
    }

    let users = await usersResponse.json();

    const { zip } = req.query;

    if (zip) {
      users = users
        .filter((user) => user.address.zipcode === zip)
        .map((user) => {
          return {
            id: user.id,
            name: user.name,
            address: {
              zipcode: user.address.zipcode,
            },
          };
        });
    }

    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/comments", async (req, res) => {
  try {
    const commentsResponse = await fetch(
      "https://jsonplaceholder.typicode.com/comments",
      {
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!commentsResponse.ok) {
      res.send(`HTTP error! Status: ${commentsResponse.status}`);
    }

    const comments = await commentsResponse.json();

    res.status(200).json({
      status: "success",
      data: comments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/posts/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const commentsResponse = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}/comments`,
      {
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!commentsResponse.ok) {
      res.send(`HTTP error! Status: ${commentsResponse.status}`);
    }

    const commentsOfPost = await commentsResponse.json();

    res.status(200).json({
      status: "success",
      data: commentsOfPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/embeddedPosts", async (req, res) => {
  try {
    const postsResponse = await axios.get(
      "https://jsonplaceholder.typicode.com/posts",
      {
        timeout: 5000,
      }
    );

    if (postsResponse.status !== 200) {
      res.send(`HTTP error! Status: ${postsResponse.status}`);
    }

    const posts = postsResponse.data;

    const commentsResponse = await axios.get(
      "https://jsonplaceholder.typicode.com/comments",
      {
        timeout: 5000,
      }
    );

    if (commentsResponse.status !== 200) {
      res.send(`HTTP error! Status: ${commentsResponse.status}`);
    }

    const comments = commentsResponse.data;

    const postsWithComments = posts.map((post) => {
      const postComments = comments.filter(
        (comment) => comment.postId === post.id
      );
      post.comments = [...postComments];
      return post;
    });

    res.status(200).json({
      status: "success",
      data: postsWithComments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/embeddedUsers", async (req, res) => {
  try {
    const usersResponse = await axios.get(
      "https://jsonplaceholder.typicode.com/users",
      {
        timeout: 5000,
      }
    );

    if (usersResponse.status !== 200) {
      res.send(`HTTP error! Status: ${usersResponse.status}`);
    }

    const users = usersResponse.data;

    const postsResponse = await axios.get(
      "https://jsonplaceholder.typicode.com/posts",
      {
        timeout: 5000,
      }
    );

    if (postsResponse.status !== 200) {
      res.send(`HTTP error! Status: ${postsResponse.status}`);
    }

    const posts = postsResponse.data;

    const usersWithPosts = users.map((user) => {
      const userPosts = posts.filter((post) => post.userId === user.id);
      user.posts = [...userPosts];
      return user;
    });

    res.status(200).json({
      status: "success",
      data: usersWithPosts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/posts", async (req, res) => {
  try {
    const postsResponse = await fetch(
      "https://jsonplaceholder.typicode.com/posts",
      {
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!postsResponse.ok) {
      res.send(`HTTP error! Status: ${postsResponse.status}`);
    }

    const posts = await postsResponse.json();

    const { user } = req.query;

    const updatedPosts = posts.filter((post) => post.userId !== parseInt(user));
    res.status(200).json({
      status: "success",
      data: updatedPosts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Port Number
const PORT = process.env.PORT || 3000;

// Server Setup
app.listen(PORT, console.log(`Server started on port ${PORT}`));
