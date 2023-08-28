import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class AuthDtoLoginLogout {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    password: string;
}