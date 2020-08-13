import {socketClient} from './socket';
import {campDelete, campLoad, campRemove} from './websocketRequest';
import {mergeMap, tap} from 'rxjs/operators';
import USER from '../../user.config';


class TearDown {
  clearCreatedActiveCamps(email = USER.trainer.email, password = USER.trainer.password, userId = USER.trainer.userId) {
    let campsArray;
    let campsCreatedArray = [];
    socketClient.connect(email, password);
    campLoad().subscribe(res => {
      console.log(res);
      campsArray = res.payload;

      if (campsArray.length === 0) {
        console.log('No Camps!');
        return;
      }

      campsArray.forEach(camp => {
        if (camp.trainers[0].userId === userId && camp.trainers[0].role === 'CAMP_OWNER' && camp.status === 'ACTIVE') {
          campsCreatedArray.push(camp.id);
        }
      });

      if (campsCreatedArray.length === 0) {
        console.log('No Active Created Camps!');
        return;
      }

      console.log(campsCreatedArray);
      campsCreatedArray.forEach(campId => {
        campRemove(campId).pipe(
          mergeMap(() => {
            return campDelete(campId);
          }),
        ).subscribe(res => {
          console.log('清理环境', res);
          socketClient.disconnect();
        });
      });
    });
  }

}


export const tearDown = new TearDown();

