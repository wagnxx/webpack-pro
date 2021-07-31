const childProcess = require('child_process');
// const spawn = childProcess.spawn;

// free = spawn('free', ['-m']);

// free.stdin.on('data', data => {
//   console.log('stdin :\n' + data);
  
// })

// free.stdout.on('data', data => {
//   console.log('statndard output:\n' + data);
// })

// free.stderr.on('data', data => {
//   console.log('statndard error:\n' + data);
  
// })

// free.on('exit', (code, signal) => {
//   console.log('child process exit,exits:' + code);
// })

// exec
const exec = childProcess.exec;

var cmdStr = 'curl http://www.weather.com.cn/data/sk/101010100.html';

const server = require('http').createServer((req, res) => {
  if (req.url == '/weather') {
    exec(cmdStr, function(err,stdout,stderr){
        if(err) {
            console.log('get weather api error:'+stderr);
        } else {
            /*
            这个stdout的内容就是上面我curl出来的这个东西：
            {"weatherinfo":{"city":"北京","cityid":"101010100","temp":"3","WD":"西北风","WS":"3级","SD":"23%","WSE":"3","time":"21:20","isRadar":"1","Radar":"JC_RADAR_AZ9010_JB","njd":"暂无实况","qy":"1019"}}
            */
          var data = JSON.parse(stdout);
          res.setHeader('content-type',"application/json")
            res.end(stdout);
        }
    });
    
  }
});

server.listen(4000)

// const execFile = childProcess.execFile;

// execFile('bash_/basic.sh', (err, stdout, stderr) => {
//   if (err) {
//     console.log('execFile faild : ',err);
//     return;
//   }

//   // var data = JSON.parse(stdout);
//   console.log(stdout);
// })




exec('npm config ls', (err, stdout, stderr) => {
  if (err) {
    console.log(stderr);
    return;
  }
  console.log(stdout)
})