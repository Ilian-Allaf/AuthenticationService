import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export default async function getAuthorizationToken(req: Request, res: Response): Promise<Response> {
    const secret = process.env.JWT_SECRET as string;

    const jwtHasuraClaims = {
        "https://hasura.io/jwt/claims":{
            'x-hasura-default-role': 'user',
            'x-hasura-role': req.session.user!.role,
            'x-hasura-user-id': req.session.user!.id as string,
            "x-hasura-allowed-roles": ["admin", "user"],
        }
      };
    const token = jwt.sign(jwtHasuraClaims, secret, { algorithm: 'RS512' });
    return res.status(200).json({ token: token });
}