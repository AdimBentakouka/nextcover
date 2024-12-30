import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {Library} from '../../libraries/entities/library.entity';

@Entity()
export class Ebook {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Library, (library) => library.ebooks, {
        onDelete: 'CASCADE',
    })
    library: Library;

    @Column({unique: true})
    filepath: string;

    @Column()
    directoryName: string;

    @Column()
    title: string;

    @Column()
    thumbnail: string;

    @Column({nullable: true})
    description?: string;

    @Column({nullable: true})
    authors?: string;

    @Column({nullable: true})
    tags?: string;

    @Column({nullable: true})
    isbn?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({default: 0})
    score: number;
}
