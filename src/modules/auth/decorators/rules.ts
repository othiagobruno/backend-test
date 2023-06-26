import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC = 'isAuth';
export const IsPublic = () => SetMetadata(IS_PUBLIC, true);
