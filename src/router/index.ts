import {createRouter, createWebHistory} from 'vue-router'
import Index from "../page/Index.vue"
import Game from "../page/Game.vue"

const routes = [
    {path: '/', component: Index},
    {path: '/game', component: Game}
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
