import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";

// import { join } from "path";
import { UsersModule } from "./users/users.module";
import { User } from "./users/models/user.model";
import { AuthModule } from "./auth/auth.module";
import { MailModule } from "./mail/mail.module";
import { AdminsModule } from "./admins/admins.module";
import { AuthorsModule } from "./authors/authors.module";
import { LanguagesModule } from "./languages/languages.module";
import { CategoriesModule } from "./categories/categories.module";
import { GenreModule } from "./genre/genre.module";
import { AdminAuthModule } from "./admin-auth/admin-auth.module";
import { Admin } from "./admins/models/admin.model";
import { TelegrafModule } from "nestjs-telegraf";
import { BOT_NAME } from "./app.constants";
import { BotModule } from "./bot/bot.module";
import { Author } from "./authors/models/author.model";
import { Category } from "./categories/models/category.model";
import { Genre } from "./genre/models/genre.model";
import { Language } from "./languages/models/language.model";

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      botName: BOT_NAME,
      useFactory: () => ({
        token: process.env.BOT_TOKEN!,
        middlewares: [],
        include: [BotModule],
      }),
    }),
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
      models: [User, Admin, Author, Category, Genre, Language],
      autoLoadModels: true,
      logging: false,
      sync: { alter: true }, //force
    }),
    UsersModule,
    AuthModule,
    MailModule,
    AdminsModule,
    AuthorsModule,
    LanguagesModule,
    CategoriesModule,
    GenreModule,
    AdminAuthModule,
    BotModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
