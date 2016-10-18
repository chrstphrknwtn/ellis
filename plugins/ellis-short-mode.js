'use strict';

/* short permissions plugin
------------------------------------------------*/
module.exports = function shortPermissionsPlugin(stats) {
	const column = [];

	let colorCode;
	if (process.env.BACKGROUND === 'light') {
		colorCode = '\x1b[38;5;252m';
	} else {
		colorCode = '\x1b[38;5;236m';
	}

	stats.forEach(file => {
		let octal = file.stat.mode & 4095;
		let shortPerm = ('0000' + octal.toString(8)).slice(-3);
		column.push(`${colorCode}${shortPerm}`);
	});

	return column;
};
