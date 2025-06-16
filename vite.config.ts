import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import components from 'unplugin-vue-components/vite'
import autoImport from 'unplugin-auto-import/vite'
import {VarletImportResolver} from '@varlet/import-resolver'
import path from 'path'

export default defineConfig({
    plugins: [
        vue(),
        components({
            resolvers: [VarletImportResolver()]
        }),
        autoImport({
            resolvers: [VarletImportResolver({autoImport: true})]
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'), // @ 指向 src
        },
    },
    server: {
        host: '0.0.0.0', // 允许局域网访问
        port: 5173, // 默认端口
        open: true, // 自动打开浏览器
    },
    base: '/pinyin-game/',
})
