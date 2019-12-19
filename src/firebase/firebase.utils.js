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

  export const updateDocumentInCollection = async (collectionKey, objectToUpdate) => {
    const collectionRef = firestore.collection(collectionKey);
    const docRef = collectionRef.doc(objectToUpdate.id);

    try {
      await docRef.set(objectToUpdate);
    } catch(error) {
      console.log(error);
    }
  }

  export const addDocumentToCollection = async (collectionKey, objectsToAdd) => {
        const collectionRef = firestore.collection(collectionKey);

        const newDocRef = collectionRef.doc();

        try {
            await newDocRef.set(objectsToAdd);
        } catch(error) {
            console.log(error);
        }
  }

  export const addCollectionAndDocuments = (collectionKey, objects) => {
    const collectionRef = firestore.collection(collectionKey);
    const batch = firestore.batch();

    objects.forEach(obj => {
      const newDocRef = collectionRef.doc();
      batch.set(newDocRef, obj);
    });

    batch.commit();
  }

  export const convertAtlasSnapshotToMap = (atlas) => {
    const transformedAtlas = atlas.docs.map(doc => {
        const { title, exercises } = doc.data();
        return {
            routeName: encodeURI(title.toLowerCase()),
            id: doc.id,
            title,
            exercises
        };
    });
    return transformedAtlas.reduce((accumulator, category) => {
      accumulator[category.title.toLowerCase()] = category;
      return accumulator;
    }, {});
  }

  export const convertTemplatesSnapshotToMap = (templates) => {
    const transformedTemplates = templates.docs.map(doc => {
      const { workoutName, exercises } = doc.data();
      return {
        id: doc.id,
        workoutName,
        exercises
      };
    });
    return transformedTemplates.reduce((accumulator, template) => {
      accumulator[template.id] = template;
      return accumulator;
    }, {});
  }

  export const convertWorkoutsSnapshotToMap = workouts => {
    const transformedWorkouts = workouts.docs.map(doc => {
      const { workoutName, date, time, exercises, user } = doc.data();
      return {
        id: doc.id,
        workoutName: workoutName,
        date: date,
        time: time,
        exercises: exercises,
        user: user
      };
    });
    return transformedWorkouts.reduce((accumulator, workout) => {
      accumulator[workout.id] = workout;
      return accumulator;
    }, {});
  }

  firebase.initializeApp(config);

  export const auth = firebase.auth();

  export const firestore = firebase.firestore();

  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  export const signInWithGoogle = () => auth.signInWithPopup(provider);

  export default firebase;