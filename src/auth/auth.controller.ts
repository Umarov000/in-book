import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { SigninUserDto } from "../users/dto/signin-user.dto";
import { Request, Response } from "express";
import { CookieGetter } from "../common/decorators/cookie-getter.decorator";
import { AdminGuard } from "../common/guards/admin.guard";
import { IsCreatorGuard } from "../common/guards/is_creator.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(AdminGuard, IsCreatorGuard)
  @Post("signup")
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @HttpCode(200)
  @Post("signin")
  signin(
    @Body() signinUserDto: SigninUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signin(signinUserDto, res);
  }
  @Get("activate/:link")
  async activate(@Param("link") activationLink: string) {
    return this.authService.activate(activationLink);
  }
  @HttpCode(200)
  @Post("signout")
  signout(
    @CookieGetter("refreshToken") refeshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.logout(refeshToken, res);
  }

  @HttpCode(200)
  @Post(":id/refresh")
  async refresh(
    @Param("id", ParseIntPipe) id: number,
    @CookieGetter("refreshToken") refeshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.refreshToken(id, refeshToken, res);
  }

  @HttpCode(200)
  @Post("refresh")
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.refresh(req, res);
  }
}
