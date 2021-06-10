
const Razmetka = {
  data() {
    return {
        p: {
            src:'video.mkv',
            controls:true
           },
        times: []
    }
  },
    methods: {
        captureTime(){
            var timeSt = String(player.currentTime).toHHMMSS();
            this.times.push({
                time: player.currentTime,
                ts: timeSt,
                text:' '
            });
            
            setTimeout(function(){document.getElementById('inp'+timeSt).focus();}, 300); // ждём пока создастся input и переводим на него фокус
            
        },
        inputFocused(metka,e){
            document.getElementById( 'inp'+metka.ts).focus();
            player.currentTime = metka.time;
        }
    }
}

Vue.createApp(Razmetka).mount('#razmetka');

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