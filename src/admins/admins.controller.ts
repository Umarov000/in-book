import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { AdminsService } from "./admins.service";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { AdminGuard } from "../common/guards/admin.guard";
import { AdminSelfGuard } from "../common/guards/admin-self.guard";

@Controller("admins")
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  @UseGuards(AdminGuard)
  @Get()
  findAll() {
    return this.adminsService.findAll();
  }
  
  @UseGuards(AdminGuard, AdminSelfGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.adminsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminsService.update(+id, updateAdminDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.adminsService.remove(+id);
  }
}
