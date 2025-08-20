import express from "express";
import { adminRouter } from "./routes/admin.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { userRouter } from "./routes/user.js";
import { homeRouter } from "./routes/home.js";
import { middlewares } from "./middlewares/auth-middlewares.js";
import { PORT } from "./config/index.js";

const app = express();

app.use(express.json());

app.use('/api/auth/admin', adminRouter);
app.use('/api/auth/user', userRouter);
app.use('/api/auth', middlewares.ensureAuth, homeRouter);

app.use(errorHandler);

app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));


