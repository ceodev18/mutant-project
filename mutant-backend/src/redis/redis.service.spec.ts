import { RedisService } from './redis.service';

describe('RedisService', () => {
    let service: RedisService;

    beforeEach(() => {
        service = new RedisService();
        // @ts-ignore
        service.client = {
            get: jest.fn().mockResolvedValue(null),
            set: jest.fn().mockResolvedValue('OK'),
        };
    });

    it('should get from Redis', async () => {
        await service.get('test');
        expect((service as any).client.get).toHaveBeenCalledWith('test');
    });

    it('should set in Redis', async () => {
        await service.set('key', 'value', 10);
        expect((service as any).client.set).toHaveBeenCalledWith('key', 'value', { EX: 10 });
    });
});
