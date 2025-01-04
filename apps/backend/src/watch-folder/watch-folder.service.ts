import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {type ChokidarOptions, type FSWatcher, watch} from 'chokidar';
import {LibrariesService} from '../libraries/libraries.service';
import {EventEmitter2, OnEvent} from '@nestjs/event-emitter';
import {AppEvents} from '../utils/event-constants';
import {checkPathExists} from '../utils/file-utils';
import {messages} from '../utils/messages';
import {EbookService} from '../ebook/ebook.service';

/**
 * Configuration object for Chokidar file watcher.
 */
const WATCHER_OPTIONS: ChokidarOptions = {
    usePolling: false,
    awaitWriteFinish: true,
    depth: 1,
    ignoreInitial: false,
};

/**
 * Service for managing and monitoring specified folders using a file watcher.
 * The WatchFolderService integrates with the LibrariesService to dynamically update
 */
@Injectable()
export class WatchFolderService implements OnModuleInit {
    private readonly logger = new Logger(WatchFolderService.name, {
        timestamp: true,
    });

    private watcher: FSWatcher;
    private watchedFolders: string[] = [];

    constructor(
        private readonly librariesService: LibrariesService,
        private readonly ebookService: EbookService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    /**
     * Initializes the module by setting up a file watcher
     * Emits an event **AppEvents.WATCH_FOLDER_INITIAL_SCAN_COMPLETED** upon completion of the initial scan.
     */
    async onModuleInit() {
        this.watcher = watch([], WATCHER_OPTIONS);

        await this.refreshWatchedFolders();

        this.setupWatchFolder();
    }

    /**
     * Synchronizes the watched folders with the current library paths
     * Triggered by the **AppEvents.LIBRARIES_UPDATED** event.
     * @return {Promise<void>} A promise that resolves once the synchronization process is complete.
     */
    @OnEvent(AppEvents.LIBRARIES_UPDATED)
    async refreshWatchedFolders(): Promise<void> {
        const libraries = await this.librariesService.findAll();

        const targetFolders = libraries.map((library) => library.path);

        const unWatchedFolders = this.watchedFolders.filter(
            (folder) => !targetFolders.includes(folder),
        );

        this.addNewWatchedFolders(targetFolders);

        if (unWatchedFolders.length > 0) {
            this.removeUnWatchedFolders(unWatchedFolders);
        }

        this.watchedFolders = targetFolders;
    }

    /**
     * Sets up a watcher for the designated folder to monitor file additions, changes, and removals.
     *
     * It listens for:
     * - 'add': Logs when a file is added to the folder.
     * - 'change': Logs when a file in the folder is modified.
     * - 'unlink': Logs when a file is removed from the folder.
     * - 'ready': Marks the initial scan as complete and emits a completion event.
     */
    private setupWatchFolder() {
        let initialScanCompleted = false;
        this.watcher
            .on('add', async (filePath) => {
                if (initialScanCompleted) {
                    this.logger.log(
                        messages.logs.watchFolder.fileAdded(filePath),
                    );
                }
                await this.ebookService.create(filePath);
            })
            .on('change', (filePath) => {
                this.logger.log(
                    messages.logs.watchFolder.fileChanged(filePath),
                );

                //Update CountPage and Cover;
            })
            .on('unlink', async (filePath) => {
                this.logger.log(
                    messages.logs.watchFolder.fileRemoved(filePath),
                );

                await this.ebookService.remove(filePath);
            })
            .on('ready', () => {
                initialScanCompleted = true;
                this.logger.log(messages.success.watchFolder.scanCompleted());

                this.eventEmitter.emit(
                    AppEvents.WATCH_FOLDER_INITIAL_SCAN_COMPLETED,
                );
            });
    }

    /**
     * Adds new watched folders to the file watcher if the paths exist and are not already being watched.
     *
     * @param {string[]} targetPaths - An array of folder paths to be added to the watcher.
     * @return {void}
     */
    private addNewWatchedFolders(targetPaths: string[]): void {
        const missingFolders: string[] = [];

        targetPaths.forEach((path) => {
            if (this.watchedFolders.includes(path)) return;

            if (!checkPathExists(path)) {
                missingFolders.push(path);
                return this.logger.warn(messages.errors.path.notExist(path));
            }

            this.watcher.add(path);
        });

        this.logger.log(
            messages.logs.watchFolder.watched(
                targetPaths
                    .filter((v) => !missingFolders.includes(v))
                    .join('","'),
            ),
        );
    }

    /**
     * Removes the specified folders from being watched.
     *
     * @param {string[]} unWatchedFolders - An array of folder paths to be removed from watch.
     * @return {void}.
     */
    private removeUnWatchedFolders(unWatchedFolders: string[]): void {
        unWatchedFolders.forEach((path) => this.watcher.unwatch(path));

        this.logger.log(
            messages.logs.watchFolder.unwatched(unWatchedFolders.join('","')),
        );
    }
}
