import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateAuthorDto } from "./dto/create-author.dto";
import { UpdateAuthorDto } from "./dto/update-author.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Author } from "./models/author.model";

@Injectable()
export class AuthorsService {
  constructor(@InjectModel(Author) private authorModel: typeof Author) {}
  async create(createAuthorDto: CreateAuthorDto) {
    const newAuthor = await this.authorModel.create(createAuthorDto);
    return newAuthor;
  }

  async findAll() {
    return await this.authorModel.findAll();
  }

  async findOne(id: number) {
    const author = await this.authorModel.findByPk(id);
    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return author;
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    const author = await this.authorModel.findByPk(id);
    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    await author.update(updateAuthorDto);
    return author;
  }

  async remove(id: number) {
    const author = await this.authorModel.findByPk(id);

    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    await author.destroy();
    return { message: `Author with ID ${id} has been removed` };
  }
}
