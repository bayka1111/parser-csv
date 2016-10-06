// window._parser_csv
;(function (){
"use scrict"	

function ParserCSV (formElem){
	this.formElem = formElem; 
}

function consoleArr(arr, str){
	// выводим в консоль то что распарсии
	console.log("		arr length = " + arr.length);
	for (var i = 0; i < arr.length; i++){
		if (str[i] != "" && str[i] != undefined){
			console.log("		str length = " + str[i]);
			for (var j = 0; j < str[i].length; j++){	
					console.log("str["+ i + "," + j + "] = " + str[i][j]);
				}
		}	
	}	
}

function compareArr(csvArr, csvStr, xlsArr, xlsStr){
	var flag = true;
	var str = "";
	for (var i = 0; i < csvArr.length; i++){
		if (csvStr[i] != "" && csvStr[i] != undefined){
			str = csvStr[i][1].substring(3);
			flag = true;
			for (var j = 0; j < xlsArr.length; j++){
				if (xlsStr[j] != "" && xlsStr[j] != undefined){
					if (str === xlsStr[j][1]){ // находим артикул в прайсе поставщика
						flag = false;
						// console.log(csvStr[i][1] + " -артикул-   " + csvStr[i][3] + " -цена- "); 
						csvStr[i][3] = xlsStr[j][2]; // присваиваем новую цену
						csvStr[i][4] = xlsStr[j][3]; // присваиваем новую акционную цену
						// console.log(csvStr[i][5] + " -старое значение- " + csvStr[i][6] + " - " + xlsStr[j][4]);
						switch (xlsStr[j][4]){
							case "нет"  		:   csvStr[i][5] = 0; //нет
								   		  			csvStr[i][6] = 0;
								 		  			break;
							case ""  			:   csvStr[i][5] = 0; //нет
								   					csvStr[i][6] = 0;
								 					break;
							case "N"  			:   csvStr[i][5] = 0; //нет
								   		  			csvStr[i][6] = 0;
								 		  			break;
							case "в резерве"	:   csvStr[i][5] = 0; // в резерве
											 	  	csvStr[i][6] = 0;
												  	break;
							case "заканчиваются": 	csvStr[i][5] = 1; // заканчиваются
										 	      	csvStr[i][6] = 5;
												  	break;
							case "*"			: 	csvStr[i][5] = 1; // заканчиваются
										 	      	csvStr[i][6] = 5;
												  	break;
							case "достаточно" 	: 	csvStr[i][5] = 1; // достаточно
											  	  	csvStr[i][6] = 50;
													break;
							case "**" 			: 	csvStr[i][5] = 1; // достаточно
											  	  	csvStr[i][6] = 50;
													break;
							case "***" 			: 	csvStr[i][5] = 1; // достаточно
											  	  	csvStr[i][6] = 50;
													break;
							case "****" 		: 	csvStr[i][5] = 1; // достаточно
											  	  	csvStr[i][6] = 50;
													break;
							case "Y" 			: 	csvStr[i][5] = 1; // достаточно
											  	  	csvStr[i][6] = 50;
													break;
							case "+" 			: 	csvStr[i][5] = 1; // достаточно
											  	  	csvStr[i][6] = 50;
													break;
							case "++" 			: 	csvStr[i][5] = 1; // достаточно
											  	  	csvStr[i][6] = 50;
													break;
							case "+++" 			: 	csvStr[i][5] = 1; // достаточно
											  	  	csvStr[i][6] = 50;
													break;
							default 			: 	break;
						}
						console.log(csvStr[i][5] + " -новое значение- " + csvStr[i][6]);							 
					} 
				}
			}
			if (flag){ // артикула нет в прайсе
				csvStr[i][4] = ""; // акционная цена
				csvStr[i][5] = 0; // нет в налчии
				csvStr[i][6] = 0;
			}
		}	
	}	
	str = reverseCompareArr(csvArr, csvStr, xlsArr, xlsStr);
	arrToCsv(csvArr, csvStr, str);
}

function reverseCompareArr(csvArr, csvStr, xlsArr, xlsStr){
	var flag = true;
	var str = "";
	var str1 = "";
	for (var j = 0; j < xlsArr.length; j++){
		if (xlsStr[j] != "" && xlsStr[j] != undefined){
			if (xlsStr[j][1] === ""){
				flag = false;
			} else {
				flag = true;
				for (var i = 0; i < csvArr.length; i++){
				    if (csvStr[i] != "" && csvStr[i] != undefined){
					    str = csvStr[i][1].substring(3);
						if (str === xlsStr[j][1]){ // находим
							flag = false;
							console.log(xlsStr[j][1] + csvStr[i][1]);
						}
					}
				}
			}
			if (flag){
				str1 = str1 + '"' + xlsStr[j].join('","')	+ '"' + '\n';
				console.log(xlsStr[j].join('","'));
			}
		}
	}	
	return str1;
}

function arrToCsv (csvArr, csvStr, str1){
	var str = "";
	for (var i = 0; i < csvArr.length; i++){
		if (csvStr[i] != undefined){
			str = str + '"' + csvStr[i].join('","') + '"' + '\n';
		}
	}

	document.write(
	   '<a href="data:text/plain;charset=utf-8,%EF%BB%BF' + 
	   encodeURIComponent(str) + 
	   '" download="shadrin_new.csv">shadrin_new.csv</a>' +
	   '<br>' + 
	   '<a href="data:text/plain;charset=utf-8,%EF%BB%BF' + 
	   encodeURIComponent(str1) + 
	   '" download="new_pos.csv">new_pos.csv</a>'
	);
}

ParserCSV.prototype.pars = function (){
	var csvArr = [];
	var xlsArr = [];
	var csvStr = [];
	var xlsStr = [];
	
	this.formElem.on("submit", function (event){
		event.preventDefault();
		$.ajaxSetup({cache: false}); 
		 	$.ajax({ //конфигурация запроса на ajax
				url:"/data/shadrin.csv"
				}).success(function (data){ // получячаем ответ
					var reg = /\n/;
					csvArr = data.split(reg);
					//парсим цсв				
					for (var i = 0; i < csvArr.length; i++){
						if (csvArr[i]!=""){
							csvStr[i] = csvArr[i].slice(0, -1).slice(1).split("\",\"");
						}
					}
					// выводим в консоль то что распарсии
					// consoleArr(csvArr, csvStr);

						$.ajax({ //конфигурация запроса на ajax
							url:"/data/prise.csv" // конвертер для xls https://convertio.co/ru/xls-csv/
							}).success(function (data){ // получячаем ответ
								// парсим цсв который эксель
								var re = /\n/;
								xlsArr = data.split(re);
								for (var i = 0; i < xlsArr.length; i++){
									if (xlsArr[i]!=""){
										xlsStr[i] = xlsArr[i].slice(0, -1).slice(1).split("\",\"");
									}
								}
								// выводим в консоль то что распарсии
								// consoleArr(xlsArr, xlsStr);

								// сравниваем/заменяем конкретные элементы
								compareArr(csvArr, csvStr, xlsArr, xlsStr);

							}).error(function (err){
								alert(err);
							}); // end $.ajax url:"/data/prise.csv"

				}).error(function (err){
					alert(err);
				}); // end $.ajax url:"/data/shadrin.csv"
	});
}

	var form;
	function pars1(formElem){ 
		form = new ParserCSV(formElem);
		form.pars();
	}

	window._parser_csv = pars1;

})();


$(document).ready(function(){

_parser_csv($("#formpars"));

});
