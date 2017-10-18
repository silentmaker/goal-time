const timeParse = function(time) {
	let hh = parseInt(time / 3600);
	let mm = parseInt((time - hh * 3600) / 60);
	let ss = parseInt(time - hh * 3600 - mm * 60);

	return (hh ? hh + '小时 ' : '') + 
		(mm ? mm + '分钟 ' : '') +
		(ss + '秒');
};

const dateParse = function(date) {
	const now = new Date().getTime();
	const gap = (date - now) / 86400000;

	if (gap <= 1) {
		return '今天';
	} else if (gap <= 2) {
		return '昨天';
	} else if (gap < 7) {
		return parseInt(gap) + '天前';
	} else {
		return new Date(date).format('yy-mm-dd');
	}
}

export {
	timeParse,
	dateParse
};