import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

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

    @Column({nullable: true})
    lastUsedAt: Date;

    @BeforeInsert()
    setExpirationDate() {
        const now = new Date();
        if (this.type !== TokenTypes.REFRESH_TOKEN) {
            this.expiresAt = new Date(now.setDate(now.getDate() + 2));
        }
    }
}

export enum TokenTypes {
    REFRESH_TOKEN = 'refresh_token',
    SIGN_UP = 'sign_up',
}
