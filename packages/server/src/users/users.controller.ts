import { ChangePasswordDto, CreateUserDto, ErrorCode, UpdateUserDto, User } from '@dinerito-flow/shared';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserEntity } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req: ExpressRequest): Promise<UserEntity | null> {
    if (!req.user) {
      throw new UnauthorizedException({ errorCode: ErrorCode.UNAUTHORIZED_ACCESS });
    }

    const user = await this.userService.findOne((req.user as User).email);

    if (!user) {
      throw new NotFoundException({ errorCode: ErrorCode.RESOURCE_NOT_FOUND });
    }

    return new UserEntity(user);
  }

  @Get('exists')
  async exists(@Query('email') email: string): Promise<boolean> {
    if (!email) throw new BadRequestException({ errorCode: ErrorCode.INVALID_INPUT });

    const user = await this.userService.findOne(email);

    return !!user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.userService.create(createUserDto);
    return new UserEntity(user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Request() req: ExpressRequest, @Body() updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const loggedUser = req.user;

    if (!loggedUser) throw new UnauthorizedException({ errorCode: ErrorCode.UNAUTHORIZED_ACCESS });

    const updatedUser = await this.userService.update((loggedUser as User).id, updateUserDto);

    return new UserEntity(updatedUser!);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(
    @Request() req: ExpressRequest,
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<UserEntity> {
    const loggedUser = req.user;

    if (!loggedUser) throw new UnauthorizedException({ errorCode: ErrorCode.UNAUTHORIZED_ACCESS });

    const updatedUser = await this.userService.changePassword((loggedUser as User).id, changePasswordDto);

    return new UserEntity(updatedUser!);
  }
}
