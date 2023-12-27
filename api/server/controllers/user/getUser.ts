import { Request, Response } from 'express';

export default async function getUser(req: Request, res: Response): Promise<Response> {
    return res.status(200).json({ user: req.session.user });
}