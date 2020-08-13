import {socketClient} from './socket';
import EnvConfig from '../../env.config';
import axios from 'axios';

export const resetPassword = (email, password, newPassword) => {
  let userToken;

  socketClient.getToken(email, password).then(res => {
    userToken = res.token;
    console.log(userToken);

    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'authorization': userToken,
      },
      data: {
        'new': newPassword,
        'old': password,
      },
    };
    return axios(`${EnvConfig.domain}/api/users/me/password`, options);
  }).then(res => {
    console.log(res);
  });
};

