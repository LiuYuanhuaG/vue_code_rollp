// rollup.config.js
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
import commonjs from 'rollup-plugin-commonjs';


export default {
    input: './src/index.js', // 入口文件
    output: {
        file: 'dist/umd/vue.js', // 打包地址
        format: 'umd',
        name: 'Vue', // 全局注册Vue
        sourcemap: true
    },
    Plugins: [
        babel({
            exclude: 'node_modules/**' // 忽略node_modules之下文件
        }),
        serve({
            open: true,
            port: 8888,
            contentBase: '',
            openPage: '/index.html'
        }),
        commonjs()
    ]
};