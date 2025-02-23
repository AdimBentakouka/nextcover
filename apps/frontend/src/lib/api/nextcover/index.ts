import {NextCoverApi} from '@/lib/api/nextcover/api';

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

const nextCoverInstance = global as unknown as {nextCover: NextCoverApi};

const nextCover = nextCoverInstance.nextCover || new NextCoverApi(baseUrl);

if (process.env.NODE_ENV !== 'production') nextCoverInstance.nextCover = nextCover;

export default nextCover;
