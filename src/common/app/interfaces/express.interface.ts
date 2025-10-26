import { UserJwtPayload } from "../../../modules/auth/interfaces/user-jwt-payload.interface";

declare module 'express' {
  export interface Request {
    user: UserJwtPayload;
  }
}
