import {combineLatest, Subject, ReplaySubject} from 'rxjs';
import EnvConfig from '../../env.config';
import io from 'socket.io-client';
import {takeUntil} from 'rxjs/operators';
import axios from 'axios';


class SocketClient {
  message$ = new Subject();
  failure$ = new Subject();
  disconnect$ = new Subject();
  error$ = new Subject();
  send$ = new Subject();
  connect$ = new Subject();
  socket;
  url;
  isConnected = false;
  isConnecting = false;

  constructor(url = EnvConfig.domain) {
    this.url = url;
  }

  getToken(email, password) {
    const data = {
      email: email,
      password: password
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
      url: `${EnvConfig.domain}/path`,
    };

    return axios(options).then(res => {
      const user = {token: res.data.token, userId: res.data.userInfo.id, beesId: res.data.userInfo.beesId}
      console.log(user);
      return user;
    })
  }


  connect = (email, password) => {
    if (this.isConnected || this.isConnecting) {
      return;
    }
    this.isConnecting = true;

    combineLatest([this.send$, this.connect$]).pipe(takeUntil(this.disconnect$)).subscribe(([message, connected]) => {
      console.log('combine-send$:', message);
      console.log('combine-connect$:', connected);
      this.socket.emit('message', message);
    });

    console.log(this.isConnected);
    this.getToken(email, password).then(res => {
      this.socket = io(this.url, {
        query: {token: res.token},
        timeout: 5000,
      });

      this.socket.on('message', message => {
        this.message$.next(message);
      });

      this.socket.on('failure', message => {
        this.failure$.next(message);
      });

      this.socket.on('connect_error', error => {
        this.error$.next(error);
        this.isConnecting = false;
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
        this.isConnecting = false;
        console.log('connect$: connected');
        this.connect$.next(1);
      });

      this.socket.on('disconnect', () => {
        this.disconnect$.next('disconnect!');
        console.log('disconnect');
      });
    });
  };

  disconnect() {
    if (this.socket) {
      this.disconnect$.next(true);
      this.socket.disconnect();
      this.connect$.next(false);
      this.isConnected = false;
      console.log('already disconnect');
    }
  }

  send(message) {
    this.send$.next(message);
  }

}

export const socketClient = new SocketClient(EnvConfig.domain);
