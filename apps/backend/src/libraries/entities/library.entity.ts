import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {MetadataStrategies} from '../../metadataAPI/metadataAPI.service';
import {Ebook} from '../../ebooks/entities/ebook.entity';

export enum LibraryTypes {
    BOOK = 'book',
    MANGA = 'manga',
    MANWA = 'manwa',
    BD = 'bd',
    OTHER = 'other',
}

@Entity()
export class Library {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({unique: true})
    path: string;

    @Column({default: LibraryTypes.OTHER})
    libraryType: LibraryTypes;

    @Column({default: MetadataStrategies.GOOGLE_BOOKS})
    metadataStrategy: MetadataStrategies;

    @OneToMany(() => Ebook, (ebook) => ebook.library, {
        cascade: true,
    })
    ebooks: Ebook[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
