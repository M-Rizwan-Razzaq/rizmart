import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/** Authenticate checkout customers when they provide a token, while allowing guests. */
@Injectable()
export class JwtOptionalAuthGuard extends AuthGuard("jwt") {
  handleRequest<TUser = any>(
    err: unknown,
    user: TUser | false | null,
    _info: unknown,
    context: ExecutionContext,
  ): TUser | null {
    if (err) throw err;
    if (user) return user;

    const request = context.switchToHttp().getRequest();
    if (request.headers.authorization) throw new UnauthorizedException();

    return null;
  }
}
