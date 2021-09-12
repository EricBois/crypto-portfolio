import app from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import firebaseConfig from './config';

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    app.firestore().enablePersistence({ synchronizeTabs: true });
    this.auth = app.auth();
    this.db = app.firestore();
  }

  async register(name, email, password) {
    return await this.auth.createUserWithEmailAndPassword(
      email,
      password
    ).then(newUser => {
      // this.auth.currentUser.sendEmailVerification(
      //   {
      //     url: 'https://estimateit.ca/',
      //     handleCodeInApp: true,
      //   }
      // )
      firebase.db.collection('users').doc(newUser.user.uid.toString()).set({
        id: newUser.user.uid.toString(),
        name,
        email: newUser.user.email
      });
    })
  }

  async login(email, password) {
    return await this.auth.signInWithEmailAndPassword(email, password);
  }

  async logout() {
    await this.auth.signOut();
  }

  async resetPassword(email) {
    await this.auth.sendPasswordResetEmail(email);
  }
}

const firebase = new Firebase();
export default firebase;
