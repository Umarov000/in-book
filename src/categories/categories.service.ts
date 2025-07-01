import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Category } from "./models/category.model";

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category) private categoryModel: typeof Category) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const newCategory = await this.categoryModel.create(createCategoryDto);
    return newCategory;
  }

  async findAll() {
    return await this.categoryModel.findAll();
  }

  async findOne(id: number) {
    const category = await this.categoryModel.findByPk(id);
    if (!category) {
      throw new NotFoundException(`Category not found`);
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryModel.findByPk(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    await category.update(updateCategoryDto);
    return category;
  }

  async remove(id: number) {
    const category = await this.categoryModel.findByPk(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    await category.destroy();
    return category;
  }
}
