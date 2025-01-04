import authRouter from '../Controllers/Auth/index'
import academicsRouter from '../Controllers/Academics/index';

function routes(app:any) {

    app.use("/api/auth", authRouter);
    app.use("/api/academics", academicsRouter);

}

export default routes;