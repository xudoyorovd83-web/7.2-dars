import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class VeriflyDto{
    @IsEmail()
    @IsNotEmpty()
       @ApiProperty({default:"xudoyorovd83@gmail.com"})
    email!:string;

      @IsString()
    @IsNotEmpty()
       @ApiProperty({default:"123456789"})
    otp!:string;
}