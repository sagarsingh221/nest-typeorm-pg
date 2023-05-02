import { BadRequestException, Logger } from '@nestjs/common';
import * as argon2 from 'argon2';
import { Messages, RoleType } from '@commons/constants';
import { Brackets, SelectQueryBuilder } from 'typeorm';
import { ISearchFilter } from '@src/interfaces/types';

export const UtilsService = {
  logError(message: string, error: Error, logger: Logger, data?: any) {
    logger.debug(message);
    logger.error(error);
    logger.log(data);
  },

  trycatch(promise) {
    return promise.then((res) => [null, res]).catch((error) => [error, null]);
  },

  async getSecurePassword(password: string) {
    const promise = argon2.hash(password);
    return await UtilsService.trycatch(promise);
  },

  capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  parseObject(obj: { [key: string]: any }) {
    const keys = Object.keys(obj);
    const values = Object.values(obj);
    const length = keys.length;

    return {
      keys,
      values,
      length,
      status: Boolean(length),
    };
  },

  /** @function
   * returns a sub-object containing only the props specified by the props param
   * @param object: object to extract props from.
   * @param props: props to be filtered.
   */
  filterObjectProps(object: { [key: string]: any }, props: string[]) {
    return Object.keys(object)
      .filter((key) => props.includes(key))
      .reduce((obj, key) => {
        obj[key] = object[key];
        return obj;
      }, {});
  },

  isSuperAdmin(roles: string[]): boolean {
    return this.isUserOfRoleType(roles, RoleType.SUPER_ADMIN);
  },

  isUserAdmin(roles: string[]): boolean {
    return this.isUserOfRoleType(roles, RoleType.USER_ADMIN);
  },

  isUserOfRoleType(roles: string[], roleType: RoleType): boolean {
    return roles.includes(roleType);
  },

  getSubDomainFromHeaders(headers): string {
    const origin = headers['origin']?.split('/')[2]?.split('.');
    if (!origin) {
      return null;
    }
    return origin[0]?.trim().toLowerCase();
  },

  applySearchFilter(
    searchFilter: ISearchFilter,
    queryBuilder: SelectQueryBuilder<any>,
    alias: string,
  ) {
    const { fields, query } = searchFilter;

    if (fields.length > 0) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(`"${alias}"."${fields[0]}" ILIKE '%${query}%'`);

          fields.slice(1).forEach((field) => {
            qb.orWhere(`"${alias}"."${field}" ILIKE '%${query}%'`);
          });
        }),
      );
    }
  },
  formatPhone: (phone: string) => {
    let p = phone; //12345678901
    if (!p) {
      return;
    }
    p = `+${p.substring(0, p.length - 10)}-${p.substring(
      p.length - 10,
      p.length - 7,
    )}-${p.substring(p.length - 7, p.length - 4)}-${p.substring(
      p.length - 4,
      p.length,
    )}`;
    return p;
  },
  cleanPhone(phone: string) {
    // Remove all characters except digits [0-9]
    if (!phone) {
      return;
    }
    const cleaned: string = phone.replace(/[^0-9]/g, '');
    if (cleaned.length < 10) {
      throw new BadRequestException(Messages.USER.INVALID_PHONE);
    }
    return cleaned;
  },
  updatingUuids(oldObjectsUuids: any, newUuids: any) {
    // Converting array objects to array of strings
    let oldUuids: string[] = oldObjectsUuids?.map((object: any) => object.uuid);
    // Uuids which are common in both arrays
    const remainUuids = oldUuids?.filter((oldUuid: string) => {
      if (newUuids.includes(oldUuid)) {
        return oldUuid;
      }
    });

    //  Uuids which are coming as new array
    const appendUuids: string[] = newUuids?.filter((newUuid: string) => {
      if (!oldUuids.includes(newUuid)) {
        return newUuid;
      }
    });

    return [...appendUuids, ...remainUuids];
  },
};
