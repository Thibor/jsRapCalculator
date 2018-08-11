function GetCaretPosition(ctrl){
var CaretPos = 0;
if (document.selection){
	ctrl.focus ();
	var Sel = document.selection.createRange ();
	Sel.moveStart ('character', -ctrl.value.length);
	CaretPos = Sel.text.length;
}else if (ctrl.selectionStart || ctrl.selectionStart == '0')
	CaretPos = ctrl.selectionStart;
return (CaretPos);
}


function SetCaretPosition(ctrl, pos){
if(ctrl.setSelectionRange){
	ctrl.focus();
	ctrl.setSelectionRange(pos,pos);
}else if (ctrl.createTextRange){
	var range = ctrl.createTextRange();
	range.collapse(true);
	range.moveEnd('character', pos);
	range.moveStart('character', pos);
	range.select();
}
}

(function($){
$.fn.jsRapCalculator = function(options){
var defaults = {
}

function AddButton(d,t,c,i){
$(d).append('<button class="calc-button ' + c + '" title="' + i + '">' + t + '</button>');
}
	
return this.each(function(){
	this.SetMode = function(m){
		this.mode = m;
		$('.calc-mode2').removeClass('calc-active');
		$('.calc-mode8').removeClass('calc-active');
		$('.calc-mode10').removeClass('calc-active');
		$('.calc-mode16').removeClass('calc-active');
		$('.calc-mode' + m).addClass('calc-active');
	}
	this.settings = $.extend(defaults,options);
	this.mode = 10;
	$(this).addClass('calculator');
	this.divre = $('<div>').addClass('calc-display').text('0').appendTo(this);
	var d = $('<div>').appendTo(this);
	AddButton(d,'HEX','calc-button-green calc-mode16','Mode Hexadecimal');
	AddButton(d,'DEC','calc-button-green calc-mode10 calc-active','Mode Decimal');
	AddButton(d,'OCT','calc-button-green calc-mode8','Mode Octal');
	AddButton(d,'BIN','calc-button-green calc-mode2','Mode Binary');
	d = $('<div>').appendTo(this);
	AddButton(d,'0','calc-button-black','');
	AddButton(d,'1','calc-button-black','');
	AddButton(d,'2','calc-button-black','');
	AddButton(d,'3','calc-button-black','');
	AddButton(d,'4','calc-button-black','');
	AddButton(d,'5','calc-button-black','');
	AddButton(d,'6','calc-button-black','');
	AddButton(d,'7','calc-button-black','');
	AddButton(d,'8','calc-button-black','');
	AddButton(d,'9','calc-button-black','');
	AddButton(d,'.','calc-button-black','');
	d = $('<div>').appendTo(this);
	AddButton(d,'MOD','calc-button-blue','Division Remainder');
	AddButton(d,'OR','calc-button-blue','Bitwise OR');
	AddButton(d,'AND','calc-button-blue','Bitwise AND');
	AddButton(d,'XOR','calc-button-blue','Bitwise XOR');
	AddButton(d,'NOT','calc-button-blue','Logical NOT');
	d = $('<div>').appendTo(this);
	AddButton(d,'+','calc-button-brown','');
	AddButton(d,'-','calc-button-brown','');
	AddButton(d,'&times;','calc-button-brown','');
	AddButton(d,'&divide;','calc-button-brown','');
	AddButton(d,'(','calc-button-brown calc-open','');
	AddButton(d,')','calc-button-brown calc-close','');
	AddButton(d,'=','calc-button-brown','');
	d = $('<div>').appendTo(this);
	AddButton(d,'AC','calc-button-orange','All Clear');
	AddButton(d,'DEL','calc-button-orange','Delete');
	this.divin = $('<input>').addClass('divin').appendTo(this);
	this.divbo = $('<div>').addClass('divbo').appendTo(this);
	var base = this;
	$(this.divin).bind({
			keyup : function(e){
				base.Calculate(e);
			}
	});
	
	$('.calc-button').click(function(){
		var k = $(this).text();
		var t = $(base.divin).val();
		var e = $.Event('keyup');
		switch(k){
			case '=': e.keyCode = 13;break;
			case 'DEL': t = t.substring(0,t.length - 1);$(base.divin).val(t);break;
			case 'AC': $(base.divin).val('');$(base.divre).text('0');break;
			case 'DEC': base.SetMode(10);break;
			case 'HEX': base.SetMode(16);break;
			case 'BIN': base.SetMode(2);break;
			case 'OCT': base.SetMode(8);break;
			default:
			switch(k){
				case '÷': k = '/';break;
				case '×': k = '*';break;
				case 'MOD': k = '%';break;
				case 'OR': k = '|';break;
				case 'AND': k = '&';break;
				case 'XOR': k = '^';break;
				case 'NOT': k = '!';break;
			}	
			var cp = GetCaretPosition(base.divin[0]);
			var s = t.substring(0,cp) + k + t.substring(cp, t.length);
			$(base.divin).val(s);
			SetCaretPosition(base.divin[0],cp + 1);
		}
		$(base.divin).trigger(e);
	});	
	
this.Calculate=function(e){
base.divin.focus();
var c = $(base.divin).val();
var bo = (c.match(/\(/g) || []).length;
var bc = (c.match(/\)/g) || []).length;
if(bo > bc) $('.calc-open').addClass('calc-active');else $('.calc-open').removeClass('calc-active');
if(bo < bc) $('.calc-close').addClass('calc-active');else $('.calc-close').removeClass('calc-active');
c=c.replace(new RegExp(' ','g'),'');
var c2 = c.replace('pow','Math.pow');
try{
var v = eval(c2);
}
catch(err){
return;
}
if(isNaN(v))return;
v = v.toString(base.mode);
v = v.toLocaleString();
$(base.divre).text(v);
if(e && e.keyCode == 13){
	var d = $(base.divbo);
	d.append(c + ' =<br>' + v + '<br>');
	d.scrollTop(d[0].scrollHeight - d[0].clientHeight);
}	
}
	
})
}})(jQuery);