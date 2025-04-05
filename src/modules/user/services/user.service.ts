import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOneOptions, Repository } from 'typeorm';
import { UserCreateDto, UserUpdateDto } from '../dto';

import { User } from '../repository/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly entityManager: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private readonly logger = new Logger(UserService.name);

  async createUser(dto: UserCreateDto) {
    const newUser = this.userRepository.create(dto);
    return this.userRepository.save(newUser);
  }

  async findOneByAny(where: FindOneOptions<User>['where']) {
    return this.userRepository.findOne({ where });
  }
  async findOneByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async isExistingEmail(email: string) {
    return !!(await this.userRepository.findOne({ where: { email } }));
  }
  async isExistingPhone(phone: string) {
    return !!(await this.userRepository.findOne({ where: { phone } }));
  }

  async updateUser(id: string, dto: UserUpdateDto) {
    const result = await this.userRepository.update(id, dto);
    return !!result.affected;
  }
}
