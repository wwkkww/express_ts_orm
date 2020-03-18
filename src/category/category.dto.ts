import { IsString } from "class-validator";

class CategoryDto {
  @IsString()
  public id: string;

  @IsString()
  public name: string;
}

export default CategoryDto;