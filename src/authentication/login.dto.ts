import { IsString } from 'class-validator';

class LogInDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export default LogInDto;