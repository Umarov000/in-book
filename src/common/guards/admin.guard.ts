import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request | any = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException("Unauthorized user!");
    }
    const bearer = authHeader.split(" ")[0];
    const token = authHeader.split(" ")[1];
    if (bearer != "Bearer" || !token) {
      throw new UnauthorizedException({ message: `Bearer token not provided` });
    }
    async function verify(token: string, jwtService: JwtService) {
      let payload: any;
      try {
        payload = await jwtService.verify(token, {
          secret: process.env.ACCESS_TOKEN_KEY_ADMIN,
        });
      } catch (error) {
        console.log(error);
        throw new BadRequestException(error);
      }
      if (!payload) {
        throw new UnauthorizedException("Unauthorized user!");
      }
      //   if (!payload.is_active) {
      //     throw new UnauthorizedException(
      //       "You have not verified your account, Please verify your account"
      //     );
      //   }
      req.admin = payload;
      return true;
    }
    return verify(token, this.jwtService);
  }
}
