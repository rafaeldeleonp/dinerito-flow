import { randomInt } from 'node:crypto';

import {
  CreateVerificationCodeDto,
  ErrorCode,
  SendVerificationCodeDto,
  UpdateVerificationCodeDto,
  VerificationCode,
  VerifyVerificationCodeDto,
} from '@dinerito-flow/shared';
import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RowDataPacket } from 'mysql2';

import { UsersService } from 'src/users/users.service';

import { VERIFICATION_CODE_EXPIRATION_MINUTES } from './constants';
import { DatabaseService } from '../database/database.service';
import { EmailService } from '../email/email.service';

interface VerificationCodeRow extends VerificationCode, RowDataPacket {}

@Injectable()
export class VerificationCodesService {
  private readonly logger = new Logger(VerificationCodesService.name);
  private tableName: string = 'verification_codes';

  constructor(
    private readonly databaseService: DatabaseService<VerificationCodeRow>,
    private emailService: EmailService,
    private readonly usersService: UsersService
  ) {}

  private generateVerificationCode(): string {
    return randomInt(100000, 999999).toString();
  }

  private updateVerificationCodeExpiration(): { expiresAt: Date } {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + VERIFICATION_CODE_EXPIRATION_MINUTES * 60 * 1000);

    return {
      expiresAt,
    };
  }

  async findOne(email?: string, code?: string): Promise<VerificationCode | null> {
    if (!email && !code)
      throw new BadRequestException({
        errorCode: ErrorCode.INVALID_INPUT,
        message: 'Either email or code must be provided',
      });

    let query = {};

    if (email) query = { ...query, email };
    if (code) query = { ...query, code };

    return this.databaseService.findOne(this.tableName, query);
  }

  async create(createVerificationCodeDto: CreateVerificationCodeDto): Promise<VerificationCode> {
    if (!createVerificationCodeDto.skipFindOne) {
      const verificationCode = await this.findOne(createVerificationCodeDto.email);

      if (verificationCode)
        throw new ConflictException({
          errorCode: ErrorCode.CONFLICTING_VERIFICATION_CODE,
          message: `Verification code with ${createVerificationCodeDto.email} already exists`,
        });
    }

    const dto = {
      email: createVerificationCodeDto.email,
      code: this.generateVerificationCode(),
      ...this.updateVerificationCodeExpiration(),
    };

    return this.databaseService.create(this.tableName, dto as Partial<VerificationCodeRow>);
  }

  async verifyCode(verifyVerificationCodeDto: VerifyVerificationCodeDto): Promise<VerificationCode> {
    const verificationCode = await this.findOne(verifyVerificationCodeDto.email, verifyVerificationCodeDto.code);

    if (!verificationCode)
      throw new NotFoundException({
        errorCode: ErrorCode.INVALID_VERIFICATION_CODE,
        message: 'Invalid verification code',
      });

    const nowUnix = Math.round(Date.now() / 1000);
    const expirationDateUnix = Math.round(new Date(verificationCode.expiresAt).getTime() / 1000);
    const differenceInMinutes = Math.round((nowUnix - expirationDateUnix) / 60);
    const isExpired = differenceInMinutes > VERIFICATION_CODE_EXPIRATION_MINUTES;

    if (isExpired)
      throw new BadRequestException({
        errorCode: ErrorCode.EXPIRED_VERIFICATION_CODE,
        message: 'Verification code expired',
      });

    return verificationCode;
  }

  async update(updateVerificationCodeDto: UpdateVerificationCodeDto): Promise<VerificationCode> {
    const dto = {
      code: this.generateVerificationCode(),
      email: updateVerificationCodeDto.email,
      ...this.updateVerificationCodeExpiration(),
    };

    if (!updateVerificationCodeDto.skipFindOne) {
      const verificationCode = await this.findOne(updateVerificationCodeDto.email);

      if (!verificationCode)
        throw new NotFoundException({
          errorCode: ErrorCode.RESOURCE_NOT_FOUND,
          message: 'Verification code not found',
        });
    }

    const updated = await this.databaseService.update(
      this.tableName,
      updateVerificationCodeDto.id,
      dto as Partial<VerificationCodeRow>
    );

    if (!updated)
      throw new BadRequestException({
        errorCode: ErrorCode.OPERATION_FAILED,
        message: 'Failed to update verification code',
      });

    return {
      ...dto,
      id: updateVerificationCodeDto.id,
    };
  }

  async send(sendVerificationCodeDto: SendVerificationCodeDto): Promise<VerificationCode> {
    const verificationCode = await this.findOne(sendVerificationCodeDto.email);
    const user = await this.usersService.findOne(sendVerificationCodeDto.email);

    if (user)
      throw new ConflictException({ errorCode: ErrorCode.EMAIL_ALREADY_EXISTS, message: 'Email already exists' });

    const newVerificationCode = verificationCode
      ? await this.update({ id: verificationCode.id, ...sendVerificationCodeDto, skipFindOne: true })
      : await this.create({ ...sendVerificationCodeDto, skipFindOne: true });

    if (!newVerificationCode) {
      throw new BadRequestException({
        errorCode: ErrorCode.OPERATION_FAILED,
        message: 'Failed to create verification code',
      });
    }

    await this.emailService.sendVerificationCodeEmail(
      sendVerificationCodeDto.email,
      newVerificationCode.code,
      VERIFICATION_CODE_EXPIRATION_MINUTES
    );

    return newVerificationCode;
  }

  async delete(email: string): Promise<boolean> {
    const verificationCode = await this.findOne(email);

    if (!verificationCode)
      throw new NotFoundException({ errorCode: ErrorCode.RESOURCE_NOT_FOUND, message: 'Verification code not found' });

    return this.databaseService.delete(this.tableName, verificationCode.id);
  }
}
