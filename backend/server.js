

import connectDb from "./config/db.js";
import app from "./app.js";



connectDb()
    .then(() => {
        app.listen((process.env.PORT || 9000), (err) => {
            if (err) return
        })

        console.log(`server is running on ${process.env.PORT}`);


    }).catch((err) => {
        console.log('error ', err.message);

    })
    