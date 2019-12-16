import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyDflCBgvAKyAFLSIkRLk5qsSnf03YKtMO4",
    authDomain: "gymbud-f0070.firebaseapp.com",
    databaseURL: "https://gymbud-f0070.firebaseio.com",
    projectId: "gymbud-f0070",
    storageBucket: "gymbud-f0070.appspot.com",
    messagingSenderId: "930682556594",
    appId: "1:930682556594:web:cdc94bffa9532b43d579ab"
  };

  export const createUserProfileDocument = async (userAuth, otherData) => {
    if(!userAuth) return;

    const userRef = firestore.doc(`users/${userAuth.uid}`);

    const userSnapshot = await userRef.get();

    if(!userSnapshot.exists) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();
        
        try {
            await userRef.set({ displayName, email, createdAt, ...otherData});
        } catch(error) {
            console.log(error);
        }
    }
    return userRef;
  }

  firebase.initializeApp(config);

  export const auth = firebase.auth();

  export const firestore = firebase.firestore();

  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  export const signInWithGoogle = () => auth.signInWithPopup(provider);

  export default firebase;