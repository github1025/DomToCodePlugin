
/**
 * 判断是否是Int内容
 * @param {判断的内容} num
 */
 export function validateNumberic(num) {
	if(num === "" || num ==null){
        return false;
　　 }
	return !isNaN(num)
}

// >= 0 验证
export function validatePositiveNumberic(num) {
	if(num < 0){
        return false;
　　 }
	return !isNaN(num)
}

// maxLength 的验证
export function validateMaxLength(num, maxLength = 6){
	let maxNumber = getMaxNumber(maxLength)
	if (num > maxNumber){
		return false
	}
	return !isNaN(num)
}
export function validateMaxNumber(num,maxNumber) {
	return num <= maxNumber && !isNaN(num)
}
//验证如果是小数，小数位数不能超过2位数
export function validateDoubleNumberic(num){
	return validatePointNumberic(num,2)
}
//验证如果是小数，位数不能超过指定位数
export function validatePointNumberic(num,pointCount = 0){
	let numStr = String(num)
	if(pointCount == 0 && numStr.indexOf(".") != -1){
		return
	}
	var y = numStr.indexOf(".") + 1;//获取小数点的位置
	var count = numStr.length - y;//获取小数点后的个数
	if(y > 0 && count > pointCount){
		return false
	}
	return !isNaN(num)
}

export function getMaxNumber(maxLength){
	var maxNum = ""
	for (let i = 0; i < maxLength; i++) {
		maxNum += "9"
	}
	return Number(maxNum) + 1
}