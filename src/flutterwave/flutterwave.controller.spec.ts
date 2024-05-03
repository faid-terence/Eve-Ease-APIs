import { Test, TestingModule } from '@nestjs/testing';
import { FlutterwaveController } from './flutterwave.controller';

describe('FlutterwaveController', () => {
  let controller: FlutterwaveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlutterwaveController],
    }).compile();

    controller = module.get<FlutterwaveController>(FlutterwaveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
