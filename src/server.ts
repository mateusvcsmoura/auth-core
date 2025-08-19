import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "hello" });
});

app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));


