/*global define, brackets */

/* Worst code ever... There has been no polish and little thought added to this what so ever! */

define(function (require, exports, module) {
    
    "use strict";   
    
    /*global $ */
    
    var CommandManager = brackets.getModule("command/CommandManager"),
        Menus = brackets.getModule("command/Menus"),
        Dialogs         = brackets.getModule("widgets/Dialogs"),
		EditorManager = brackets.getModule("editor/EditorManager"),
		PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
		fileMenu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU),
		MY_COMMAND_ID_A = "forbesmyester.run-menu-item",
		MY_COMMAND_ID_B = "forbesmyester.run-menu-item-set-short-command",
		MY_COMMAND_ID_C = "forbesmyester.run-menu-item-run-short-command",
		_prefs = PreferencesManager.getPreferenceStorage(module);
	
    var getMatching = function(allCommands, input) {
		input = input.indexOf(' ') > -1 ? input.substr(0, input.indexOf(' ')).trim() : input;
        return allCommands.filter(function(s) {
			var p = s.indexOf(':');
			if (p > -1) {
				s = s.substr(0, p);
			}
            return (s.toLowerCase().indexOf(input.toLowerCase()) > -1);
        }).sort();
    };
    
    var getInput = function(showShortCodeInput, allCommands, cb) {
        // Based on code from Patrick Edelman, but made worse!
        Dialogs.showModalDialogUsingTemplate([
            '<div class="jkfdasjrejj">',
            '<input type="text" autofocus="true" id="akl4kfklls"/><br/>',
			'<input type="text" autofocus="true" id="jkfdasjrejj"/><br/>',
            '<select multiple="multiple" size="16">',
            '</select>',
            '</div>'
        ].join(' '));
		if (!showShortCodeInput) {
			$('#akl4kfklls').hide();
		}
        $('#jkfdasjrejj').keypress(function (e) {
            if (e.which === 13) {
                var _c = $('#jkfdasjrejj').val();
                e.preventDefault();
    
                if (_c === null) {
                    return;
                }
                $('.jkfdasjrejj').fadeOut(300);
                var t = $('.jkfdasjrejj select').find('option:first-child').text();
				var shortCode = $('#akl4kfklls').val();
				var extraInput = $('#jkfdasjrejj').val().indexOf(' ') > -1 ? 
					$('#jkfdasjrejj').val().substr(
							$('#jkfdasjrejj').val().indexOf(' ')
						).trim() :
					'';
                Dialogs.cancelModalDialogIfOpen('jkfdasjrejj');
                cb(t, shortCode, extraInput);
				EditorManager.focusEditor();
            }
        });
        $('#jkfdasjrejj').keyup(function (e) {
            if (e.which === 13) {
                return;
            }
            $('.jkfdasjrejj').find('select').html('');
            var _c = $('#jkfdasjrejj').val();
            var newCommands = getMatching(allCommands, _c);
            for (var i=0; i<newCommands.length; i++) {
                $('.jkfdasjrejj select').append(
                    $('<option></option>').text(newCommands[i])
                );
            }
        });
    };
    
    function runCommand() {
        var allCommands = CommandManager.getAll();
        getInput(false, allCommands, function(input) {
		if (allCommands.indexOf(input) === -1) { return false;}
			CommandManager.get(input)._commandFn();
        });
    }
	
	function setShortCommand() {
        var allCommands = CommandManager.getAll();
        getInput(true, allCommands, function(commandName, shortCode) {
			_prefs.setValue(shortCode, commandName);
        });
	}
	
	function runShortCommand() {
		var allCommands = CommandManager.getAll(),
			codeCommand = _prefs.getAllValues(),
			k,
			options = [],
			commandName;
		for (k in codeCommand) { if (codeCommand.hasOwnProperty(k)) {
			options.push(k + ': ' + codeCommand[k]);
		} }
        getInput(false, options, function(input, _, extraParams) {
			commandName = input.substr(input.indexOf(':') + 1).trim();
			if (allCommands.indexOf(commandName) === -1) { return false;}
			if (extraParams.length) {
				CommandManager.get(commandName)._commandFn(extraParams);
			} else {
				CommandManager.get(commandName)._commandFn();
			}
        });		
	}
	
    CommandManager.register("Rubbish CtrlP Clone", MY_COMMAND_ID_A, runCommand);
    fileMenu.addMenuItem(MY_COMMAND_ID_A);
    CommandManager.register("Set Short Command", MY_COMMAND_ID_B, setShortCommand);
    fileMenu.addMenuItem(MY_COMMAND_ID_B);
    CommandManager.register("Run Short Command", MY_COMMAND_ID_C, runShortCommand);
    fileMenu.addMenuItem(MY_COMMAND_ID_C);

    // We could also add a key binding at the same time:
    //menu.addMenuItem(MY_COMMAND_ID, "Ctrl-Alt-H");
    // (Note: "Ctrl" is automatically mapped to "Cmd" on Mac)
});
