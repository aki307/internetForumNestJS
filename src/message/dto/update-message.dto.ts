import {IsNotEmpty, IsString, MaxLength} from 'class-validator';

export class UpdateMessageDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    title: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(140)
    description: string;
}