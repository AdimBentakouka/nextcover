import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum LibraryType {
    BOOK = 'book',
    MANGA = 'manga',
    MANWA = 'manwa',
    OTHER = 'other',
}

@Entity()
export class Library {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    path: string;

    @Column()
    type: LibraryType;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
