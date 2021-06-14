# metka
## Требования к установке
- directus v9
- NodeJS




## Установка готового модуля
1. Скачайте файл `index.js` из папки dist
2. Поместите его в директорию `<папка directus>/extensions/modules/<название папки модуля>`
3. Перезагрузите страницу с directus

## Сборка модуля из исходных файлов
Сборка выполнялась по инструкциям с сайта https://docs.directus.io/guides/modules/
1. Скачайте файлы и распакуйте архив с ними в отдельную папку.
2. Установите Rollup. Для этого в консоли введите команду:
```
npm i -D rollup @rollup/plugin-commonjs @rollup/plugin-node-resolve @rollup/plugin-replace rollup-plugin-terser rollup-plugin-vue @vue/compiler-sfc
```
3.  В консоли перейдите в директорию с файлами проекта и введите команду `npx rollup -c`
4. Появится папка `dist`. Файл `index.js` в ней нужно поместить в директорию `<папка directus>/extensions/modules/<название папки модуля>`
5. Перезагрузите страницу с directus


