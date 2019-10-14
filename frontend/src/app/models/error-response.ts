export class ErrorResponse{
    status: number;
    description: string;
    timestamp: Date;
    errors? : string[];
}