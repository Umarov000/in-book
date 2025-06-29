import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";

// import { join } from "path";
import { UsersModule } from './users/users.module';
import { User } from "./users/models/user.model";
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    // ServeStaticModul.forRoot({ rootPath: join(__dirname, "..", "static") }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
      models: [User],
      autoLoadModels: true,
      logging: false,
      sync: { alter: true }, //force
    }),
    UsersModule,
    AuthModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
