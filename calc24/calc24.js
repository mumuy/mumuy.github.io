/*
	calc24(3,4,5,6);
	最大计算量:2682(去除一部分交换律的值,对包含重复数值计算的优化)
*/

function calc24(){
	var expression = [].slice.call(arguments).sort();
	var operator = ['+','-','*','/'],result = [],hash = {};
	(function(expression){
		var len = expression.length;
		var group_str = expression.slice(0).sort().toString();
		if(!hash[group_str]){
			hash[group_str] = true;
			if(len>1){
				for(var i=0;i<len-1;i++){
					for(var j=i+1;j<len;j++){
						var sort_expression = expression.slice(0);
						var exp1 = sort_expression.splice(j,1)[0];
						var exp2 = sort_expression.splice(i,1)[0];
						for(var n=0;n<4;n++){
							var new_expression = sort_expression.slice(0);
							new_expression.splice(0,0,n>1||len==2?exp1+operator[n]+exp2:'('+exp1+operator[n]+exp2+')');
							arguments.callee(new_expression);
							if(exp1!=exp2&&n%2){
								new_expression.splice(0,1,n>1||len==2?exp2+operator[n]+exp1:'('+exp2+operator[n]+exp1+')');
								arguments.callee(new_expression);						
							}
						}
					}
				}
			}else if(Math.abs(eval(expression[0])-24)<1e-6){
				result.push(expression[0]);
			}
		}
	})(expression);
	return result;
}