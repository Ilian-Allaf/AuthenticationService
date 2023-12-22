import signUp from '../controllers/signup';
import logIn from '../controllers/login';
import logOut from '../controllers/logout';
import handleForgotPassword from '../controllers/forgotPassword';
import handlePasswordReset from '../controllers/passwordReset';
import emailResetForAuthenticatedUser from '../controllers/user/emailResetForAuthenticatedUser';
import passwordResetForAuthenticatedUser from '../controllers/user/passwordResetForAuthenticatedUser';
import usernameResetForAuthenticatedUser from '../controllers/user/usernameResetForAuthenticatedUser';
import getAuthorizationToken from '../controllers/user/getAuthorizationToken';
import getUser from '../controllers/user/getUser';
import { NextFunction, Request, Response } from 'express';
import Router from 'express';

const router = Router();

function checkAuth(req: Request, res: Response, next: NextFunction){
    if(!req.session.user){
        return res.status(401).json({ message: 'Not authenticated' });
    }
    next();
};

router.post("/signup", (req: Request, res:Response) => { signUp(req, res); })
router.post("/login", (req: Request, res:Response) => { logIn(req, res); });
router.post("/forgot-password", (req: Request, res:Response) => { handleForgotPassword(req, res); })
router.post("/password-reset", (req: Request, res:Response) => { handlePasswordReset(req, res); })

router.get("/user", checkAuth, (req: Request, res:Response) => { getUser(req, res) });
router.get("/user/logout", checkAuth, (req: Request, res:Response) => { logOut(req, res) })
router.post("/user/email-reset", checkAuth, (req: Request, res:Response) => { emailResetForAuthenticatedUser(req, res); });
router.post("/user/password-reset", checkAuth, (req: Request, res:Response) => { passwordResetForAuthenticatedUser(req, res); });
router.post("/user/username-reset", checkAuth, (req: Request, res:Response) => { usernameResetForAuthenticatedUser(req, res); });
router.get("/user/authorization", checkAuth, (req: Request, res:Response) => { getAuthorizationToken(req, res); });


router.get("/test" , checkAuth,(req: Request, res:Response) => {res.status(200).json({ message: 'Test successful' });});
export default router;