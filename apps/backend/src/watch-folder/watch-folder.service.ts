import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as chokidar from 'chokidar';
import * as fs from 'fs';
import { LibrariesService } from '../libraries/libraries.service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class WatchFolderService implements OnModuleInit {
    private readonly logger = new Logger(WatchFolderService.name, {
        timestamp: true,
    });

    private watcher: chokidar.FSWatcher;

    private foldersToWatch: string[] = [];

    constructor(private readonly librariesService: LibrariesService) {}

    async onModuleInit() {
        this.logger.log('Initializing watch-folder');

        this.watcher = chokidar.watch([], {
            usePolling: false,
            awaitWriteFinish: true,
            depth: 1,
            ignoreInitial: false,
        });

        await this.setFoldersToWatch();

        let scanComplete = false;

        const files: string[] = [];

        this.watcher
            .on('add', (path) => {
                if (scanComplete) {
                    return this.logger.log(`File ${path} has been added`);
                }

                files.push(path);
            })
            .on('change', (path) => {
                this.logger.log(`File ${path} has been change`);
            })
            .on('unlink', (path) => {
                this.logger.log(`File ${path} has been unlink`);
            })
            .on('ready', () => {
                scanComplete = true;

                this.logger.log('Initial scan complete. Ready for changes.');
            });
    }

    @OnEvent('watch-folder.update')
    async setFoldersToWatch() {
        this.logger.log('updated path to watch');

        const folders = (await this.librariesService.findAll()).map(
            (lib) => lib.path,
        );

        const foldersUnWatched = this.foldersToWatch.filter(
            (v) => !folders.includes(v),
        );

        const foldersNotExists = [];

        folders.map((path) => {
            if (!this.foldersToWatch.includes(path)) {
                //check si dossier existe
                if (!fs.existsSync(path)) {
                    foldersNotExists.push(path);
                    return this.logger.warn(`Folder '${path}' does not exist`);
                }

                this.watcher.add(path);
            }
        });

        this.logger.log(
            `folder watched [\"${folders.filter((v) => !foldersNotExists.includes(v)).join('\",\"')}"]`,
        );

        if (foldersUnWatched.length > 0) {
            foldersUnWatched.map((path) => {
                this.watcher.unwatch(path);
            });

            this.logger.log(
                `folder unwatched [\"${foldersUnWatched.join('\",\"')}"]`,
            );
        }

        this.foldersToWatch = folders;
    }
}
