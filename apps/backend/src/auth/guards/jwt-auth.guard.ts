import {type ExecutionContext, Injectable} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {IS_PUBLIC_KEY} from '../decorators/is-public.decorator';
import {Reflector} from '@nestjs/core';
import {IS_OWNER_KEY} from '../decorators/is-owner.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic) {
            return true;
        }

        const isAuthenticate = await super.canActivate(context);

        if (!isAuthenticate) {
            return false;
        }

        const isOwnerRoute = this.reflector.getAllAndOverride<boolean>(
            IS_OWNER_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isOwnerRoute) {
            const request = context.switchToHttp().getRequest();
            const user = request.user;

            console.log(user);

            return user.isOwner;
        }

        return true;
    }
}
