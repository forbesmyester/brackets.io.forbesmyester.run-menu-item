/*global define, brackets */

/* Worst code ever... There has been no polish and little thought added to this what so ever! */

define(function (/* require, exports, module */) {
    
    "use strict";   
    
    /*global $ */
    
    var CommandManager = brackets.getModule("command/CommandManager"),
        Menus = brackets.getModule("command/Menus"),
        Dialogs         = brackets.getModule("widgets/Dialogs");
    
    var getMatching = function(allCommands, input) {
        return allCommands.filter(function(s) {
            return (s.toLowerCase().indexOf(input.toLowerCase()) > -1);
        }).sort();
    };
    
    var getInput = function(allCommands, cb) {
        // Based on code from Patrick Edelman, but made worse!
        Dialogs.showModalDialogUsingTemplate([
            '<div class="jkfdasjrejj">',
            '<input type="text" autofocus="true" id="jkfdasjrejj"/><br/>',
            '<select multiple="multiple" size="16">',
            '</select>',
            '</div>'
        ].join(' '));
        $('#jkfdasjrejj').keypress(function (e) {
            if (e.which === 13) {
                var _c = $('#jkfdasjrejj').val();
                e.preventDefault();
    
                if (_c === null) {
                    return;
                }
                $('.jkfdasjrejj').fadeOut(300);
                var t = $('.jkfdasjrejj select').find('option:first-child').text();
                Dialogs.cancelModalDialogIfOpen('jkfdasjrejj');
                cb(t);
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
    
    function handleHelloWorld() {
        var allCommands = CommandManager.getAll();
        getInput(allCommands, function(input) {
           if (allCommands.indexOf(input) === -1) { return false;}
           CommandManager.get(input)._commandFn();
        });
    }
    
    // First, register a command - a UI-less object associating an id to a handler
    var MY_COMMAND_ID_A = "forbesmyester.run-menu-item";
    
    CommandManager.register(
        "Rubbish CtrlP Clone",
        MY_COMMAND_ID_A,
        handleHelloWorld.bind(this, '')
    );

    // Then create a menu item bound to the command
    // The label of the menu item is the name we gave the command (see above)
    var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
    menu.addMenuItem(MY_COMMAND_ID_A);

    // We could also add a key binding at the same time:
    //menu.addMenuItem(MY_COMMAND_ID, "Ctrl-Alt-H");
    // (Note: "Ctrl" is automatically mapped to "Cmd" on Mac)
});
