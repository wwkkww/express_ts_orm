import { IsString } from "class-validator";

class CreateCategoryDto {
  @IsString()
  public id: string;

  @IsString()
  public name: string;
}

export default CreateCategoryDto;