import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateLanguageDto } from "./dto/create-language.dto";
import { UpdateLanguageDto } from "./dto/update-language.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Language } from "./models/language.model";

@Injectable()
export class LanguagesService {
  constructor(@InjectModel(Language) private languageModel: typeof Language) {}
  async create(createLanguageDto: CreateLanguageDto) {
    const data = await this.languageModel.create(createLanguageDto);
    return data;
  }

  async findAll() {
    return await this.languageModel.findAll();
  }

  async findOne(id: number) {
    const language = await this.languageModel.findByPk(id);
    if (!language) {
      throw new NotFoundException(`Language with ID ${id} not found`);
    }
    return language;
  }

  async update(id: number, updateLanguageDto: UpdateLanguageDto) {
    const language = await this.languageModel.findByPk(id);
    if (!language) {
      throw new NotFoundException(`Language with ID ${id} not found`);
    }
    await language.update(updateLanguageDto);
    return language;
  }

  async remove(id: number) {
    const language = await this.languageModel.findByPk(id);
    if (!language) {
      throw new NotFoundException(`Language with ID ${id} not found`);
    }
    await language.destroy();
    return language;
  }
}
