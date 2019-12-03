export abstract class AppEvent {

    public abstract readonly type: string;

}

export class UserSignIn extends AppEvent {

    public readonly type = 'signin';

}

export class UserSignOut extends AppEvent {

    public readonly type = 'signout';

}