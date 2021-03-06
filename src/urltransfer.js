$(document).ready(function() {
    var language = navigator.language;

    // Fill language to page
    var fillLanguageToPage = function() {
        var replace_ids = ["ok_btn_id", "mini_btn_id", "history_btn_id", "current_btn_id"];
        var replace_attr = {"target_id" : "placeholder"};

        for(var idx in replace_ids) {
            $("#" + replace_ids[idx]).empty().append(lang[language][replace_ids[idx]]);
            //console.log(lang[language][replace_ids[idx]]);
        }

        for(var key in replace_attr) {
            $("#" + key).attr(replace_attr[key], lang[language][key + "_" + replace_attr[key]]);
        }
    };

    /* Fill */
    fillLanguageToPage(); 

    var utf16to8 = function(str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for(i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
            }
        }
        return out;
    }	

    var generateQrCode = function() {
        var content = $('#target_id').val();
        //console.log(content);
        if(content.length == 0) {
            return false;
        }

        $("#qrcode_canvas").empty();
        $("#qrcode_canvas").qrcode({
            width : 200,
            height : 200,
            text : utf16to8(content)
        });
        
        saveContent(content);

        return true;
    }

    var openHistory = function() {
        try {
        /*
            var tabs = chrome.extension.getExtensionTabs();
            for (var i in tabs) {
                var tab = tabs[i];
                if (tab.location.pathname == "/history.html") {
                    return;
                }
            }
            */
            chrome.tabs.create({url: "history.html"});
        } catch (e) {}
    };

	$("#ok_btn_id").bind('click', function() {
		if(generateQrCode())
			$("#info_div_id").show();
        
        
		return false;
	});
	
	$("#mini_btn_id").bind('click', function() {
		var textareaHeight = $('#target_id').height();
		
		if(textareaHeight > 20) {
			$('#target_id').height(20);
			$("#mini_btn_id").empty().append(lang[language]["mini_btn_id"]);
		}
		else {
			$('#target_id').height(120);
			$("#mini_btn_id").empty().append(lang[language]["full_btn_id"]);
		}
		return false;
	});
	
    $("#history_btn_id").bind('click', function() {
        openHistory();
    });
	
	$("#current_btn_id").bind('click', function() {
		chrome.tabs.getSelected(null, function(tab) {
			$('#target_id').val(tab.url);
		});
		return false;
	});
});
