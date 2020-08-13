import {socketClient} from './socket';
import {filter} from 'rxjs/operators';
import {v4 as uuidv4} from 'uuid';

export const createCamp = (campName, client) => {
  const id = uuidv4();

  socketClient.send({
    archived: true,
    forwardOnly: false,
    id: id,
    payload: {
      name: campName,
      startTime: '2020-06-30T00:00:00',
      endTime: '2020-11-30T00:00:00',
      client: client,
    },
    target: '/camps',
    type: 'campCreate',
  });

  return socketClient.message$
    .pipe(
      filter(res => res.type === 'campCreate' && res.commandId === id),
    );
};

export const campLoad = () => {
  const id = uuidv4();
  socketClient.send({
    archived: false,
    forwardOnly: false,
    id: id,
    payload: {},
    target: '/camps',
    type: 'campLoad',
  });

  return socketClient.message$
    .pipe(
      filter(res => res.type === 'campLoad' && res.commandId === id),
    );
};

export const campRemove = (campId) => {
  const id = uuidv4();
  socketClient.send({
    archived: true,
    forwardOnly: false,
    id: id,
    payload: {
      campId: campId,
    },
    target: `/camps/${campId}`,
    type: 'campRemove',
  });

  return socketClient.message$
    .pipe(
      filter(res => res.type === 'campRemove' && res.commandId === id),
    );
};

export const campDelete = (campId) => {
  const id = uuidv4();
  socketClient.send({
    archived: true,
    forwardOnly: false,
    id: id,
    payload: {
      campId: campId,
    },
    target: `/camps/${campId}`,
    type: 'campDelete',
  });

  return socketClient.message$
    .pipe(
      filter(res => res.type === 'campDelete' && res.commandId === id),
    );
};

export const createTask = (campId, stageId, taskName) => {
  const id = uuidv4();
  socketClient.send({
    archived: true,
    forwardOnly: false,
    id: id,
    payload: {
      campId: campId,
      name: taskName,
      sortNumber: 1,
      stageId: stageId,
    },
    target: `/camps/${campId}/stages/${stageId}/tasks`,
    type: 'taskCreate',
  });

  return socketClient.message$
    .pipe(
      filter(res => res.type === 'taskCreate' && res.commandId === id),
    );
};

export const teamCreate = (campId, taskId, teamName) => {
  const id = uuidv4();
  socketClient.send({
    archived: false,
    forwardOnly: false,
    id: id,
    payload: {
      teamName: teamName,
      campId: campId,
      taskId: taskId,
    },
    target: '/teams',
    type: 'teamCreate',
  });

  return socketClient.message$
    .pipe(
      filter(res => res.type === 'teamCreate' && res.commandId === id),
    );
};






