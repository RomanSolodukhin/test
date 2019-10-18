const {performance} = require('perf_hooks');

var char = [
	{
damage: [80,90],
	hp: 850,
	delay: [1000.0],
	kd: 0,
	name: 'Андрюшка'
},
{
	damage: [160,170],
	hp: 600,
	delay: [
		1333.333333333330,
		1333.333333333331,
		1333.333333333332,
		1333.333333333333,
		1333.333333333333,
		1333.333333333333,
		1333.333333333334], //  1333.333333333333
	kd: 0,
	name: 'Славик'
}
];
//1399.9412
let kVelocity = 1;
let rounds = 100000;
let silent = 0;
rounds > 100 ? silent = 1 : 0;

let wins = [0, 0];

while(wins[0] != wins[1] || wins[0] == 0) {
//while(char[1].delay > 1332) {
	var lTime = performance.now();
	for(let i = 0; i < rounds; i++) {
		logger('Раунд '+i, silent);
		MathBattle();
		//Battle();
	}
	lTime = performance.now() - lTime;
	logger('Результаты побед ('+char[0].name+'/'+char[1].name+' '+wins+'). Время на операцию: '+lTime);
	if(wins[1]/(wins[0]+1) > 3 || wins[0]/wins[1]+1 > 3) {
		logger('Стоп');
		break;
	}
	//char[1].delay-=0.000000000001;
	wins = [0,0];
}

/*==========================================================*/

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function logger(string, silentParam) {
	if(silentParam == true) return false;
	console.log(string);
	return true;
}

function getOpponent(attacker) {
	return attacker == 0 ? 1 : 0;
}

function MathDamage(attacker) {
	let delay = char[attacker].delay[getRandomInt(char[attacker].delay.length)];
	let opponent = getOpponent(attacker);
	let result = [0,0,1];
	for(result[0] = 0; result[1] < char[opponent].hp; result[0]+=delay, result[2]++) {
		result[1]+= (char[attacker].damage[0]+getRandomInt(char[attacker].damage[1]-char[attacker].damage[0]+1));
	}
	return result;
}

function MathBattle() {
	var result = [0,0];
	result[0] = MathDamage(0);
	result[1] = MathDamage(1);
	if(result[0][0] == result[1][0]) {
		logger('Ничья', silent);
		wins[2]++;
		return;
	}
	let victim = result[0][0] > result[1][0] ? 0 : 1;
	let winner = getOpponent(victim);
	wins[winner]++;
	logger(char[winner].name+' одержал победу над '+char[victim].name+' с уроном '+result[winner][1]+' (против '+result[victim][1]+')'+' за '+result[winner][0]+' мс (против '+result[victim][0]+' мс)',silent);
}

function Battle() {
let lTime = performance.now();
	let attacker = getRandomInt(2);
 let attackNumber = 1;
	do {
  if(char[attacker].kd <= performance.now()) {
  Damage(attacker,attackNumber);
  attackNumber++;
}
	 attacker = char[0].kd > char[1].kd ?	 1 : 0;
	} while(char[1].hp > 0 && char[0].hp > 0);
lTime = performance.now()-lTime;
let victim = char[attacker].hp > 0 ? getOpponent(attacker): attacker;
let winner = getOpponent(victim);
		wins[winner]++;
		Reset();
		logger(char[winner].name+' победил, '+char[victim].name+' пошёл отдыхать ('+wins+') '+lTime,silent);
}

function Damage(attacker,attackNumber) {
	let opponent = getOpponent(attacker);
	let damageAmount = char[attacker].damage[0]+getRandomInt(char[attacker].damage[1]-char[attacker].damage[0]+1);
	char[attacker].kd = performance.now()+char[attacker].delay/kVelocity;
	char[opponent].hp-=damageAmount;
	logger(attackNumber+'. '+char[opponent].name+'(HP: '+parseFloat(char[opponent].hp).toPrecision(3)+') получает по щам от '+char[attacker].name+'. Урон: '+damageAmount,silent);
}

function Reset() {
char[0].hp = 850;
char[0].kd = 0;
char[1].hp = 600;
char[1].kd = 0;
}
