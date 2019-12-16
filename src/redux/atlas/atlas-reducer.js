const INITIAL_STATE = {
    categories: [
        {
            title: 'chest',
            id: 1,
            linkUrl: 'chest',
            exercises: [
                {
                    name: 'bench press',
                    difficulty: 'beginner'
                }
            ]
        },
        {
            title: 'back',
            id: 2,
            linkUrl: 'back',
            exercises: [
                {
                    name: 'pull-ups',
                    difficulty: 'beginner'
                }
            ]
        },
        {
            title: 'legs',
            id: 3,
            linkUrl: 'legs',
            exercises: []
        },
        {
            title: 'shoulders',
            id: 4,
            linkUrl: 'shoulders',
            exercises: []
        },
        {
            title: 'biceps',
            id: 5,
            linkUrl: 'biceps',
            exercises: []
        },
        {
            title: 'triceps',
            id: 6,
            linkUrl: 'triceps',
            exercises: []
        },
        {
            title: 'abs',
            id: 7,
            linkUrl: 'abs',
            exercises: []
        },
        {
            title: 'full body',
            id: 8,
            linkUrl: 'full body',
            exercises: []
        },
        {
            title: 'aerobic',
            id: 9,
            linkUrl: 'aerobic',
            exercises: []
        }
    ]
}

const atlasReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        default:
            return state;
    }
}

export default atlasReducer;