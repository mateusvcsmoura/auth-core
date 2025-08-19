import express from "express";
import { adminRouter } from "./routes/admin.js";
import { errorHandler } from "./middlewares/error-handler.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/auth/admin', adminRouter);
app.use(errorHandler);

app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));


