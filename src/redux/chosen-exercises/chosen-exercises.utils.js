export const addExerciseToChosenExercises = (chosenExercises, exerciseToAdd) => {
    const existingExercise = chosenExercises.find(exercise => exercise.id === exerciseToAdd.id)
    if(existingExercise) {
        return chosenExercises.map(exercise => 
            exercise.id === exerciseToAdd.id ? 
            { ...exercise, sets: exercise.sets + 1 } :
            exercise)
    }

    return [...chosenExercises, { ...exerciseToAdd, sets: 1}];
}

export const removeExerciseSetFromChosenExercises = (chosenExercises, exerciseToRemove) => {
    const existingExercise = chosenExercises.find(exercise => exercise.id === exerciseToRemove.id)
    if(existingExercise.sets === 1) {
        return chosenExercises.filter(exercise => exercise.id !== exerciseToRemove.id)
    }

    return chosenExercises.map(exercise =>
        exercise.id === exerciseToRemove.id ?
        { ...exercise, sets: exercise.sets - 1} :
        exercise);
}