import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { UserEntity } from '@modules/user/entities';
import { UtilsService } from '@src/utils/services';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  listenTo() {
    return UserEntity;
  }

  async beforeInsert(event: InsertEvent<UserEntity>): Promise<void> {
    if (event?.entity?.email) {
      event.entity.email = event.entity.email.toLowerCase();
      event.entity.firstName = UtilsService.capitalize(event.entity.firstName);
      event.entity.lastName = UtilsService.capitalize(event.entity.lastName);
      const [err, hashedPassword] = await UtilsService.getSecurePassword(
        event.entity.password,
      );
      event.entity.password = hashedPassword;
    }
  }
}
