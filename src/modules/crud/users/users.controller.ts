import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  SwaggerAuthorizedPostRequest,
  SwaggerAuthorizedGetRequest,
  SwaggerAuthorizedPatchRequest,
  SwaggerAuthorizedDeleteRequest,
  OwnerOrRoles,
} from 'decorators';
import { Role } from 'constants/index';
import { fakeUserAdmin, fakeUser } from 'tests';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/';

@ApiTags('Users CRUD')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @OwnerOrRoles(Role.Admin)
  @SwaggerAuthorizedPostRequest(fakeUser.dto)
  async create(@Body() createUserDto: CreateUserDto) {
    if (await this.usersService.findOneByEmail(createUserDto.email)) {
      throw new HttpException('email is already using', HttpStatus.BAD_REQUEST);
    }

    return this.usersService.create(createUserDto);
  }

  @Get()
  @OwnerOrRoles(Role.Admin)
  @SwaggerAuthorizedGetRequest([fakeUserAdmin.dto, fakeUser.dto])
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => user.dto);
  }

  @Get(':id')
  @OwnerOrRoles(Role.Admin)
  @SwaggerAuthorizedGetRequest(fakeUser.dto)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new HttpException(`User ${id} is not found`, HttpStatus.NOT_FOUND);
    }

    return user.dto;
  }

  @Patch(':id')
  @OwnerOrRoles(Role.Admin)
  @SwaggerAuthorizedPatchRequest(fakeUser.dto)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(id, updateUserDto);

    if (!user) {
      throw new HttpException(`User ${id} is not found`, HttpStatus.NOT_FOUND);
    }

    return user.dto;
  }

  @Delete(':id')
  @OwnerOrRoles(Role.Admin)
  @SwaggerAuthorizedDeleteRequest()
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
