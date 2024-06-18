import authRouter from '../API/Auth/index'
import academicsRouter from '../API/Academics/index';

function routes(app:any) {

    app.use("/api/auth", authRouter);
    app.use("/api/academics", academicsRouter);

}

export default routes;