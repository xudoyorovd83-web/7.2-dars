import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches  } from "class-validator";

export class LoginDto {

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({default:"xudoyorovd83@gmail.com"})
    email!:string;

    @IsString()
    @Matches(/[a-zA-Z\d@$!%*?&]{8,20}/)
    @ApiProperty({default:"Dilshod123!"})
    password!:string;
}
