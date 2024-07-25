/**
 * @author zhangyanbin
 * @date 2022年09月25日 5:38 下午
 * @describe
 */
import {decorate, observable, computed} from "mobx";

class OrderLine {
	price = 0;
	amount = 1;
	constructor(price) {
		this.price = price;
	}

	get total() {
		return this.price * this.amount;
	}
}
decorate(OrderLine, {
	price: observable,
	amount: observable,
	total: computed
})
