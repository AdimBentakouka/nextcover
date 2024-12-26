import { Test, TestingModule } from '@nestjs/testing';
import { WatchFolderService } from './watch-folder.service';

describe('WatchFolderService', () => {
    let service: WatchFolderService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [WatchFolderService],
        }).compile();

        service = module.get<WatchFolderService>(WatchFolderService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
