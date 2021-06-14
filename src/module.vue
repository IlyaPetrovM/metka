    <style type="text/css">
        #controls{
            display:block;
            max-width: 360px;
            height: 240px;
        }
        #controls video{
            height: 200px;
        }
        #fragments{
            display:block;
            height: calc(90% - 240px);
            min-width:400px;
            overflow:auto;
        }
        .tempImage{border: 1px red solid;}
        #fragments form img
        {
            display: inline-block;
            width: 240px;
        }
    </style>
<template>
	<private-view title="Разметка медиафала">
        <div id=contols>
        <video crossorigin = "anonymous" 
               id = 'player' 
               :src = '"/assets/"+media.src' 
               :controls = 'media.controls'
               height=200
       ></video>
        
            <v-button @click='captureTime'>Поставить метку</v-button>
        </div>
        <div id='fragments'>
            <form v-for='metka in times' :key="metka.id">
                <img 
                     :src='"/assets/"+metka.screenshot'
                     alt="no image" v-if="metka.screenshot" />
                <img class='tempImage'
                     :src='metka.tempImage'
                     alt="no image" v-if="(metka.screenshot==undefined)" />
<!--                     :src='metka.screenshot'-->
                <a   @click = 'inputFocused(metka, $event)' href='#'> {{ metka.timestring }}</a>
                <input v-model='metka.description' 
                       :id = '"inp"+metka.timestring' 
                       @blur="sendDescription(metka, $event)"
                       v-if='metka.id'
                       autofocus >
                <button @click="deleteTimecode(metka)">X</button>
            </form>
        </div>

    </private-view>
</template>

<script>
let getQuery = getUrlParams(document.URL);
console.log(getQuery);
    
let TAB = '/items/timecodes';
export default {
    data(){
        return {
            media: { 
            src: getQuery.mediafile,
            focusOnSecond: getQuery.second,
            controls:true,
            height:'200'
           },
            times: null,
        }
    },
    inject: ['system'], // эта переменная даёт доступ к волшебному api при помощи которого можно обмениваться информацией с сервером практически бесшовно
    mounted() {
        console.log(this.system);
        this.loadItems();
    },
    methods: {
        loadItems(){
            this.system.api.get(`${TAB}?filter={"mediafile":{"_eq":"${this.media.src}" }}&sort[]=second`).then((res) => {
                console.log(res);
                this.times = res.data.data;
            });
        },
       /**
         * @brief Захватить время из медиафайла и сохранить его в базу данных
         * @return ничего
         */
        captureTime(){
            var timeSt = String(player.currentTime).toHHMMSS();
            if(document.getElementById('inp'+timeSt)!=undefined)return;
            let newTimecode = {
                id:null,
                mediafile: this.media.src,
                tempImage: getScreenShot(player),
                screenshot:null,
                second: player.currentTime,
                timestring: timeSt,
                description:''
            };
            this.times.push(newTimecode);
            var tm = this.times[this.times.length-1]; // Осторожно!! Если пересортировать список перед этим, то всё собъётся!
            /*
            *
            * Загрузка скриншота
            *
            */
            const fileImg = dataURLtoFile(newTimecode.tempImage);
            
            const formData = new FormData();
            formData.append('img',fileImg,fileImg.name);
            const conf = {
                headers: {'Content-Type': 'multipart/form-data'}
            }
            this.system.api.post('/files',formData,conf)
                .then((res)=>{
                    console.log('file Uploaded. Result:',res);
                    let uuid = res.data.data.id;
                    this.system.api.patch('/files/'+uuid,{"folder": '33da7cc5-6d77-4522-9321-19e51bb5f854'});
                    // Отправка остальных данных
                    newTimecode.screenshot = uuid;
                    console.log(newTimecode);
                    this.system.api.post(TAB, newTimecode)
                        .then(function(res){
                            let id = res.data.data.id;
                            tm.id = id; // Осторожно!! Если пересортировать список перед этим, то всё собъётся!
                            console.log('new Timecode uploaded');
                        }).then(()=>{
                            setTimeout(function(){document.getElementById('inp'+timeSt).focus();}, 100); // ждём пока создастся input и переводим на него фокус
                        });
                });
        },  
         /**
         * @brief Сфокусировать курсор на текстовом поле, 
                    когда выбран определённый кадр 
                    и перевести кадр на нужную позицию в плеере
         * @return ничего
         */
        inputFocused(metka,e){
            document.getElementById( 'inp'+metka.timestring).focus();
            player.currentTime = parseInt(metka.second);
        },
        /**
         * @brief Отправить описание фрагмента на сервер
         * @return ничего
         */
        sendDescription(metka, event){
            console.log('Send Description', event);
            this.system.api.patch(TAB+'/'+metka.id, {description: metka.description})
                .then((res)=>{console.log('Desc. sent');});
        },
        /**
         * @brief Удалить фрагмент
         * @return ничего
         */
        deleteTimecode(metka){
            this.system.api.delete(TAB+'/'+metka.id)
            .then((res)=>{ colsole.log(res)});
        }
    },
    
};
/**
*
* Источник: https://gist.github.com/ibreathebsb/a104a9297d5df4c8ae944a4ed149bcf1
*
*/
const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n) {
    u8arr[n - 1] = bstr.charCodeAt(n - 1)
    n -= 1 // to make eslint happy
  }
  return new File([u8arr], filename, { type: mime })
}
/**
 * @brief Получить параметры из GET запроса (адреса страницы)
 * @param [in] search URL-адрес из которого нужно получть параметры 
                после знака ? в формате ключ=значение. 
                Например, http://example.com?key1=val&key2=val2
 * @return Объект с ключами и значениями
 */
function getUrlParams(search) {
    let hashes = search.slice(search.indexOf('?') + 1).split('&')
    let params = {}
    hashes.map(hash => {
        let [key, val] = hash.split('=')
        params[key] = decodeURIComponent(val)
    })
    return params;
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
//    console.log(dataURI);
    return dataURI;
    
}

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
</script>