import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.findOne({
      where: { id: user_id },
      relations: ["games"]
    });

    return user ? user : new User();
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return await this.repository.createQueryBuilder('user')    
      .orderBy('user.first_name', 'ASC')
      .getMany();
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return await this.repository.createQueryBuilder("user")
     .where("LOWER(user.first_name) = LOWER(:first_name)", { first_name })
     .orWhere("LOWER(user.last_name) = LOWER(:last_name)", { last_name })
     .getMany();    
  }
}
