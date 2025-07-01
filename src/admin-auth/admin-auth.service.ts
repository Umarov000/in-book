import {
    BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AdminsService } from "../admins/admins.service";
import { Admin } from "../admins/models/admin.model";
import { CreateAdminDto } from "../admins/dto/create-admin.dto";
import { SigninAdminDto } from "../admins/dto/sign-in-admin.dto";
import * as bcrypt from "bcrypt";
import { Request, Response } from "express";

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminsService: AdminsService
  ) {}
  private async generateTokens(admin: Admin) {
    const payload = {
      id: admin.id,
      is_active: admin.is_active,
      is_creator: admin.is_creator,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY_ADMIN,
        expiresIn: process.env.ACCESS_TOKEN_TIME_ADMIN,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY_ADMIN,
        expiresIn: process.env.REFRESH_TOKEN_TIME_ADMIN,
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
  async signup(createAdminDto: CreateAdminDto) {
    const candidate = await this.adminsService.findAdminByEmail(
      createAdminDto.email
    );
    if (candidate) {
      throw new ConflictException("Admin already exists");
    }
    const newAdmin = await this.adminsService.create(createAdminDto);

    return { message: `You successfully signed up`, newAdmin };
  }

  async signin(signinAdminDto: SigninAdminDto, res: Response) {
    const admin = await this.adminsService.findAdminByEmail(
      signinAdminDto.email
    );
    if (!admin) {
      throw new UnauthorizedException("Password or Email incorrect");
    }
    const validPassword = await bcrypt.compare(
      signinAdminDto.password,
      admin.password
    );

    if (!validPassword) {
      throw new UnauthorizedException("Password or Email incorrect");
    }
    const { accessToken, refreshToken } = await this.generateTokens(admin);

    admin.refresh_token = await bcrypt.hash(refreshToken, 7);
    await admin.save();
    res.cookie("refreshToken", refreshToken, {
      maxAge: +process.env.COOKIE_TIME!,
      httpOnly: true,
    });

    return { message: "You signed in successfully", id: admin.id, accessToken };
  }

  async refresh(req: Request, res: Response) {
    const token = req.cookies["refreshToken"];
    if (!token) {
      throw new UnauthorizedException("Please sign in first");
    }

    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.REFRESH_TOKEN_KEY_ADMIN,
      });
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    const admin = await this.adminsService.findOne(payload.id);
    if (!admin || !admin.refresh_token) {
      throw new UnauthorizedException("Admin not found or not signed in");
    }

    const isTokenValid = await bcrypt.compare(token, admin.refresh_token);
    if (!isTokenValid) {
      throw new UnauthorizedException("Refresh token does not match");
    }

    const { accessToken, refreshToken } = await this.generateTokens(admin);
    admin.refresh_token = await bcrypt.hash(refreshToken, 7);
    await admin.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: +process.env.COOKIE_TIME!,
    });

    return {
      message: "Tokens refreshed successfully",
      accessToken,
    };
  }
   async logout(refreshToken: string, res: Response) {
      let adminData: any;
      try {
        adminData = await this.jwtService.verify(refreshToken, {
          secret: process.env.REFRESH_TOKEN_KEY_ADMIN,
        });
      } catch (error) {
        console.log(error);
        throw new BadRequestException(error);
      }
  
      if (!adminData) {
        throw new ForbiddenException("Admin not found");
      }
      await this.adminsService.updateRefreshToken(adminData.id, "");
  
      res.clearCookie("refreshToken");
      return { message: "Logged out" };
    }
}
