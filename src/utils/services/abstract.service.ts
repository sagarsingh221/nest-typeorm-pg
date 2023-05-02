import { AbstractEntity } from '@commons/entities';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ISearchFilter, OrderBy } from '@src/interfaces/types';
import { UtilsService } from '@utils/services/utils.service';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Cache, CacheContainer } from 'node-ts-cache';
import { MemoryStorage } from 'node-ts-cache-storage-memory';
import {
  Brackets,
  DeleteResult,
  In,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
const cache: CacheContainer = new CacheContainer(new MemoryStorage());

/**
 * Generic AbstractService
 * It contains all the basic methods and initializations required by the service
 * Every Module's service should extend this service
 */
@Injectable()
export abstract class AbstractService<T extends AbstractEntity> {
  protected readonly logger: Logger;

  /**
   * @param name alias of the entity required for the queryBuilder
   * @param repository of its entity
   * @param searchFields on which filter to be applied while searching
   * @protected
   */
  protected constructor(
    protected name: string,
    protected repository: Repository<T>,
    protected searchFields?: string[],
  ) {
    this.logger = new Logger(name);
  }

  /**
   * Returns the id of entity
   * @param uuid of the entity to find
   */
  @Cache(cache, { ttl: 3600 })
  async getId(uuid: string): Promise<number> {
    const entity: T = await this.getOneByUuid(uuid, [], [`${this.name}.id`]);
    return entity.id;
  }

  /**
   * Returns the uuid of entity
   * @param id of the entity to find
   */
  @Cache(cache, { ttl: 3600 })
  async getUuid(id: number): Promise<string> {
    const entity: T = await this.getOneByField(
      'id',
      id,
      [],
      [`${this.name}.uuid`],
    );
    return entity.uuid;
  }

  /**
   * Finds one entity by uuid by joining relations and projecting 'select' values
   * @param uuid of the entity to find
   * @param relations to join with entity
   * @param select projections to be applied to entity
   */
  async getOneByUuid(
    uuid: string,
    relations: any[] = [],
    select: string[] = null,
    orderBy: OrderBy[] = null,
  ) {
    const object = await this.getOneByField(
      'uuid',
      uuid,
      relations,
      select,
      orderBy,
    );
    if (!object) {
      throw new BadRequestException(`Invalid ${this.name} Uuid`);
    }
    return object;
  }

  /**
   * Finds one entity by field by joining relations and projecting 'select' values
   * @param fieldName on which to find the entity
   * @param fieldValue the value of fieldName on which to find the entity
   * @param relations to join with entity
   * @param select projections to be applied to entity
   */
  getOneByField(
    fieldName: string,
    fieldValue: any,
    relations: any[] = [],
    select: string[] = null,
    orderBy: OrderBy[] = null,
  ): Promise<T> {
    return this.getByField(
      fieldName,
      fieldValue,
      relations,
      select,
      orderBy,
    ).getOne();
  }

  /**
   * Finds all entities by field by joining relations and projecting 'select'
   * values, pagination is applied if options {IPaginationOptions} is supplied,
   * otherwise all results are returned
   * @overload-1 returns results in Promise<Pagination<T>> format (with pagination)
   * @overload-2 returns results in Promise<T[]> format (without pagination)
   * @param fieldName on which to find the entities
   * @param fieldValue the value of fieldName on which to find the entities
   * @param relations to join with entities
   * @param select projections to be applied to entities
   * @param searchFilter to be applied to query to filter results
   * @param paginationOptions {IPaginationOptions} optional, used when pagination is required
   */
  getAllByField(
    fieldName: string,
    fieldValue: any,
    relations?: string[],
    select?: string[],
    searchFilter?: ISearchFilter,
    paginationOptions?: IPaginationOptions,
  ): Promise<Pagination<T>>;
  getAllByField(
    fieldName: string,
    fieldValue: any,
    relations?: string[],
    select?: string[],
    searchFilter?: ISearchFilter,
  ): Promise<T[]>;
  getAllByField(
    fieldName: string,
    fieldValue: any,
    relations?: string[],
    select?: string[],
    searchFilter?: ISearchFilter,
    paginationOptions?: IPaginationOptions,
  ): Promise<any> {
    const queryBuilder: SelectQueryBuilder<T> = this.getByField(
      fieldName,
      fieldValue,
      relations,
      select,
    );

    if (searchFilter && searchFilter.query) {
      UtilsService.applySearchFilter(searchFilter, queryBuilder, this.name);
    }

    return paginationOptions
      ? paginate<T>(queryBuilder, paginationOptions)
      : queryBuilder.getMany();
  }

  /**
   * Gets list of all entities which are either global or belong to an account
   * @param options paginationOptions
   * @param selectFields listSelectFieldsDto
   * @param relations to left join with
   * @param query search parameter
   * @param andWhere any extra `where` filters to be applied
   */
  async getAllWithoutAccount(
    options: IPaginationOptions,
    selectFields: string[],
    relations?: any[],
    query?: string,
    andWhere?: string,
    orderBy?: any[],
  ): Promise<Pagination<T>> {
    const queryBuilder = this.repository
      .createQueryBuilder(this.name)
      .select(selectFields);

    orderBy &&
      orderBy.forEach((order) => {
        queryBuilder.orderBy(order?.key, order?.value);
      });

    relations &&
      relations.forEach((relation) => {
        if (typeof relation === 'string') {
          return queryBuilder.leftJoinAndSelect(
            relation,
            relation.split('.').pop(),
          );
        } else {
          return queryBuilder.leftJoinAndSelect(
            relation.relation,
            relation.alias,
          );
        }
      });

    andWhere && queryBuilder.andWhere(andWhere);

    if (query) {
      UtilsService.applySearchFilter(
        { query, fields: this.searchFields },
        queryBuilder,
        this.name,
      );
    }

    return paginate<T>(queryBuilder, options);
  }

  /**
   * Gets list of all entities which are either global or belong to an account
   * @param accountId entities belonging to an account
   * @param options paginationOptions
   * @param selectFields listSelectFieldsDto
   * @param relations to left join with
   * @param query search parameter
   * @param andWhere any extra `where` filters to be applied
   */
  async getAllOfAccount(
    accountId: number,
    options: IPaginationOptions,
    selectFields: string[],
    relations?: any[],
    query?: string,
    andWhere?: string,
  ): Promise<Pagination<T>> {
    const queryBuilder = this.repository
      .createQueryBuilder(this.name)
      .select(selectFields);

    relations &&
      relations.forEach((relation) => {
        if (typeof relation === 'string') {
          return queryBuilder.leftJoinAndSelect(
            relation,
            relation.split('.').pop(),
          );
        } else {
          return queryBuilder.leftJoinAndSelect(
            relation.relation,
            relation.alias,
          );
        }
      });

    queryBuilder.where(
      new Brackets((qb) => {
        qb.where(`${this.name}.accountId=:accountId`, { accountId });
        qb.orWhere(`${this.name}.accountId is NULL`);
      }),
    );

    andWhere && queryBuilder.andWhere(andWhere);

    if (query) {
      UtilsService.applySearchFilter(
        { query, fields: this.searchFields },
        queryBuilder,
        this.name,
      );
    }

    return paginate<T>(queryBuilder, options);
  }

  /**
   * Gets all the entities whose uuids are supplied as parameter
   * @param uuids list of uuid to fetch the entities
   */
  async getAllByUuids(uuids: string[]): Promise<T[]> {
    const entities: T[] = await this.repository.find({
      where: { uuid: In(uuids) },
    });

    const invalidUuids: string[] = [];
    uuids.forEach((uuid) => {
      if (!entities.some((entity) => entity.uuid === uuid)) {
        invalidUuids.push(uuid);
      }
    });

    if (invalidUuids.length) {
      throw new ConflictException(`Invalid Uuids: ${invalidUuids}`);
    }

    return entities;
  }

  /**
   * Gets all the entities whose uuids are supplied as parameter
   * @param uuids list of uuid to fetch the entities without filtering
   */
  async getAllFilteredUuids(uuids: string[]): Promise<T[]> {
    const entities: T[] = await this.repository.find({
      where: { uuid: In(uuids) },
    });

    return entities;
  }

  async getAllFilteredByTypeIds(ids: string[]): Promise<T[]> {
    const entities: T[] = await this.repository.find({
      where: { typeId: In(ids) },
    });

    return entities;
  }

  /**
   * Returns a queryBuilder ready to find the entity/entities based on field,
   * and applying the joins and projections
   * @param fieldName on which to find the entity/entities
   * @param fieldValue he value of fieldName on which to find the entity/entities
   * @param relations to join with entities
   * @param select projections to be applied to entities
   * @private
   */
  private getByField(
    fieldName: string,
    fieldValue: any,
    relations?: any[],
    select?: string[],
    orderBy?: OrderBy[],
  ): SelectQueryBuilder<T> {
    const queryBuilder = this.repository.createQueryBuilder(this.name);

    relations &&
      relations.forEach((relation) => {
        if (typeof relation === 'string') {
          return queryBuilder.leftJoinAndSelect(
            relation,
            relation.split('.').pop(),
          );
        } else {
          return queryBuilder.leftJoinAndSelect(
            relation.relation,
            relation.alias,
          );
        }
      });

    select && queryBuilder.select(select);

    let where = `${this.name}.${fieldName}=:${fieldName}`;
    if (!fieldValue) {
      where = `${this.name}.${fieldName} is NULL`;
    }
    orderBy &&
      orderBy.forEach((order) => {
        queryBuilder.orderBy(order.field, order.type);
      });
    return queryBuilder.where(where, { [fieldName]: fieldValue });
  }

  /**
   * Deletes a entity specified by the uuid
   * @param uuid of the entity to be deleted
   * @param accountId entity belonging to account
   */
  async deleteOneByUuid(
    uuid: string,
    accountId: number,
  ): Promise<DeleteResult> {
    const deleted: DeleteResult = await this.deleteAllByFields({
      uuid,
      accountId,
    });
    if (deleted.affected !== 1) {
      throw new BadRequestException(
        `${this.name} with this uuid does not exist.`,
      );
    }
    return deleted;
  }

  /**
   * Deletes entity/entities specified by the filter conditions
   * @param fields on which to find entity/entities
   */
  deleteAllByFields(fields): Promise<DeleteResult> {
    return this.repository.delete(fields);
  }
}
