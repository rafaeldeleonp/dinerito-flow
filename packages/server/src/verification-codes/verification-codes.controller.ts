import {
  CreateVerificationCodeDto,
  SendVerificationCodeDto,
  UpdateVerificationCodeDto,
  VerifyVerificationCodeDto,
} from '@dinerito-flow/shared';
import { Controller, Post, Body, UseInterceptors, ClassSerializerInterceptor, Put } from '@nestjs/common';

import { VerificationCodeEntity } from './entities/verification-code.entity';
import { VerificationCodesService } from './verification-codes.service';

@Controller('verification-codes')
export class VerificationCodesController {
  constructor(private readonly verificationCodesService: VerificationCodesService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createVerificationCodeDto: CreateVerificationCodeDto): Promise<VerificationCodeEntity> {
    const verificationCode = await this.verificationCodesService.create(createVerificationCodeDto);

    return new VerificationCodeEntity(verificationCode);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('verify')
  async verifyCode(@Body() verifyVerificationCodeDto: VerifyVerificationCodeDto): Promise<VerificationCodeEntity> {
    return this.verificationCodesService.verifyCode(verifyVerificationCodeDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('send')
  async send(@Body() sendVerificationCodeDto: SendVerificationCodeDto): Promise<VerificationCodeEntity> {
    const verificationCode = await this.verificationCodesService.send(sendVerificationCodeDto);

    return new VerificationCodeEntity(verificationCode);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put()
  async update(@Body() updateVerificationCodeDto: UpdateVerificationCodeDto): Promise<VerificationCodeEntity> {
    const verificationCode = await this.verificationCodesService.update(updateVerificationCodeDto);

    return new VerificationCodeEntity(verificationCode);
  }
}
