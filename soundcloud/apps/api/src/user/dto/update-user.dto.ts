import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  name?: string;
  email?: string | undefined;
  bio?: string;
  location?: string;
  websiteProfiles?: Array<{
    url: string;
    websiteTypeId: string;
  }> | string;
}
