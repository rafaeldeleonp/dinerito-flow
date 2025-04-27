import { ChangePasswordDto, CreateUserDto, ErrorCode, UpdateUserDto, User } from '@dinerito-flow/shared';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { RowDataPacket } from 'mysql2';

import { DatabaseService } from '../database/database.service';

interface UserRow extends User, RowDataPacket {}

@Injectable()
export class UsersService {
  private tableName: string = 'users';

  constructor(
    private readonly databaseService: DatabaseService<UserRow>,
    private configService: ConfigService
  ) {}

  private async hashPassword(password: string): Promise<string> {
    if (!password) {
      throw new BadRequestException({ errorCode: ErrorCode.INVALID_INPUT });
    }

    const saltRounds = parseInt(this.configService.get<string>('BCRYPT_SALT_ROUNDS', '10'), 10);
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  }

  async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.databaseService.findById(this.tableName, id);

    if (!user) throw new NotFoundException({ errorCode: ErrorCode.RESOURCE_NOT_FOUND });

    return user;
  }

  async findOne(email?: string): Promise<User | null> {
    return this.databaseService.findOne(this.tableName, { email });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findOne(createUserDto.email);

    if (existingUser) throw new ConflictException({ errorCode: ErrorCode.USER_ALREADY_EXISTS });

    const hashedPassword = await this.hashPassword(createUserDto.password);

    return this.databaseService.create(this.tableName, {
      ...createUserDto,
      password: hashedPassword,
    } as Partial<UserRow>);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    const user = await this.findById(id);

    if (!user) throw new NotFoundException({ errorCode: ErrorCode.RESOURCE_NOT_FOUND });

    const updatedUser = await this.databaseService.update(this.tableName, id, updateUserDto as Partial<UserRow>);

    if (!updatedUser) throw new BadRequestException({ errorCode: ErrorCode.OPERATION_FAILED });

    return {
      ...user,
      ...updateUserDto,
    };
  }

  async changePassword(id: number, changePasswordDto: ChangePasswordDto): Promise<User | null> {
    const user = await this.findById(id);

    if (changePasswordDto.currentPassword === changePasswordDto.newPassword)
      throw new BadRequestException({
        errorCode: ErrorCode.NEW_PASSWORD_MUST_BE_DIFFERENT,
        message: 'New password must be different from current password',
      });

    const isPasswordValid = await this.verifyPassword(changePasswordDto.currentPassword, user!.password);

    if (!isPasswordValid)
      throw new BadRequestException({
        errorCode: ErrorCode.INVALID_PASSWORD,
        message: 'Current password is incorrect',
      });

    const hashedPassword = await this.hashPassword(changePasswordDto.newPassword);

    const updatedUser = await this.databaseService.update(this.tableName, id, {
      password: hashedPassword,
    } as Partial<UserRow>);

    if (!updatedUser) throw new BadRequestException({ errorCode: ErrorCode.OPERATION_FAILED });

    return {
      ...user,
      password: hashedPassword,
    } as User;
  }
}
