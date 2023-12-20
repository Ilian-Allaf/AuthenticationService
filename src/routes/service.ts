import signUp from '../controllers/signup';
import logIn from '../controllers/login';
import logOut from '../controllers/logout';
import forgotPassword from '../controllers/forgotPassword';
import { Request, Response } from 'express';
import Router from 'express';

const router = Router();

router.post("/signup", (req: Request, res:Response) => {signUp(req, res)})
router.post("/login", (req: Request, res:Response) => {logIn(req, res)});
router.post("/logout", (req: Request, res:Response) => {logOut(req, res)})
router.post("/forgot-password", (req: Request, res:Response) => {forgotPassword(req, res)})
router.get("/test" , (req: Request, res:Response) => {
    res.cookie('cookieName', 'cookieValue', { maxAge: 900000, httpOnly: true });
    res.status(200).json({ message: 'Test successful' });
});
export default router;