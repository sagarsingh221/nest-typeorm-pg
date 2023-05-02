/**
 * Enum for permission type which will be set ACTIVE as default
 * @readonly
 * @enum {string}
 */
export enum PermissionType {
  /**a person is able to see the resource over this permission has been set */
  Allow = 'Allow',
  /**Restrict means a user will be unable to see the resource over this permission has been set.*/
  Restrict = 'Restrict',
}
