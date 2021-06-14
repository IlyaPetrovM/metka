# metka - модуль directus для описания видео и аудио
## Требования к установке
- directus v9
- NodeJS

### Требования к базе данных
В базе directus должна быть таблица с названием `timecodes` и полями:
- id : int
- description : String
- second : int
- screenshot : uuid
- mediafile : String

### Сохранение скриншотов
По умолчанию все скриншоты помещаются в папку, с определённым id - это может вызывать проблемы при переносе проекта. 
Решить их можно поменяв в файле `index.js` строчку `{folder:"33da7cc5-6d77-4522-9321-19e51bb5f854"}`. 
Вместо `33da7c....` вставьте id папки, в которую вы хотели бы складывать скриншоты. 
id папки можно узнать открыв её в directus - тогда в строке адреса после знака ? будет id. 

Например, `http://example.com/admin/files?folder=33da7cc5-6d77-4522-9321-19e51bb5f854`

# Установка
## Вариант 1. Установка готового модуля
1. Скачайте файл `index.js` из папки dist
2. Поместите его в директорию `<папка directus>/extensions/modules/<название папки модуля>`
3. Перезагрузите страницу с directus

## Вариант 2. Сборка модуля из исходных файлов
Сборка выполнялась по инструкциям с сайта https://docs.directus.io/guides/modules/
1. Скачайте файлы и распакуйте архив с ними в отдельную папку.
2. Установите Rollup. Для этого в консоли введите команду:
```
npm i -D rollup @rollup/plugin-commonjs @rollup/plugin-node-resolve @rollup/plugin-replace rollup-plugin-terser rollup-plugin-vue @vue/compiler-sfc
```
3.  В консоли перейдите в директорию с файлами проекта и введите команду `npx rollup -c`
4. Появится папка `dist`. Файл `index.js` в ней нужно поместить в директорию `<папка directus>/extensions/modules/<название папки модуля>`
5. Перезагрузите страницу с directus


