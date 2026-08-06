import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // MongoDB duplicate key — return 409 instead of 500
    const mongoCode =
      (exception as any)?.code ?? (exception as any)?.cause?.code;
    if (mongoCode === 11000) {
      const keyPattern =
        (exception as any)?.keyPattern ??
        (exception as any)?.cause?.keyPattern ??
        {};
      const field = Object.keys(keyPattern)[0] ?? "field";
      response.status(409).json({
        success: false,
        statusCode: 409,
        message: `Duplicate value: a record with this ${field} already exists`,
        error: "Conflict",
        timestamp: new Date().toISOString(),
        path: request.url,
      });
      return;
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : "Internal server error";

    const message =
      typeof exceptionResponse === "string"
        ? exceptionResponse
        : ((exceptionResponse as any).message ?? "An error occurred");

    const error =
      typeof exceptionResponse === "object"
        ? ((exceptionResponse as any).error ?? exception?.constructor?.name)
        : exception?.constructor?.name;

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
