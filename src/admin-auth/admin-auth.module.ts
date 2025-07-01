import { Module } from "@nestjs/common";
import { AdminAuthService } from "./admin-auth.service";
import { AdminAuthController } from "./admin-auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { AdminsModule } from "../admins/admins.module";

@Module({
  imports: [JwtModule.register({}), AdminsModule],
  providers: [AdminAuthService],
  controllers: [AdminAuthController],
})
export class AdminAuthModule {}
