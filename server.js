'use strict';
//	서버 객체 생성
//const server = require('http').createServer();
const app = require("express")();
const http = require("http").createServer(app);

//	io 객체 생성
const io = require('socket.io')(http);

//	- 특정 namespace로 요청
// const nsp = io.of("/msg");

//	싱글스레드 기반 node.js는 EventListener형식으로 명령 실행

//	client가 websocket 접속을 했을시 실행할 명령
//	함수의 파라미터로 client의 소켓이 전달
io.on('connection',socket=>{
	console.log('connected! : ', socket.id);

	socket.on('alert', data=>{
		data.msg = data.id.real+'님이 접속 하셨습니다.';
		socket.realId = data.id.real;
		io.to(data.target).emit('alert', data.msg);
		const room = data.target?
			data.target:
			data.id.real;
		socket.join(room);
		socket.emit('room',room);
		console.log(room);
	})

	//	소켓을 특정방으로
	//	socket.join(room)

	//	소켓을 특정방에서 나가게
	//	socket.leave(room);

	socket.on('newMessage',data=>{
		//	- public 전송 (접속사용자 모두에게 이벤트 발생)
		/*
		io.sockets.emit('newMessage', {
			id: socket.realId,
			msg: data.msg
		});
		*/
		
		//	- 이벤트 발생 소켓만 이벤트 발생
		//	socket.emit('alert', "성공");

		//	- 이벤트 발생 소켓 이외의 모든 사용자에게 이벤트 발생
		//	socket.broadcast.emit(event, data)

		//	- 특정(그룹) 구성원에게만 이벤트 발생
		io.to(data.target).emit('newMessage', {
			id: socket.realId,
			msg: data.msg
		});
		//	io.to(room).emit(event, data)

		//	특정 id를 갖는 소켓에만 이벤트 발생
		//	io.sockets.connected[id].emit(event, data);

	})
});

//	"/"요청시 파일 send
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/client.html");
});

//	3000포트에서 서버시작후 실행명령
http.listen(3000, () => {
	console.log('hello world! through port 3000');
});
