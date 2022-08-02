////////// WRONG

// (async function test() {
// 	console.log('1');
// 	await setTimeout(() => {
// 		console.log('2');
// 	}, 0);
// 	console.log('3');
// })(); // Ex: 132

//////////// MUST AWAIT PROMISE

async function test() {
	console.log('1');
	await new Promise((resolve, reject) => {
		setTimeout(() => {
			console.log('2');
			resolve();
		}, 1000);
	});
	console.log('3');
}

test();
