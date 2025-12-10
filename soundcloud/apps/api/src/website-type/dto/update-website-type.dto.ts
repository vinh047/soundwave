import { PartialType } from '@nestjs/mapped-types';
import { CreateWebsiteTypeDto } from './create-website-type.dto';

export class UpdateWebsiteTypeDto extends PartialType(CreateWebsiteTypeDto) {}
