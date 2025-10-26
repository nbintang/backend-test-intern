 
export interface UserPayload {
  id: number;  
  email: string;
}

export interface UserJwtPayload extends UserPayload {
  iat: number;
  exp: number;
}