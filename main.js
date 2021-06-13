/**
 * @brief Структура приложения на Vue. Чтобы всё работало необходимо скачать vue.global.js с их оф. сайта и подключить РАНЬШЕ этого скрипта
 */

const Razmetka = {
/**
 *  Данные, которые используются в проекте 
 */
  data() {
    return {
        HOST: 'http://t1553.ru:8055',
        access_token:'',
        media: { 
            src:"ed995860-2cd0-4977-9eb7-6051eda1281b",
            controls:true,
            height:'360'
           },
        times: [] //*< В этом списке хранятся все фрагменты со временем и описанием
    }
  },
   mounted: async function(){
       let HOST = this.HOST, 
           user= "",
           psw="";
            // Получение секретного токена по логину и паролю
            let query = {
                method: 'POST',
                 headers: {
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({
                    "email": user,
                    "password": psw
                })
            };
            var response = await fetch(HOST+'/auth/login', query);
            if(response.ok){
                let json = await response.json();
                
                this.access_token = json.data.access_token;
            }else{
                console.log('Ошибка HTTP: ', response.status);
            }
            
            // Запрос данных из таблицы timecodes
            let resp = await fetch(HOST+'/items/timecodes',{
                headers:{
                    'Authorization': 'Bearer '+ this.access_token, // токен добавляется в запрос, чтобы получить доступ
                }
            });
            if(resp.ok){
                let json = await resp.json();
                for(i in json.data){
                    this.times.push(json.data[i]);
                }
                console.log(this.times);
            }else{
                console.log('Ошибка HTTP: ', resp.status);
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
                screenshot: getScreenShot(player),
                seconds: player.currentTime,
                timestring: timeSt,
                description:''
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