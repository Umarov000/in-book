import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import * as bcrypt from "bcrypt";
import { Admin } from "./models/admin.model";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class AdminsService {
  constructor(@InjectModel(Admin) private adminModel: typeof Admin) {}
  async create(createAdminDto: CreateAdminDto) {
    const { password, confirm_password } = createAdminDto;
    if (password !== confirm_password) {
      throw new BadRequestException("Passwords do not match.");
    }
    const hashed_password = await bcrypt.hash(password, 7);
    const newAdmin = await this.adminModel.create({
      ...createAdminDto,
      password: hashed_password,
    });

    return newAdmin;
  }

  async findAll() {
    return await this.adminModel.findAll();
  }

  async findOne(id: number) {
    const admin = await this.adminModel.findByPk(id);
    if (!admin) {
      throw new NotFoundException("Admin not found");
    }
    return admin;
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const admin = await this.adminModel.findByPk(id);
    if (!admin) {
      throw new NotFoundException("Admin not found");
    }
    await admin.update(updateAdminDto);
    return admin;
  }

  async remove(id: number) {
    const admin = await this.adminModel.findByPk(id);

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    await admin.destroy();
    return { message: `Admin with ID ${id} has been removed` };
  }
  async findAdminByEmail(email: string) {
    return await this.adminModel.findOne({ where: { email } });
  }
  async updateRefreshToken(id: number, refresh_token: string) {
    const updatedData = await this.adminModel.update(
      { refresh_token },
      { where: { id } }
    );
    return updatedData;
  }
}
