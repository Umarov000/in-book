import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AdminAuthService } from "./admin-auth.service";
import { CreateAdminDto } from "../admins/dto/create-admin.dto";
import { SigninAdminDto } from "../admins/dto/sign-in-admin.dto";
import { Request, Response } from "express";
import { CookieGetter } from "../common/decorators/cookie-getter.decorator";
import { AdminGuard } from "../common/guards/admin.guard";
import { IsCreatorGuard } from "../common/guards/is_creator.guard";

@Controller("admin-auth")
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}
  @Post("signup")
  signup(@Body() createAdminDto: CreateAdminDto) {
    return this.adminAuthService.signup(createAdminDto);
  }

  @HttpCode(200)
  @Post("signin")
  signin(
    @Body() signinAdminDto: SigninAdminDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.adminAuthService.signin(signinAdminDto, res);
  }

  @HttpCode(200)
  @Post("logout")
  signout(
    @CookieGetter("refreshToken") refeshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.adminAuthService.logout(refeshToken, res);
  }
  @HttpCode(200)
  @Post("refresh")
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.adminAuthService.refresh(req, res);
  }

  //   @HttpCode(200)
  //   @Post(":id/refresh")
  //   async refresh(
  //     @Param("id", ParseIntPipe) id: number,
  //     @CookieGetter("refreshToken") refeshToken: string,
  //     @Res({ passthrough: true }) res: Response
  //   ) {
  //     return this.authService.refreshToken(id, refeshToken, res);
  //   }
}
