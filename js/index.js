//初始画布
var penWeight = 1;
var penColor = '#f00';
var btn = document.getElementsByTagName('button');
setBtnColor(); //初始化按钮颜色
var isEraser = false; //是否正在使用橡皮擦

var canvas = document.getElementById('canvas');
var cvs = canvas.getContext('2d');

//画画
canvas.onmouseenter = function() {

	canvas.onmousedown = function(e) {

		var start_x = e.clientX - canvas.offsetLeft + document.body.scrollLeft;
		var start_y = e.clientY - canvas.offsetTop + document.body.scrollTop;

		if(isEraser === false) {

			cvs.beginPath(); //开始本次绘画
			cvs.moveTo(start_x, start_y); //画笔起始点

			cvs.lineCap = 'round';
			cvs.lineJoin = "round";
			cvs.strokeStyle = penColor; //加载全局数据（画笔颜色）
			cvs.lineWidth = penWeight; //加载全局数据（画笔粗细）

			cvs.lineTo(start_x, start_y);
			cvs.stroke(); //画一个点
		} else {
			cvs.clearRect(start_x - penWeight / 2, start_y - penWeight / 2, penWeight, penWeight);
		}

		canvas.onmousemove = function(e) {　　
			var x = e.pageX; //光标距文档左距
			var y = e.pageY; //光标距文档上距
			var move_x = e.clientX - canvas.offsetLeft + document.body.scrollLeft;
			var move_y = e.clientY - canvas.offsetTop + document.body.scrollTop;
			this.style.cursor = 'pointer';
			this.style.cursor = 'url';
			if(isEraser === false) {
				cvs.lineTo(move_x, move_y);
				cvs.stroke(); //渲染
			} else {
				cvs.clearRect(move_x - penWeight / 2, move_y - penWeight / 2, penWeight, penWeight);
			}
		}
		canvas.onmouseup = function(e) {
			cvs.closePath(); //结束本次绘画
			document.getElementById('cursorLRArrow').classList = "";
			canvas.onmousemove = null;
			canvas.onmouseup = null;
		}
	}

	canvas.onmouseleave = function() {
		canvas.onmousemove = null;
		canvas.onmouseup = null;
		canvas.onmousedown = null;
	}
}

//清空画布事件
var btn_clear = document.getElementById('clear_canvas');
btn_clear.onclick = function() {
	var tempWidth = canvas.width;
	canvas.width = canvas.height;
	canvas.width = tempWidth;
}

//随机生成按钮颜色
function setBtnColor() {
	for(var i = 0; i < btn.length; i++) {
		var random_number = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase();
		var random_color = "#" + "000000".substring(0, 6 - random_number) + random_number;

		if(random_color == document.body.style.backgroundColor) {
			i -= 1;
			continue;
		}

		btn[i].style.backgroundColor = random_color;
	}
}

//橡皮擦
var btn_eraser = document.getElementById('eraser');
btn_eraser.onclick = function() {
	isEraser = !isEraser;

	if(isEraser === false) {
		penWeight = 10;
		btn_eraser.style.backgroundColor = "#cccccc";
		btn_eraser.textContent = "使用橡皮擦";
		btn_eraser.style.color = "white";
		btn_eraser.style.paddingTop = "10px";
		btn_eraser.style.paddingBottom = "10px";
		btn_eraser.style.fontWeight = "normal";
	} else {
		btn_eraser.style.backgroundColor = "#333333";
		btn_eraser.textContent = "正在使用橡皮擦"
		btn_eraser.style.color = "red";
		btn_eraser.style.paddingTop = "20px";
		btn_eraser.style.paddingBottom = "20px";
		btn_eraser.style.fontWeight = "bold";
	}
}

var btn_save = document.getElementById('save_canvas');
btn_save.onclick = function() {
	var type = 'png';
	download(type);
}
//图片下载操作,指定图片类型
function download(type) {
	//设置保存图片的类型
	var imgdata = canvas.toDataURL(type);
	//将mime-type改为image/octet-stream,强制让浏览器下载
	var fixtype = function(type) {
		type = type.toLocaleLowerCase().replace(/jpg/i, 'jpeg');
		var r = type.match(/png|jpeg|bmp|gif/)[0];
		return 'image/' + r;
	}
	imgdata = imgdata.replace(fixtype(type), 'image/octet-stream')
	//将图片保存到本地
	var saveFile = function(data, filename) {
		var link = document.createElement('a');
		link.href = data;
		link.download = filename;
		var event = document.createEvent('MouseEvents');
		event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		link.dispatchEvent(event);
	}
	var filename = new Date().toLocaleDateString() + '.' + type;
	saveFile(imgdata, filename);
}

/* 调色板插件 https://github.com/DavidDurman/FlexiColorPicker */
var cp = ColorPicker(
	document.getElementById('color-picker'),

	function(hex, hsv, rgb) {

		console.log(hex); //十六进制颜色值
		console.log(rgb);

		if(rgb.r > 200 && rgb.g > 200 && rgb.b > 200) {
			document.getElementById('canvas').style.border = "1px solid #ccc";
		} else {
			document.getElementById('canvas').style.border = "0px";
		}

		penColor = document.body.style.backgroundColor = hex; //设置画笔色
	}
);

//初始化画板选取的颜色
cp.setHex("#00ff68");

/* 拖动数值 http://www.jb51.net/article/105845.htm */
var lineDiv = document.getElementById('lineDiv'); //长线条
var minDiv = document.getElementById('minDiv'); //小方块
var vals = document.getElementById("vals");

minDiv.onselectstart = function() {
	return false;
}
vals.onselectstart = function() {
	return false;
}

var ifBool = false; //判断鼠标是否按下
//事件
var start = function(e) {
	e.stopPropagation();
	ifBool = true;
	console.log("鼠标按下")
}
var move = function(e) {
	console.log("鼠标拖动")
	if(ifBool) {
		if(!e.touches) { //兼容移动端
			var x = e.clientX;
		} else { //兼容PC端
			var x = e.touches[0].pageX;
		}
		var lineDiv_left = getPosition(lineDiv).left; //长线条的横坐标
		var minDiv_left = x - lineDiv_left; //小方块相对于父元素（长线条）的left值 
		if(minDiv_left >= lineDiv.offsetWidth - 15) {
			minDiv_left = lineDiv.offsetWidth - 15;
		}
		if(minDiv_left < 0) {
			minDiv_left = 0;
		}
		//设置拖动后小方块的left值
		minDiv.style.left = minDiv_left + "px";
		var pen_weight_num = parseInt((minDiv_left / (lineDiv.offsetWidth - 15)) * 99 + 1);
		vals.innerText = pen_weight_num;
		penWeight = pen_weight_num;
	}
}
var end = function(e) {
	console.log("鼠标弹起")
	ifBool = false;
}
//鼠标按下方块
minDiv.addEventListener("touchstart", start);
minDiv.addEventListener("mousedown", start);
//拖动
window.addEventListener("touchmove", move);
window.addEventListener("mousemove", move);
//鼠标松开
window.addEventListener("touchend", end);
window.addEventListener("mouseup", end);
//获取元素的绝对位置
function getPosition(node) {
	var left = node.offsetLeft; //获取元素相对于其父元素的left值var left
	var top = node.offsetTop;
	current = node.offsetParent; // 取得元素的offsetParent
	while(current != null) {
		left += current.offsetLeft;
		top += current.offsetTop;
		current = current.offsetParent;
	}
	return {
		"left": left,
		"top": top
	};
}