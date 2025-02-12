import app from "./app.js";

const port = process.env.PORT || 7004;
app.listen(port, () => {
  console.log(`Server running on port : http://localhost:${port}`);
});
