import { IsString, IsEmail, Length, Matches, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssociateDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Length(10, 10)
  @Matches(/^[6-9]\d{9}$/, { message: 'Invalid Indian phone number' })
  phone: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(12, 12)
  @Matches(/^\d{12}$/, { message: 'Invalid Aadhaar number' })
  aadhaar?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(10, 10)
  @Matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, { message: 'Invalid PAN number' })
  pan?: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsString()
  @Length(6, 6)
  @Matches(/^[1-9][0-9]{5}$/, { message: 'Invalid PIN code' })
  pincode: string;

  @ApiProperty()
  @IsUUID()
  organizationId: string;
}

export class UpdateAssociateDto extends CreateAssociateDto {}