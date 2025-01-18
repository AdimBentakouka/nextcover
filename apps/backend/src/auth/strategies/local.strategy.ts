import {Strategy} from 'passport-local';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthService} from '../auth.service';
import {ContextIdFactory, ModuleRef} from '@nestjs/core';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private moduleRef: ModuleRef) {
        //@ts-ignore -> usernameField option not found in @types/passport-local
        super({usernameField: 'email', passReqToCallback: true});
    }

    async validate(
        request: Request,
        email: string,
        password: string,
    ): Promise<any> {
        const contextId = ContextIdFactory.getByRequest(request);
        const authService = await this.moduleRef.resolve(
            AuthService,
            contextId,
        );

        const user = await authService.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
