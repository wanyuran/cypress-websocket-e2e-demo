import {getEnv} from './env.config';

/**
 * 各个角色map：
 * trainer 讲师 -> master中讲师同时也可以是学员
 * trainee 学生
 */

const USER_MAP = {
  qa: {
    trainer: {
      email: 'XXXX@163.com',
      password: 'XXXXX',
      userName: 'teacher_1',
      userId: 'e2efc4bb-ff3d-41d9-99cd-XXXXXXXXXXXX'
    },
    secondTrainer: {
      email: 'XXXX@163.com',
      password: 'XXXXXX',
      userName: 'slowyyyyy_teacheXr',
      userId: '003df92b-d3c6-43d1-9ea4-XXXXXXXXXXXX'

    },
    trainee: {
      email: 'XXXXXX@163.com',
      password: 'XXXXXXXX',
      userName: 'student_1',
      userId: 'b8db6f24-2c5e-4a26-9c4d-XXXXXXXXXXXX'
    },
    secondTrainee: {
      email: 'XXXXXX@163.com',
      password: 'XXXXXXXXXX',
      userName: 'student_3',
      userId: '163247b7-062c-4125-b590-XXXXXXXXXXXX'
    },
  },

  uat: {
    trainer: {
      email: 'XXXX@163.com',
      password: 'XXXXX',
      userName: 'teacher_1',
      userId: 'e2efc4bb-ff3d-41d9-99cd-XXXXXXXXXXXX'
    },
    secondTrainer: {
      email: 'XXXX@163.com',
      password: 'XXXXXX',
      userName: 'slowyyyyy_teacheXr',
      userId: '003df92b-d3c6-43d1-9ea4-XXXXXXXXXXXX'

    },
    trainee: {
      email: 'XXXXXX@163.com',
      password: 'XXXXXXXX',
      userName: 'student_1',
      userId: 'b8db6f24-2c5e-4a26-9c4d-XXXXXXXXXXXX'
    },
    secondTrainee: {
      email: 'XXXXXX@163.com',
      password: 'XXXXXXXXXX',
      userName: 'student_3',
      userId: '163247b7-062c-4125-b590-XXXXXXXXXXXX'
    },
  },
};

const USER = USER_MAP[getEnv().toLowerCase()];
export default USER;
