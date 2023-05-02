/**
 * @enum {string}
 * @readonly
 */
export enum UserStatus {
  Active = 'Active' /**active means the the account has been created byy a default active value*/,
  Disabled = 'Disabled' /**Disabled is permanently disabled*/,
  Suspended = 'Suspended' /**suspended is temporarily disabled*/,
  Deactive = 'Deactive' /**A user can deactivate himself */,
  Unverified = 'Unverified' /** New created user whose username/password is not setup yet*/,
}
