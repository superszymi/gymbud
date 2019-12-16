const INITIAL_STATE = {
    categories: [
        {
            title: 'chest',
            id: 1,
            linkUrl: 'chest',
            exercises: [
                {
                    id: 1,
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
                    id: 1,
                    name: 'pull-ups',
                    difficulty: 'beginner'
                }
            ]
        },
        {
            title: 'legs',
            id: 3,
            linkUrl: 'legs'
        },
        {
            title: 'shoulders',
            id: 4,
            linkUrl: 'shoulders'
        },
        {
            title: 'biceps',
            id: 5,
            linkUrl: 'biceps'
        },
        {
            title: 'triceps',
            id: 6,
            linkUrl: 'triceps'
        },
        {
            title: 'abs',
            id: 7,
            linkUrl: 'abs'
        },
        {
            title: 'full body',
            id: 8,
            linkUrl: 'full body'
        },
        {
            title: 'aerobic',
            id: 9,
            linkUrl: 'aerobic'
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