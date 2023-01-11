import mongoose from "mongoose";
import config from "./config/config.js";
import app from "./app.js";

(async () => {
  try {
    mongoose.set("strictQuery", false);

    await mongoose.connect(config.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    app.on("error", () => {
      console.log("ERROR: ", err);
      throw err;
    });
    console.log("DB CONNECTED");

    app.listen(config.PORT, () =>
      console.log(`Listening on PORT:${config.PORT}`)
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
})();
