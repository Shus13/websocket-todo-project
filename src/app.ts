
import express, { type Request, type Response } from 'express'
import path from 'path'
const app = express()

app.set("views", path.join(process.cwd(), "views"));app.set("view engine", "ejs")
app.get("/", (req:Request, res:Response)=> {
    res.render("home.ejs")
})

export default app