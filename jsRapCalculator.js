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
	showMode:true,
	showBitwise:true,
	showHistory:true,
	maximumFractionDigits:20
}

function AddButton(base,d,t,c,i){
var o = $('<button class="calc-button ' + c + '" title="' + i + '">' + t + '</button>').appendTo(d);
$(o).bind({
	click : function(e){
		var k = $(this).text();
		var t = $(base.divin).val();
		var e = $.Event('keyup');
		switch(k){
			case '=': e.keyCode = 13;break;
			case 'DEL': t = t.substring(0,t.length - 1);$(base.divin).val(t);break;
			case 'AC': $(base.divin).val('');$(base.divre).text('0');break;
			case 'DEC': base.SetMode(10,k);break;
			case 'HEX': base.SetMode(16,k);break;
			case 'BIN': base.SetMode(2,k);break;
			case 'OCT': base.SetMode(8,k);break;
			default:
			switch(k){
				case '÷': k = '/';break;
				case '×': k = '*';break;
				case 'π': k = 'PI';break;
				case 'e': k = 'E';break;
				case 'EXP': k = 'e';break;
				case 'MOD': k = '%';break;
				case 'OR': k = '|';break;
				case 'AND': k = '&';break;
				case 'XOR': k = '^';break;
				case 'NOT': k = '~';break;
				case 'SHL': k = '<<';break;
				case 'SHR': k = '>>>';break;
			}	
			var cp = GetCaretPosition(base.divin[0]);
			var s = t.substring(0,cp) + k + t.substring(cp, t.length);
			$(base.divin).val(s);
			SetCaretPosition(base.divin[0],cp + k.length);
		}
		$(base.divin).trigger(e);
	}
});
return o;
}
	
return this.each(function(){
	this.SetMode = function(m,n){
		this.mode = m;
		this.modeName = n;
		$('.calc-mode2').removeClass('calc-active');
		$('.calc-mode8').removeClass('calc-active');
		$('.calc-mode10').removeClass('calc-active');
		$('.calc-mode16').removeClass('calc-active');
		$('.calc-mode' + m).addClass('calc-active');
	}
	this.settings = $.extend(defaults,options);
	$(this).addClass('calc-main');
	this.divre = $('<div>').addClass('calc-edit calc-display').text('0').appendTo(this);
	if(this.settings.showMode){
		var d = $('<div>').appendTo(this);
		AddButton(this,d,'HEX','calc-button-green calc-mode16','Mode Hexadecimal');
		AddButton(this,d,'DEC','calc-button-green calc-mode10 calc-active','Mode Decimal');
		AddButton(this,d,'OCT','calc-button-green calc-mode8','Mode Octal');
		AddButton(this,d,'BIN','calc-button-green calc-mode2','Mode Binary');
	}
	var d = $('<div>').appendTo(this);
	AddButton(this,d,'0','calc-button-black','');
	AddButton(this,d,'1','calc-button-black','');
	AddButton(this,d,'2','calc-button-black','');
	AddButton(this,d,'3','calc-button-black','');
	AddButton(this,d,'4','calc-button-black','');
	AddButton(this,d,'5','calc-button-black','');
	AddButton(this,d,'6','calc-button-black','');
	AddButton(this,d,'7','calc-button-black','');
	AddButton(this,d,'8','calc-button-black','');
	AddButton(this,d,'9','calc-button-black','');
	AddButton(this,d,'.','calc-button-black','');
	if(this.settings.showBitwise){
		var d = $('<div>').appendTo(this);
		AddButton(this,d,'EXP','calc-button-blue','Exponentiation');
		AddButton(this,d,'MOD','calc-button-blue','Division Remainder');
		AddButton(this,d,'OR','calc-button-blue','Bitwise OR');
		AddButton(this,d,'AND','calc-button-blue','Bitwise AND');
		AddButton(this,d,'XOR','calc-button-blue','Bitwise XOR');
		AddButton(this,d,'NOT','calc-button-blue','Bitwise NOT');
		AddButton(this,d,'SHL','calc-button-blue','Zero fill left shift');
		AddButton(this,d,'SHR','calc-button-blue','Zero fill right shift');
		AddButton(this,d,'&pi;','calc-button-purple','PI');
		AddButton(this,d,'e','calc-button-purple','Euler\'s number');
	}
	var d = $('<div>').appendTo(this);
	AddButton(this,d,'+','calc-button-brown','');
	AddButton(this,d,'-','calc-button-brown','');
	AddButton(this,d,'&times;','calc-button-brown','');
	AddButton(this,d,'&divide;','calc-button-brown','');
	this.butOpen = AddButton(this,d,'(','calc-button-brown calc-open','');
	this.butClose = AddButton(this,d,')','calc-button-brown calc-close','');
	if(this.settings.showHistory)
		this.butEqual = AddButton(this,d,'=','calc-button-brown calc-equal','');
	var d = $('<div>').appendTo(this);
	AddButton(this,d,'AC','calc-button-orange','All Clear');
	AddButton(this,d,'DEL','calc-button-orange','Delete');
	this.divin = $('<input>').addClass('calc-edit calc-input').appendTo(this);
	if(this.settings.showHistory)
		this.divHistory = $('<div>').addClass('calc-edit calc-history').appendTo(this);
	var base = this;
	$(this.divin).bind({
			keyup : function(e){
				base.Calculate(e);
			}
	});
	
	this.Calculate=function(e){
		base.divin.focus();
		var c = $(base.divin).val();
		var bo = (c.match(/\(/g) || []).length;
		var bc = (c.match(/\)/g) || []).length;
		if(bo > bc) $(base.butClose).addClass('calc-active');else $(base.butClose).removeClass('calc-active');
		if(bo < bc) $(base.butOpen).addClass('calc-active');else $(base.butOpen).removeClass('calc-active');
		c = c.replace(new RegExp(' ','g'),'');
		var c2 = c;
		c2 = c2.replace('E','Math.E');
		c2 = c2.replace('PI','Math.PI');
		c2 = c2.replace('asin','Math.asin');
		c2 = c2.replace('atan','Math.atan');
		c2 = c2.replace('cos','Math.cos');
		c2 = c2.replace('exp','Math.exp');
		c2 = c2.replace('log','Math.log');
		c2 = c2.replace('pow','Math.pow');
		c2 = c2.replace('sin','Math.sin');
		c2 = c2.replace('tan','Math.tan');
		if(base.butEqual)
			$(base.butEqual).removeClass('calc-active');
		$(base.divre).text(0);
		try{
			var v = eval(c2);
		}
		catch(err){
			return;
		}
		if(isNaN(v))return;
		if(base.butEqual)
			$(base.butEqual).addClass('calc-active');
		if(base.mode != 10)
			v = v.toString(base.mode);
		else
			v = v.toLocaleString(undefined,{maximumFractionDigits:base.settings.maximumFractionDigits});
		$(base.divre).text(v);
		if(this.divHistory && e && e.keyCode == 13){
			var d = $(base.divHistory);
			d.append(c + ' ' + this.modeName + '<br>' + v + '<br>');
			d.scrollTop(d[0].scrollHeight - d[0].clientHeight);
		}
	}
	
	this.SetMode(10,'DEC');	
})
}})(jQuery);