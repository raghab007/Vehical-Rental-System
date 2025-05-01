import app from "./routes/route.js";
import  "../src/routes/vehicleRoutes.js"
import router from "../src/routes/vehicleRoutes.js";
import express from "express"
import path  from "path"
import paymentRouter from "./routes/paymentRoute.js";
import rentalRouter from "./routes/rentalRoutes.js";
import extensionRouter from "./routes/extensionRoutes.js"
import adminRouter from "./routes/adminRoutes.js";
import packageRouter from "./routes/adventurePackageRoutes.js"
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use('/api', paymentRouter)

app.get('/',function(req,res){
    res.send("hi there")
})

app.use("/rental", rentalRouter)


app.use("/admin",adminRouter )


app.use("/api/extension", extensionRouter)

app.use("/packages", packageRouter)

app.use("/vehicle",router)
app.listen(4000,function(){
    console.log("Server is running on: http://localhost:4000")
});