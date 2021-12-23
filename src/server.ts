require("dotenv").config();

import express from "express";
import router from "./router";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API Cognito Backend amazon-cognito-identity-js / awd-sdk",
  });
});

app.use("/api/v1/users", router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on :${port}`);
});
