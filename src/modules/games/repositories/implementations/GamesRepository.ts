import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return await this.repository.createQueryBuilder("game")
     .where("LOWER(game.title) LIKE LOWER(:param)", { param: `%${param}%` })
     .getMany();  
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query("SELECT COUNT(title) FROM games");
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const game = await this.repository.findOne({
      where: { id },
      relations: ["users"]
    });         
    return game?.users ? game?.users : [];
  }
}
