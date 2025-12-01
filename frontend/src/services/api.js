// Use environment variable for API URL in production, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : 'http://localhost:3001/api';

export const api = {
    // 音标相关
    phonetics: {
        getAll: async () => fetch(`${API_BASE_URL}/phonetics`).then(res => res.json()),
        getById: async (id) => fetch(`${API_BASE_URL}/phonetics/${id}`).then(res => res.json()),
        getByType: async (type) => fetch(`${API_BASE_URL}/phonetics/type/${type}`).then(res => res.json()),
    },

    // 课程相关
    lessons: {
        getAll: async () => fetch(`${API_BASE_URL}/lessons`).then(res => res.json()),
        getById: async (id) => fetch(`${API_BASE_URL}/lessons/${id}`).then(res => res.json()),
        getPhonetics: async (id) => fetch(`${API_BASE_URL}/lessons/${id}/phonetics`).then(res => res.json()),
        getConfusionPairs: async (id) => fetch(`${API_BASE_URL}/lessons/${id}/confusion-pairs`).then(res => res.json()),
    },

    // 练习题相关
    exercises: {
        getByLesson: async (lessonId) => fetch(`${API_BASE_URL}/exercises/lesson/${lessonId}`).then(res => res.json()),
        submit: async (data) => fetch(`${API_BASE_URL}/exercises/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => res.json()),
        submitBatch: async (data) => fetch(`${API_BASE_URL}/exercises/submit-batch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => res.json()),
    },

    // 进度相关
    progress: {
        getStudent: async (studentId) => fetch(`${API_BASE_URL}/progress/${studentId}`).then(res => res.json()),
        getLesson: async (studentId, lessonId) => fetch(`${API_BASE_URL}/progress/${studentId}/lesson/${lessonId}`).then(res => res.json()),
        update: async (studentId, data) => fetch(`${API_BASE_URL}/progress/${studentId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => res.json()),
    }
};
