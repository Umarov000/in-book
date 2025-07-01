import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateGenreDto } from "./dto/create-genre.dto";
import { UpdateGenreDto } from "./dto/update-genre.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Genre } from "./models/genre.model";
import { genSalt } from "bcrypt";

@Injectable()
export class GenreService {
  constructor(@InjectModel(Genre) private genreModel: typeof Genre) {}
  async create(createGenreDto: CreateGenreDto) {
    const newgenre = await this.genreModel.create(createGenreDto);
    return newgenre;
  }

  async findAll() {
    return await this.genreModel.findAll();
  }

  async findOne(id: number) {
    const genre = await this.genreModel.findByPk(id);
    if (!genre) {
      throw new NotFoundException(`Genre not found`);
    }
    return genre;
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    const genre = await this.genreModel.findByPk(id);
    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }
    await genre.update(updateGenreDto);
    return genre;
  }

  async remove(id: number) {
    const genre = await this.genreModel.findByPk(id);
    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }
    await genre.destroy();
    return genre;
  }
}
