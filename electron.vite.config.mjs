import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    main: {
        // 建议加上：确保打包时清空旧的 main 产物
        build: {
            emptyOutDir: true,
            sourcemap: false // 生产环境建议关闭 sourcemap，减小体积
        }
    },
    preload: {
        // 建议加上：确保打包时清空旧的 preload 产物
        build: {
            emptyOutDir: true,
            sourcemap: false
        }
    },
    renderer: {
        resolve: {
            alias: {
                '@renderer': resolve('src/renderer/src')
            }
        },
        // ✅ 1. 核心配置：相对路径（你已经有了，保持住）
        base: './',

        // ✅ 2. 建议补充：Tailwind CSS 兼容性配置
        // 有时候打包后 CSS 路径会乱，加上这个更稳妥
        css: {
            devSourcemap: false // 生产环境关闭 CSS sourcemap
        },

        // ✅ 3. 建议补充：确保打包产物干净
        build: {
            emptyOutDir: true,
            sourcemap: false,
            rollupOptions: {
                // 如果有特殊的静态资源需要处理，可以在这里配置
            }
        },

        plugins: [tailwindcss(), vue()]
    }
})
