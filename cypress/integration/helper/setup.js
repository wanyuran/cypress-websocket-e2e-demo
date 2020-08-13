import {socketClient} from './socket';
import {
  createCamp,
  createTask,
  teamCreate
} from './websocketRequest';
import USER from '../../user.config';
import {mergeMap, concatMap} from 'rxjs/operators';


class Setup {
  prepareCamp(campName, client, email = USER.trainer.email, password = USER.trainer.password) {
    socketClient.connect(email, password);
    createCamp(campName, client).subscribe({
        next: () => socketClient.disconnect(),
        error: err => console.error('something wrong occurred: ' + err),
        complete: () => console.log('done'),
      },
    );
  }

  prepareTeamWithoutTools(campName, client, stageName, taskName, teamName, traineesId, trainerEmail = USER.trainer.email, trainerPassword = USER.trainer.password, trainerUserId = USER.trainer.userId, traineeEmail = USER.trainee.email, traineePassword = USER.trainee.password, traineeUserId = USER.trainee.userId) {
    let campId;
    let stageId;
    let taskId;

    socketClient.connect(trainerEmail, trainerPassword);
    createCamp(campName, client).pipe(
      concatMap(res => {
        stageId = res.payload.id;
        return createTask(campId, stageId, taskName);
      }),
      concatMap(() => {
        socketClient.disconnect();
        socketClient.connect(traineeEmail, traineePassword);
        return teamCreate(campId, taskId, teamName);
      })
    ).subscribe(res => {
      console.log('res', res);
      socketClient.disconnect();
    });
  };
}


export const setup = new Setup();
