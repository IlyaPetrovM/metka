/**
 * @brief Структура приложения на Vue. Чтобы всё работало необходимо скачать vue.global.js с их оф. сайта и подключить РАНЬШЕ этого скрипта
 */
const Razmetka = {
/**
 *  Данные, которые используются в проекте 
 */
  data() {
    return {
        media: { 
            src:'video.mkv',
            controls:true,
            height:'360'
           },
        times: [] //*< В этом списке хранятся все фрагменты со временем и описанием
    }
  },
/**
 *  Обработчики событий 
 */
    methods: {
        /**
         * @brief Захватить время из медиафайла и сохранить его в базу данных
         * @return ничего
         */
        captureTime(){
            var timeSt = String(player.currentTime).toHHMMSS();
            
            this.times.push({
                img: getScreenShot(player),
                time: player.currentTime,
                ts: timeSt,
                text:' '
            });
            
            setTimeout(function(){document.getElementById('inp'+timeSt).focus();}, 300); // ждём пока создастся input и переводим на него фокус
            
        },
        /**
         * @brief Сфокусировать курсор на текстовом поле, 
                    когда выбран определённый кадр 
                    и перевести кадр на нужную позицию в плеере
         * @return ничего
         */
        inputFocused(metka,e){
            document.getElementById( 'inp'+metka.ts).focus();
            player.currentTime = metka.time;
        }
    }
}
/**
 * @brief Сохранение скриншота из видео
 * @param [in] video - id элемента video на странице, из которого требуется взять скриншот
 * @return Изображение в виде строки
 */
function getScreenShot(video){
    var canvas = document.createElement('canvas');
    canvas.width = 160*2;
    canvas.height = 90*2;
    var context = canvas.getContext('2d');
    context.drawImage(video, 0 , 0, canvas.width, canvas.height);
    var dataURI = canvas.toDataURL('image/jpeg');
    return dataURI;
    
}

//
// Запуск всего приложения
//
Vue.createApp(Razmetka).mount('#razmetka'); 

/**
 * @brief Добавление функции в объект String - преобразование секунд в строку в формате HH:MM:SS, где HH - часы, MM - минуты, SS - секунды
 * @return строка со временем в формате HH:MM:SS
 */
String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}