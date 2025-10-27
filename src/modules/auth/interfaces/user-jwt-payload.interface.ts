 
export interface MerchantPayload {
  id: number;  
  email: string;
}

export interface MerchantJwtPayload extends MerchantPayload {
  iat: number;
  exp: number;
}