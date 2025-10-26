export class ServerErrorResponseDto {
  statusCode: number;
  message: string;
  success: false; 
  cause?: string;
  errorValidations?: Array<{ field: any; message: unknown }>;
  timestamp: string;
}