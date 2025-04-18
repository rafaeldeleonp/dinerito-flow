import { Test, TestingModule } from '@nestjs/testing';

import { VerificationCodesController } from './verification-codes.controller';
import { VerificationCodesService } from './verification-codes.service';

describe('VerificationCodesController', () => {
  let controller: VerificationCodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerificationCodesController],
      providers: [VerificationCodesService],
    }).compile();

    controller = module.get<VerificationCodesController>(VerificationCodesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
