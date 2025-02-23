import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {addDays} from '../../utils/date';

export enum TokenTypes {
    REFRESH_TOKEN = 'refresh_token',
}

const TOKEN_EXPIRATION_DAYS: Record<TokenTypes, number> = {
    [TokenTypes.REFRESH_TOKEN]: 30,
};

const DEFAULT_EXPIRATION_DAYS = 2;

@Entity()
export class Token {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    type: TokenTypes;

    @Column({nullable: true})
    userId?: string;

    @Column({nullable: true})
    expiresAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @BeforeInsert()
    setExpiresAt(): void {
        const now = new Date();

        this.expiresAt = addDays(
            now,
            TOKEN_EXPIRATION_DAYS[this.type] ?? DEFAULT_EXPIRATION_DAYS,
        );
    }
}
