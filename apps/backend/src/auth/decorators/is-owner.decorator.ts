import {SetMetadata} from '@nestjs/common';

export const IS_OWNER_KEY = 'isOwner';
/**
 * Protects routes that are reserved for owner.
 */
export const IsOwner = () => SetMetadata(IS_OWNER_KEY, true);
