'use strict';

/* minimal fading dots for file mtime
------------------------------------------------*/
module.exports = function rottingDatesPlugin(stats) {
	const now = Date.now();

	const column = [];

	stats.forEach(file => {
		const fileAge = now - file.stat.mtime;

		const colorMin = 20;

		const ageRange = 86400000 * 10; // one day * 10
		const ageMultiplier = Math.max(0, (ageRange - fileAge) / ageRange);

		let ageAddon;
		if (process.env.BACKGROUND === 'light') {
			ageAddon = (255 - colorMin) - ((255 - colorMin) * ageMultiplier);
		} else {
			ageAddon = ((255 - colorMin) * ageMultiplier) + colorMin;
		}

		let ageColor = parseInt(ageAddon, 10);

		const colorCode = `\x1b[38;2;${ageColor};${ageColor};${ageColor}m`;

		column.push(` ${colorCode}·`);
	});

	return column;
};
