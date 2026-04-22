import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength  } from "class-validator";

export class CreateAuthDto {
    @IsString()
    @MinLength(3,{message:"kamida 3 ta harf bo'lsin"})
    @MaxLength(50,{message:"kopi bilan 50 ta harf bo'lsin"})
    @ApiProperty({default:"dilshod"})
    username!:string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({default:"xudoyorovd83@gmail.com"})
    email!:string;

    @IsString()
    @Matches(/[a-zA-Z\d@$!%*?&]{8,20}/)
    @ApiProperty({default:"Dilshod123!"})
    password!:string;
}
