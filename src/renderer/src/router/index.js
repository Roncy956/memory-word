import { createRouter, createWebHashHistory } from 'vue-router'
import MainFrame from '../views/MainFrame.vue'
import WordGlossary from '../views/wordgloss/WordGlossary.vue'
import Homepage from '../views/Homepage.vue'
import MemoryMain from '../views/memword/MemoryMain.vue'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: MainFrame,
            children: [
                {
                    path: 'homepage',
                    component: Homepage
                },
                {
                    path: 'glossary',
                    component: WordGlossary
                },
                {
                    path: 'memory-word',
                    component: MemoryMain
                }
            ]
        }
    ]
})

export default router
